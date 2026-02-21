"use client";

import Layout from "@/components/Layout";
import { useEffect, useState, useRef, useCallback } from "react";

const TRUST_ITEMS = ["Early Access", "SMS Native", "No App Install", "Personal Memory", "Gift Hints", "Always On"];

const FEATURES = [
  {
    title: "Context that compounds",
    copy: "Nell keeps dates, preferences, and relationship notes tied together, so every reminder carries the right context.",
    icon: "🧠",
  },
  {
    title: "Timing that feels human",
    copy: "Get a three-day signal, day-of backup, and optional draft text so you can follow through under pressure.",
    icon: "⏰",
  },
  {
    title: "Text first simplicity",
    copy: "No dashboards to babysit. You just send a message and Nell handles memory and follow-up in the background.",
    icon: "💬",
  },
];

const STEPS = [
  {
    title: "Tell Nell once",
    copy: "Drop a name, date, and whatever details matter.",
  },
  {
    title: "Nell tracks the thread",
    copy: "She stores preferences and timing in one continuous memory.",
  },
  {
    title: "You show up on time",
    copy: "Get focused reminders with message drafts when needed.",
  },
];

const STATS = [
  { label: "SMS", value: "98%", sublabel: "open rate", width: "98%", color: "#ff6b4a" },
  { label: "Email", value: "20%", sublabel: "open rate", width: "20%", color: "#e8e0d8" },
  { label: "App push", value: "3.5%", sublabel: "open rate", width: "3.5%", color: "#e8e0d8" },
];

const FAQ_ITEMS = [
  {
    q: "What exactly is Nell?",
    a: "Nell is a friendly AI you text. She remembers birthdays, suggests gifts, and helps you show up for your people. No app needed.",
  },
  {
    q: "How much does it cost?",
    a: "Nell is free during early access. We'll introduce simple pricing later, but early users will always get a great deal.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your conversations are encrypted and never sold. Nell only uses your data to help you be a better friend.",
  },
  {
    q: "What if I want to stop?",
    a: "Just text STOP anytime. Your data gets deleted. No guilt trips, no dark patterns.",
  },
];

function useRevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useSMSAnimation() {
  useEffect(() => {
    const bubbles = Array.from(document.querySelectorAll<HTMLElement>(".sms-bubble"));
    if (!bubbles.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.delay || "0", 10);
            setTimeout(() => el.classList.add("is-visible"), delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    bubbles.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, []);
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e8e0d8]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="font-display text-lg sm:text-xl text-[#1a1a2e] group-hover:text-[#ff6b4a] transition-colors duration-300 pr-4">
          {q}
        </span>
        <span
          className="text-2xl text-[#9a918a] transition-transform duration-300 flex-shrink-0"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div className={`faq-answer ${open ? "is-open" : ""}`}>
        <div className="faq-answer-inner">
          <p className="pb-6 text-[#6b6360] leading-relaxed max-w-2xl">{a}</p>
        </div>
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="phone-frame mx-auto max-w-[320px] sm:max-w-[340px]">
      <div className="phone-screen">
        {/* Status bar */}
        <div className="bg-[#f5f5f5] px-6 pt-14 pb-2 flex items-center justify-between text-xs font-semibold text-[#1a1a1a]">
          <span>9:41</span>
          <span className="text-[13px]">Nell</span>
          <span className="flex gap-0.5">
            <span>●●●</span>
          </span>
        </div>

        {/* Messages */}
        <div className="bg-[#f5f5f5] px-4 pb-6 pt-2 space-y-3 min-h-[340px]">
          <div className="sms-bubble sms-bubble-outgoing" data-delay="200">
            Jake birthday July 12. He still likes whiskey and hiking.
          </div>
          <div className="sms-bubble sms-bubble-incoming" data-delay="600">
            Saved! 🎂 I'll remind you 3 days before and again day-of. Want to add anything else about Jake?
          </div>
          <div className="sms-bubble sms-bubble-outgoing" data-delay="1000">
            He loves bourbon. Keep draft texts short.
          </div>
          <div className="sms-bubble sms-bubble-incoming" data-delay="1400">
            Got it — bourbon lover, short drafts. You're all set for July 12.
          </div>
        </div>

        {/* Input bar */}
        <div className="bg-[#f5f5f5] px-4 pb-6 pt-2 border-t border-[#e0e0e0]">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-full border border-[#d0d0d0] px-4 py-2 text-sm text-[#999]">
              Text Message
            </div>
            <div className="w-8 h-8 rounded-full bg-[#ff6b4a] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  useRevealOnScroll();
  useSMSAnimation();

  return (
    <Layout>
      {/* ═══════════ HERO ═══════════ */}
      <section className="hero-gradient relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-8 pt-20">
        <div className="max-w-4xl mx-auto text-center" data-reveal>
          <p className="reveal mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#ff6b4a]">
            Relationship Memory for SMS
          </p>

          <h1 className="reveal font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.92] text-[#1a1a2e]">
            Never forget
            <br />
            <span className="text-[#ff6b4a]">the people</span>
            <br />
            who matter
          </h1>

          <p className="reveal mt-8 max-w-lg mx-auto text-lg sm:text-xl text-[#6b6360] leading-relaxed" style={{ transitionDelay: "150ms" }}>
            Keep dates, details, and follow-up in one thread. Nell nudges you at the right moment so thoughtfulness becomes consistent.
          </p>

          <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-4" style={{ transitionDelay: "250ms" }}>
            <a href="sms:+12795290731" className="btn-primary">
              Text Nell
            </a>
            <a href="#conversation" className="btn-secondary">
              See how it works
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hero-scroll-indicator">
          <span className="text-xs uppercase tracking-[0.2em] text-[#9a918a]">Scroll</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a918a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ═══════════ TRUST MARQUEE ═══════════ */}
      <section className="border-y border-[#e8e0d8] py-5 overflow-hidden">
        <div className="marquee-track">
          {[...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS].map((item, index) => (
            <span key={`${item}-${index}`} className="marquee-item">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════ SMS CONVERSATION ═══════════ */}
      <section id="conversation" className="px-6 sm:px-8 py-28 sm:py-36">
        <div className="mx-auto max-w-6xl grid gap-16 lg:grid-cols-[1fr_1fr] items-center">
          <div data-reveal className="reveal">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#ff6b4a]">
              Conversation Layer
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a1a2e] leading-[0.95]">
              One thread in.
              <br />
              <span className="text-[#9a918a]">High signal out.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-[#6b6360] leading-relaxed">
              Nell turns one text thread into reminders, context recall, and smart draft help so you never scramble at the last minute.
            </p>

            <div className="mt-10 space-y-4">
              {["Three-day heads-up for every important date", "Same-day backup with optional message drafts", "Person-specific memory for gifts and tone"].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-[#ff6b4a] flex-shrink-0" />
                  <span className="text-[#4a3f3a]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="reveal" style={{ transitionDelay: "200ms" }}>
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" className="px-6 sm:px-8 py-28 sm:py-36 bg-[#1a1a2e]">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="reveal mb-16 max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#ff9f7a]">
              Why Nell
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#FFF8F0] leading-[0.95]">
              Nell works with your social brain, not against it.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((item, index) => (
              <article
                key={item.title}
                data-reveal
                className="reveal group rounded-3xl bg-[#252040] p-8 sm:p-10 transition-all duration-500 hover:bg-[#2d2748]"
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <span className="text-4xl mb-6 block">{item.icon}</span>
                <h3 className="font-display text-2xl sm:text-3xl text-[#FFF8F0] mb-4">{item.title}</h3>
                <p className="text-[#a09ab8] leading-relaxed">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="px-6 sm:px-8 py-28 sm:py-36">
        <div className="mx-auto max-w-5xl">
          <div data-reveal className="reveal text-center mb-20">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#ff6b4a]">
              Why SMS
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a1a2e] leading-[0.95]">
              Texts get read.<br />
              <span className="text-[#9a918a]">Everything else gets buried.</span>
            </h2>
          </div>

          <div data-reveal className="reveal grid gap-12 md:grid-cols-3">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="text-center" style={{ transitionDelay: `${i * 150}ms` }}>
                <p className="font-display text-[clamp(4rem,8vw,6rem)] leading-none text-[#1a1a2e]" style={{ color: stat.color === "#ff6b4a" ? "#ff6b4a" : "#c8c0b8" }}>
                  {stat.value}
                </p>
                <p className="mt-2 text-sm uppercase tracking-[0.15em] font-semibold text-[#6b6360]">
                  {stat.label} {stat.sublabel}
                </p>
                <div className="stat-bar mt-4">
                  <div
                    className="stat-bar-fill"
                    style={{ width: stat.width, backgroundColor: stat.color, transitionDelay: `${i * 200 + 400}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WORKFLOW / STEPS ═══════════ */}
      <section className="px-6 sm:px-8 py-28 sm:py-36 border-t border-[#e8e0d8]">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="reveal mb-16 max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#ff6b4a]">
              Workflow
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a1a2e] leading-[0.95]">
              Set up in under one minute.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <article
                key={step.title}
                data-reveal
                className="reveal relative"
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <span className="font-display text-8xl text-[#ff6b4a]/10 absolute -top-4 -left-2 select-none">
                  {index + 1}
                </span>
                <div className="relative pt-12">
                  <h3 className="font-display text-2xl sm:text-3xl text-[#1a1a2e] mb-3">{step.title}</h3>
                  <p className="text-[#6b6360] leading-relaxed">{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="px-6 sm:px-8 py-28 sm:py-36 border-t border-[#e8e0d8]">
        <div className="mx-auto max-w-3xl">
          <div data-reveal className="reveal mb-12">
            <h2 className="font-display text-4xl sm:text-5xl text-[#1a1a2e]">
              Questions
            </h2>
          </div>

          <div data-reveal className="reveal">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="px-6 sm:px-8 py-28 sm:py-36 bg-gradient-to-br from-[#ff6b4a] via-[#ff8a6a] to-[#ff9f7a] relative overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />

        <div className="relative mx-auto max-w-4xl text-center" data-reveal>
          <p className="reveal text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-6">
            Ready
          </p>
          <h2 className="reveal font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.95]">
            Build better friendship follow-through with one text.
          </h2>
          <p className="reveal mt-6 max-w-2xl mx-auto text-lg text-white/80 leading-relaxed" style={{ transitionDelay: "100ms" }}>
            Nell is live in early access. Start the thread and let memory run in the background.
          </p>

          <div className="reveal mt-10" style={{ transitionDelay: "200ms" }}>
            <a
              href="sms:+12795290731"
              className="inline-block bg-[#1a1a2e] text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-black transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              Text Nell at (279) 529-0731
            </a>
          </div>
          <p className="reveal mt-5 text-sm text-white/60" style={{ transitionDelay: "300ms" }}>
            No app install required
          </p>
        </div>
      </section>
    </Layout>
  );
}
