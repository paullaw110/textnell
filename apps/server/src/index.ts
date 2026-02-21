import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { getOrCreateUser, addMessage, getPendingResearch, getGiftCatalogStats } from './db';
import { chatGemini as chat } from './conversation-gemini';
import { chatGemini } from './conversation-gemini';
import { sendSMS } from './twilio-client';
import { startReminderScheduler, testReminderCheck } from './reminders';

dotenv.config();

const app = new Hono();
const PORT = 3001;

// ============================================
// Rate Limiting & Abuse Protection
// ============================================

const MAX_MSG_LENGTH = 500;
const RATE_LIMIT_PER_MINUTE = 5;
const RATE_LIMIT_PER_DAY = 50;

// In-memory rate tracking (resets on server restart — fine for now)
const rateLimits = new Map<string, { minute: number[]; day: number[] }>();
const blocklist = new Set<string>();

function isRateLimited(identifier: string): { limited: boolean; reason?: string } {
  if (blocklist.has(identifier)) {
    return { limited: true, reason: 'blocked' };
  }

  const now = Date.now();
  const oneMinuteAgo = now - 60_000;
  const oneDayAgo = now - 86_400_000;

  if (!rateLimits.has(identifier)) {
    rateLimits.set(identifier, { minute: [], day: [] });
  }

  const limits = rateLimits.get(identifier)!;

  // Clean old entries
  limits.minute = limits.minute.filter(t => t > oneMinuteAgo);
  limits.day = limits.day.filter(t => t > oneDayAgo);

  if (limits.minute.length >= RATE_LIMIT_PER_MINUTE) {
    return { limited: true, reason: 'Too many messages. Slow down a bit.' };
  }
  if (limits.day.length >= RATE_LIMIT_PER_DAY) {
    return { limited: true, reason: 'Daily message limit reached. Try again tomorrow.' };
  }

  limits.minute.push(now);
  limits.day.push(now);
  return { limited: false };
}

function sanitizeMessage(text: string): string {
  return text.slice(0, MAX_MSG_LENGTH).trim();
}

// Clean up rate limit map every hour to prevent memory leak
setInterval(() => {
  const oneDayAgo = Date.now() - 86_400_000;
  for (const [key, limits] of rateLimits.entries()) {
    limits.day = limits.day.filter(t => t > oneDayAgo);
    if (limits.day.length === 0) rateLimits.delete(key);
  }
}, 3_600_000);

// Start the reminder scheduler
startReminderScheduler();

// Landing page
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nell — Never forget a birthday again</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #0a0a0a;
            --bg-secondary: #111111;
            --bg-tertiary: #1a1a1a;
            --text-primary: #ffffff;
            --text-secondary: #a0a0a0;
            --text-tertiary: #666666;
            --accent: #ff7849;
            --accent-hover: #ff8a61;
            --border: #2a2a2a;
            --card-bg: #141414;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .header {
            padding: 20px 0;
            border-bottom: 1px solid var(--border);
        }

        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 24px;
            font-weight: 700;
            color: var(--accent);
        }

        .phone {
            color: var(--text-secondary);
            font-size: 16px;
            font-family: 'SF Mono', Monaco, monospace;
        }

        .hero {
            padding: 80px 0 120px 0;
            text-align: center;
        }

        .hero h1 {
            font-size: clamp(36px, 5vw, 64px);
            font-weight: 700;
            margin-bottom: 24px;
            line-height: 1.1;
        }

        .hero .subtitle {
            font-size: 20px;
            color: var(--text-secondary);
            margin-bottom: 40px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .hero-phone {
            display: inline-block;
            background: var(--card-bg);
            border: 1px solid var(--border);
            padding: 16px 32px;
            border-radius: 12px;
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 24px;
            font-weight: 600;
            color: var(--accent);
            margin-bottom: 32px;
            letter-spacing: 0.5px;
        }

        .cta-button {
            display: inline-block;
            background: var(--accent);
            color: white;
            padding: 16px 32px;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .cta-button:hover {
            background: var(--accent-hover);
            transform: translateY(-1px);
        }

        .section {
            padding: 80px 0;
            border-bottom: 1px solid var(--border);
        }

        .section:last-of-type {
            border-bottom: none;
        }

        .section h2 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 16px;
            text-align: center;
        }

        .section-subtitle {
            color: var(--text-secondary);
            font-size: 18px;
            text-align: center;
            margin-bottom: 48px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 32px;
            max-width: 900px;
            margin: 0 auto;
        }

        .step {
            text-align: center;
            padding: 32px;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
        }

        .step-icon {
            font-size: 48px;
            margin-bottom: 20px;
            display: block;
        }

        .step h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
        }

        .step p {
            color: var(--text-secondary);
            line-height: 1.5;
        }

        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .feature {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 32px;
        }

        .feature h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .feature-tag {
            background: var(--accent);
            color: white;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }

        .feature p {
            color: var(--text-secondary);
            line-height: 1.5;
        }

        .pricing-card {
            background: var(--card-bg);
            border: 2px solid var(--accent);
            border-radius: 16px;
            padding: 48px;
            text-align: center;
            max-width: 400px;
            margin: 0 auto;
        }

        .pricing-badge {
            background: var(--accent);
            color: white;
            font-size: 14px;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            margin-bottom: 24px;
        }

        .pricing-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .pricing-description {
            color: var(--text-secondary);
            margin-bottom: 32px;
        }

        .footer {
            background: var(--bg-secondary);
            border-top: 1px solid var(--border);
            padding: 48px 0;
            text-align: center;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 32px;
            margin-bottom: 24px;
            flex-wrap: wrap;
        }

        .footer-links a {
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .footer-links a:hover {
            color: var(--accent);
        }

        .copyright {
            color: var(--text-tertiary);
            font-size: 14px;
        }

        @media (max-width: 768px) {
            .hero { padding: 60px 0 80px 0; }
            .hero-phone { font-size: 20px; padding: 12px 24px; }
            .section { padding: 60px 0; }
            .steps, .features { grid-template-columns: 1fr; gap: 20px; }
            .pricing-card { padding: 32px 24px; }
            .footer-links { gap: 24px; flex-direction: column; }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <div class="logo">Nell</div>
                <div class="phone">(279) 529-0731</div>
            </nav>
        </div>
    </header>
    <main>
        <section class="hero">
            <div class="container">
                <h1>Never forget a birthday again.</h1>
                <p class="subtitle">Text Nell to track birthdays naturally. Get reminded when they're coming up. It's like having a personal assistant who actually remembers.</p>
                <div class="hero-phone">(279) 529-0731</div>
                <a href="sms:(279) 529-0731?body=Hi%20Nell!" class="cta-button">Text Nell now</a>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <h2>How it works</h2>
                <p class="section-subtitle">Three simple steps to never miss another birthday</p>
                <div class="steps">
                    <div class="step"><span class="step-icon">💬</span><h3>1. Text Nell</h3><p>Send a message to (279) 529-0731. Just start talking naturally about someone's birthday.</p></div>
                    <div class="step"><span class="step-icon">📅</span><h3>2. Add birthdays naturally</h3><p>Say things like "My mom's birthday is June 15th" or "Remind me about Jake's birthday on March 3rd"</p></div>
                    <div class="step"><span class="step-icon">🎂</span><h3>3. Get reminded</h3><p>Nell will text you a few days before each birthday with gift ideas and friendly reminders.</p></div>
                </div>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <h2>Features</h2>
                <p class="section-subtitle">Everything you need to stay connected with the people you care about</p>
                <div class="features">
                    <div class="feature"><h3>🤖 Conversational AI</h3><p>Talk to Nell like a friend. No commands to remember, no complex interfaces.</p></div>
                    <div class="feature"><h3>⏰ Smart reminders</h3><p>Configure how many days ahead you want to be reminded. Default is 3 days.</p></div>
                    <div class="feature"><h3>🎁 Gift tracking</h3><p>Log gifts you've given and get suggestions based on interests you've tracked.</p></div>
                    <div class="feature"><h3>📱 Personal CRM</h3><p>Track interests, preferences, anniversaries, and important details about everyone you care about.</p></div>
                </div>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <h2>Pricing</h2>
                <p class="section-subtitle">Simple, transparent pricing</p>
                <div class="pricing-card">
                    <div class="pricing-badge">Early access — free</div>
                    <h3 class="pricing-title">Beta Access</h3>
                    <p class="pricing-description">Free access during our beta period. Help us build the perfect relationship manager.</p>
                    <a href="sms:(279) 529-0731?body=Hi%20Nell!" class="cta-button">Get started free</a>
                </div>
            </div>
        </section>
    </main>
    <footer class="footer">
        <div class="container">
            <div class="footer-links">
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
            </div>
            <p class="copyright">© 2026 Nell. Made with care for busy people who want to stay connected.</p>
        </div>
    </footer>
</body>
</html>`);
});

// Privacy Policy
app.get('/privacy', (c) => {
  return c.html(`<!DOCTYPE html><html><head><title>Nell - Privacy Policy</title>
<style>body{font-family:system-ui,sans-serif;max-width:680px;margin:40px auto;padding:0 20px;color:#333;line-height:1.6}</style></head><body>
<h1>Nell — Privacy Policy</h1>
<p><strong>Last updated:</strong> February 18, 2026</p>
<h2>What We Collect</h2><p>When you use Nell, we collect:</p>
<ul><li>Your phone number (to send and receive messages)</li><li>Names and birthdays of contacts you add</li><li>Notes and preferences you share about your contacts</li><li>Message history for conversation context</li></ul>
<h2>How We Use Your Data</h2><p>Your data is used solely to provide birthday reminders and contact management. We do not sell, share, or distribute your personal information to third parties.</p>
<h2>Data Storage</h2><p>Your data is stored securely in Turso (edge SQLite) and is not shared with any third parties except as needed to deliver SMS messages (via Twilio).</p>
<h2>AI Processing</h2><p>Messages are processed using AI (Anthropic Claude) to understand your requests. Message content is sent to the AI provider for processing but is not stored by them for training purposes.</p>
<h2>Opt-Out</h2><p>You can stop using Nell at any time by texting STOP. To delete your data, text DELETE MY DATA.</p>
<h2>Contact</h2><p>Questions? Email lawrencep.design@gmail.com</p>
</body></html>`);
});

// Terms of Service
app.get('/terms', (c) => {
  return c.html(`<!DOCTYPE html><html><head><title>Nell - Terms of Service</title>
<style>body{font-family:system-ui,sans-serif;max-width:680px;margin:40px auto;padding:0 20px;color:#333;line-height:1.6}</style></head><body>
<h1>Nell — Terms of Service</h1>
<p><strong>Last updated:</strong> February 18, 2026</p>
<h2>Service Description</h2><p>Nell is an SMS-based personal CRM and birthday reminder service.</p>
<h2>Messaging</h2><ul><li><strong>Program name:</strong> Nell Birthday Reminders</li><li><strong>Message frequency:</strong> Varies. Typically 1-5 messages per week.</li><li><strong>Message and data rates may apply.</strong></li></ul>
<h2>Opt-In</h2><p>By sending your first message to Nell, you consent to receive SMS messages including birthday reminders and conversational responses.</p>
<h2>Opt-Out</h2><p>Text <strong>STOP</strong> at any time to stop receiving messages. Text <strong>HELP</strong> for assistance.</p>
<h2>Support</h2><p>For help, text HELP or email lawrencep.design@gmail.com</p>
<h2>Limitation of Liability</h2><p>Nell is provided "as is." We are not responsible for missed reminders or inaccurate information.</p>
</body></html>`);
});

// Test reminder endpoint
app.get('/test-reminders', async (c) => {
  try {
    await testReminderCheck();
    return c.text('Test reminder check completed');
  } catch (error) {
    console.error('Test reminder error:', error);
    return c.text('Test reminder check failed', 500);
  }
});

// ============================================
// Gift Research Queue API
// ============================================

app.get('/api/gift-gaps', async (c) => {
  try {
    const pending = await getPendingResearch();
    const stats = await getGiftCatalogStats();
    return c.json({ pending, catalogStats: stats });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// Web Chat API
// ============================================

// A/B comparison endpoint — sends same message to both models
app.post('/api/compare', async (c) => {
  try {
    const { message, sessionId } = await c.req.json();
    if (!message || !sessionId) return c.json({ error: 'message and sessionId required' }, 400);

    const sanitized = message.slice(0, 500).trim();

    // Create separate users for each model so they don't share history
    const sonnetUser = await getOrCreateUser(`compare-sonnet:${sessionId}`);
    const geminiUser = await getOrCreateUser(`compare-gemini:${sessionId}`);

    await addMessage(sonnetUser.id, 'user', sanitized, 'web');
    await addMessage(geminiUser.id, 'user', sanitized, 'web');

    const [sonnetReply, geminiReply] = await Promise.allSettled([
      chat(sonnetUser.id, sanitized),
      chatGemini(geminiUser.id, sanitized),
    ]);

    const sonnetText = sonnetReply.status === 'fulfilled' ? sonnetReply.value : `Error: ${(sonnetReply as any).reason?.message}`;
    const geminiText = geminiReply.status === 'fulfilled' ? geminiReply.value : `Error: ${(geminiReply as any).reason?.message}`;

    await addMessage(sonnetUser.id, 'assistant', sonnetText, 'web');
    await addMessage(geminiUser.id, 'assistant', geminiText, 'web');

    return c.json({ sonnet: sonnetText, gemini: geminiText });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.post('/api/chat', async (c) => {
  try {
    const { message, sessionId } = await c.req.json();
    
    if (!message || !sessionId) {
      return c.json({ error: 'message and sessionId required' }, 400);
    }

    // Rate limit by session
    const rateCheck = isRateLimited(`web:${sessionId}`);
    if (rateCheck.limited) {
      return c.json({ reply: rateCheck.reason || 'Slow down.' }, 200);
    }

    const sanitized = sanitizeMessage(message);
    if (!sanitized) {
      return c.json({ error: 'Empty message' }, 400);
    }

    const webPhone = `web:${sessionId}`;
    const user = await getOrCreateUser(webPhone);

    await addMessage(user.id, 'user', sanitized, 'web');
    const replyText = await chat(user.id, sanitized);
    await addMessage(user.id, 'assistant', replyText, 'web');

    return c.json({ reply: replyText });
  } catch (error) {
    console.error('Web chat error:', error);
    return c.json({ error: 'Something went wrong' }, 500);
  }
});

// Web chat UI
app.get('/chat', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat with Nell</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FFF8F0; height: 100vh; display: flex; flex-direction: column; }
    .header { background: white; border-bottom: 1px solid #e5e7eb; padding: 16px 20px; display: flex; align-items: center; gap: 12px; }
    .header .avatar { width: 40px; height: 40px; background: #ff6b4a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    .header h1 { font-size: 18px; color: #1a1a2e; }
    .header .badge { font-size: 12px; background: #FFD93D; color: #1a1a2e; padding: 2px 8px; border-radius: 99px; font-weight: 600; }
    .messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
    .msg { max-width: 80%; padding: 12px 16px; border-radius: 18px; font-size: 15px; line-height: 1.5; animation: slideIn 0.3s ease-out; }
    .msg.nell { align-self: flex-start; background: white; color: #1a1a2e; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px; }
    .msg.user { align-self: flex-end; background: #ff6b4a; color: white; border-bottom-right-radius: 4px; }
    .msg.system { align-self: center; background: #FFD93D20; color: #6b7280; font-size: 13px; border-radius: 99px; padding: 6px 16px; }
    .input-area { background: white; border-top: 1px solid #e5e7eb; padding: 16px 20px; display: flex; gap: 12px; }
    .input-area input { flex: 1; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 99px; font-size: 15px; outline: none; transition: border-color 0.2s; }
    .input-area input:focus { border-color: #ff6b4a; }
    .input-area button { background: #ff6b4a; color: white; border: none; border-radius: 50%; width: 44px; height: 44px; font-size: 18px; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; }
    .input-area button:hover { background: #e55a3a; }
    .input-area button:disabled { background: #ccc; cursor: not-allowed; }
    .typing { align-self: flex-start; padding: 12px 16px; }
    .typing span { display: inline-block; width: 8px; height: 8px; background: #ccc; border-radius: 50%; animation: bounce 1.4s infinite; }
    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
  </style>
</head>
<body>
  <div class="header">
    <div class="avatar">🎂</div>
    <div><h1>Nell</h1></div>
    <div class="badge">Web Preview</div>
  </div>
  <div class="messages" id="messages">
    <div class="msg system">Send a message to start chatting with Nell</div>
  </div>
  <div class="input-area">
    <input type="text" id="input" placeholder="Tell Nell about a birthday..." autocomplete="off" />
    <button id="send" onclick="sendMsg()">↑</button>
  </div>
  <script>
    const sessionId = crypto.randomUUID();
    const messagesEl = document.getElementById('messages');
    const inputEl = document.getElementById('input');
    const sendBtn = document.getElementById('send');
    let sending = false;
    inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !sending) sendMsg(); });
    async function sendMsg() {
      const text = inputEl.value.trim();
      if (!text || sending) return;
      sending = true; sendBtn.disabled = true; inputEl.value = '';
      addMsg(text, 'user');
      const typing = document.createElement('div');
      typing.className = 'typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(typing);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      try {
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, sessionId }) });
        const data = await res.json();
        typing.remove();
        addMsg(data.reply || data.error, data.reply ? 'nell' : 'system');
      } catch (err) { typing.remove(); addMsg('Connection error — try again', 'system'); }
      sending = false; sendBtn.disabled = false; inputEl.focus();
    }
    function addMsg(text, type) {
      const div = document.createElement('div');
      div.className = 'msg ' + type;
      div.textContent = text;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  </script>
</body>
</html>`);
});

// ============================================
// SMS Webhook
// ============================================

const EMPTY_TWIML = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

app.post('/sms', async (c) => {
  const body = await c.req.parseBody();
  const fromPhone = body.From as string;
  const messageContent = body.Body as string;

  if (!fromPhone || !messageContent) {
    console.error('Missing required fields in Twilio webhook');
    return c.text(EMPTY_TWIML, 200, { 'Content-Type': 'application/xml' });
  }

  console.log(`Received SMS from ${fromPhone}: ${messageContent}`);

  // Rate limit by phone number
  const rateCheck = isRateLimited(fromPhone);
  if (rateCheck.limited) {
    console.log(`Rate limited: ${fromPhone} — ${rateCheck.reason}`);
    if (rateCheck.reason !== 'blocked') {
      (async () => { try { await sendSMS(fromPhone, rateCheck.reason || 'Slow down.'); } catch {} })();
    }
    return c.text(EMPTY_TWIML, 200, { 'Content-Type': 'application/xml' });
  }

  const sanitized = sanitizeMessage(messageContent);

  (async () => {
    try {
      const user = await getOrCreateUser(fromPhone);
      await addMessage(user.id, 'user', sanitized, 'sms');
      const replyText = await chat(user.id, sanitized);
      await addMessage(user.id, 'assistant', replyText, 'sms');
      await sendSMS(fromPhone, replyText);
      console.log(`Replied to ${fromPhone}: ${replyText}`);
    } catch (error) {
      console.error('Error processing SMS:', error);
      try {
        await sendSMS(fromPhone, "Sorry, I ran into an issue. Please try again in a moment.");
      } catch (sendErr) {
        console.error('Failed to send error reply:', sendErr);
      }
    }
  })();

  return c.text(EMPTY_TWIML, 200, { 'Content-Type': 'application/xml' });
});

app.onError((err, c) => {
  console.error('Server error:', err);
  return c.text('Internal Server Error', 500);
});

app.notFound((c) => {
  return c.text('Not Found', 404);
});

console.log(`Starting Nell SMS Bot on port ${PORT}...`);

serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`🎂 Nell SMS Bot is running on http://localhost:${info.port}`);
  console.log(`Webhook URL: http://localhost:${info.port}/sms`);
  console.log('Ready to receive SMS messages via Twilio!');
});

process.on('SIGINT', () => { console.log('Shutting down...'); process.exit(0); });
process.on('SIGTERM', () => { console.log('Shutting down...'); process.exit(0); });
