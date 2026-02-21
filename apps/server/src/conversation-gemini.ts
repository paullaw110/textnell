import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  getContacts, getContact, createContact, updateContact, deleteContact,
  addInterest, getInterests, addOccasion, getUpcomingOccasions,
  addMessage, getRecentMessages, addGiftRecord, getGiftHistory,
  updateUserPreferences, getAllContacts, getOrCreateUser,
  searchGifts, checkAndQueueGiftGaps,
} from './db';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

const SYSTEM_PROMPT = `You are Nell. You help people remember the important stuff about the people in their lives — birthdays, interests, gift ideas, the details that make someone feel known.

## Your personality

Think Stevie Budd from Schitt's Creek. Dry, understated, genuinely caring underneath a low-key exterior. You don't perform enthusiasm. You just get things done and occasionally say something that makes someone smile.

Core traits:
- Deadpan helpful. You do the thing without making a production of it. "Jake. July 12. Bourbon and hiking. Got it." No "Awesome!" No "I'd love to help!" Just competence.
- Dry humor when it fits. Not forced. Not every message. But when the moment is right: "Four people in ten minutes. You're either really organized or really behind."
- Short. This is SMS. 1-3 sentences max. You don't over-explain. You don't add filler.
- Genuine underneath. You actually care about helping people show up for their relationships. You just don't get sappy about it.
- No fake cheeriness. Never say: "Great!", "Awesome!", "I'd be happy to!", "Absolutely!", "That's wonderful!" These are banned.
- Emoji: rare. Maybe one per conversation when it actually adds something. Never multiple. Never as decoration.
- No exclamation marks by default. Use them only for genuine emphasis. Periods are confident, not cold.

## How you talk

Adding someone: "Sarah. March 15. Noted." / "Got it. Jake likes bourbon — useful come July."
If someone adds a contact WITHOUT a birthday, always ask for it after confirming: "Got it. When's their birthday? Makes the gift timing thing actually work."

CRITICAL: When the user gives you enough info to add a contact (name + birthday), you MUST call the add_contact tool. Do NOT just say "Noted" without calling the tool. The contact is not saved until you call add_contact. Same for add_interest — if the user mentions an interest, call the tool. Never pretend you did something you didn't.
Reminders: "Jake's birthday is Saturday. He's into bourbon — want gift ideas or are you handling it?"
Gift ideas: ALWAYS use search_gifts tool first to find real products from the curated database. Present 2-3 with prices and links. Add your opinion: "The hiking socks are the safe bet. The whiskey stones are if you want to look like you tried harder than you did." If the database has no results for a category, say so honestly and suggest they check back later.
Message drafts: Casual, natural. "Happy birthday dude, hope it's a good one. Overdue for a hike when you're free."
When thanked: "That's what I'm here for." or just move on.
Off-topic: "I'm flattered but I really only do the people-remembering thing. Very niche."
Forgotten birthday: No guilt. "That one slipped. Want me to draft a belated text? Those can actually land better."

## What you NEVER do
- Send unsolicited texts about contacting people
- Judge someone's relationships or communication habits
- Add fake enthusiasm or cheerleader energy
- Over-explain or pad responses with filler
- Use: "No worries!", "Of course!", "Sure thing!", "Happy to help!"

## Date parsing
Flexible: "the 29th" = current or next month. "Feb 6" = 02-06. "July 12th" = 07-12.
Names: capitalize properly. "charlie" → "Charlie"
Context: "update it" or "yes" — use conversation history.
Birthday format: MM-DD.`;

const toolDeclarations: any[] = [
  {
    name: 'add_contact',
    description: 'Add a new person with their birthday',
    parameters: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING", description: 'Person\'s name (capitalized)' },
        birthday: { type: "STRING", description: 'Birthday MM-DD format' },
        relationship: { type: "STRING", description: 'Relationship type' },
        notes: { type: "STRING", description: 'Notes about them' },
      },
      required: ['name', 'birthday'],
    },
  },
  {
    name: 'get_contact',
    description: 'Look up a contact by name',
    parameters: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING", description: 'Name to look up' },
      },
      required: ['name'],
    },
  },
  {
    name: 'update_contact',
    description: 'Update contact info',
    parameters: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING", description: 'Name to update' },
        birthday: { type: "STRING", description: 'New birthday MM-DD' },
        notes: { type: "STRING", description: 'Notes to add' },
        relationship: { type: "STRING", description: 'Relationship' },
      },
      required: ['name'],
    },
  },
  {
    name: 'list_all_contacts',
    description: 'List all saved contacts',
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
  {
    name: 'list_upcoming',
    description: 'List upcoming birthdays and occasions',
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
  {
    name: 'add_interest',
    description: 'Add a structured interest to a contact. Use a specific but consistent category name. Common categories: spirits, cooking, outdoors, fitness, gaming, reading, tech, music, art, gardening, pets, home_decor, fashion, travel, photography, sports, beauty, film, crafts, cars, cycling, running, yoga, climbing, surfing, skiing, golf, tennis, pickleball, fishing, camping, coffee, wine, beer, baking. Use these when they fit. For new/niche interests, use a lowercase_underscore name that\'s specific (e.g. "board_games" not "games", "bourbon" not "drinks"). Put the rich detail in specifics.',
    parameters: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING", description: 'Contact name' },
        category: { type: "STRING", description: 'Interest category (lowercase_underscore, specific but consistent)' },
        specifics: { type: "STRING", description: 'Specific details — the richer the better. "loves Woodford Reserve, has a home bar, prefers neat" not just "bourbon"' },
      },
      required: ['name', 'category', 'specifics'],
    },
  },
  {
    name: 'add_occasion',
    description: 'Add anniversary or custom date',
    parameters: {
      type: "OBJECT",
      properties: {
        contactName: { type: "STRING", description: 'Contact name' },
        type: { type: "STRING", description: 'birthday, anniversary, or custom' },
        date: { type: "STRING", description: 'Date MM-DD' },
        label: { type: "STRING", description: 'Label for the occasion' },
      },
      required: ['contactName', 'type', 'date'],
    },
  },
  {
    name: 'log_gift',
    description: 'Record a gift given to someone',
    parameters: {
      type: "OBJECT",
      properties: {
        contactName: { type: "STRING", description: 'Who received the gift' },
        description: { type: "STRING", description: 'What the gift was' },
        amount: { type: "NUMBER", description: 'How much it cost' },
      },
      required: ['contactName', 'description'],
    },
  },
  {
    name: 'relationship_summary',
    description: 'Get full summary of a contact',
    parameters: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING", description: 'Contact name' },
      },
      required: ['name'],
    },
  },
  {
    name: 'set_reminder_days',
    description: 'Set default reminder days before events',
    parameters: {
      type: "OBJECT",
      properties: {
        days: { type: "NUMBER", description: 'Days before (1-30)' },
      },
      required: ['days'],
    },
  },
  {
    name: 'search_gifts',
    description: 'Search the curated gift database by interest category. Returns real products with prices and purchase links. Use when suggesting gifts for a contact based on their interests. Always pass contactName if you know who the gift is for.',
    parameters: {
      type: "OBJECT",
      properties: {
        category: { type: "STRING", description: 'Interest or hobby to search for (e.g. bourbon, pickleball, yoga, photography, cooking). Be specific — "bourbon" is better than "spirits".' },
        subcategory: { type: "STRING", description: 'Optional further specificity (e.g. mezcal, espresso)' },
        priceRange: { type: "STRING", description: 'Optional: budget (~$25), mid (~$50), or premium (~$100+)' },
        contactName: { type: "STRING", description: 'Name of the contact the gift is for (helps improve future recommendations)' },
      },
      required: ['category'],
    },
  },
  {
    name: 'delete_contact',
    description: 'Remove a contact',
    parameters: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING", description: 'Name to remove' },
      },
      required: ['name'],
    },
  },
];

// Reuse the same tool execution logic from conversation.ts
async function executeTool(toolName: string, input: any, userId: string): Promise<string> {
  try {
    switch (toolName) {
      case 'add_contact': {
        const existing = await getContact(userId, input.name);
        if (existing) return JSON.stringify({ status: 'exists', contact: existing });
        const contact = await createContact(userId, { name: input.name, birthday: input.birthday, relationship: input.relationship } as any);
        // If notes contain interest hints, Gemini will call add_interest separately — gap detection happens there
        return JSON.stringify({ status: 'created', contact });
      }
      case 'get_contact': {
        const contact = await getContact(userId, input.name);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.name });
        const interests = await getInterests(contact.id);
        return JSON.stringify({ status: 'found', contact, interests });
      }
      case 'update_contact': {
        const contact = await getContact(userId, input.name);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.name });
        const updated = await updateContact(contact.id, { birthday: input.birthday, notes: input.notes, relationship: input.relationship } as any);
        return JSON.stringify({ status: 'updated', contact: updated });
      }
      case 'list_all_contacts': {
        const contacts = await getAllContacts(userId);
        return JSON.stringify({ status: 'ok', contacts });
      }
      case 'list_upcoming': {
        const occasions = await getUpcomingOccasions(userId, 30);
        return JSON.stringify({ status: 'ok', occasions });
      }
      case 'add_interest': {
        const contact = await getContact(userId, input.name);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.name });
        await addInterest(contact.id, input.category, input.specifics, 'user_stated');
        // Check gift catalog gaps — queue research if <3 products for this category
        const gap = await checkAndQueueGiftGaps(contact.id, input.category, input.specifics);
        if (gap) {
          console.log(`Gift gap detected: "${input.category}" has <3 products. Queued research (deadline: ${gap.deadline || 'none'}).`);
        }
        return JSON.stringify({ status: 'added', interest: { category: input.category, specifics: input.specifics } });
      }
      case 'add_occasion': {
        const contact = await getContact(userId, input.contactName);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.contactName });
        await addOccasion(contact.id, userId, input.type, input.date, input.label, 3);
        return JSON.stringify({ status: 'added' });
      }
      case 'log_gift': {
        const contact = await getContact(userId, input.contactName);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.contactName });
        await addGiftRecord(userId, contact.id, { description: input.description, amount: input.amount, dateGiven: new Date().toISOString().slice(0,10) });
        return JSON.stringify({ status: 'logged' });
      }
      case 'relationship_summary': {
        const contact = await getContact(userId, input.name);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.name });
        const interests = await getInterests(contact.id);
        const gifts = await getGiftHistory(contact.id);
        return JSON.stringify({ status: 'ok', contact, interests, gifts });
      }
      case 'set_reminder_days': {
        await updateUserPreferences(userId, { reminderDaysDefault: input.days });
        return JSON.stringify({ status: 'updated', days: input.days });
      }
      case 'search_gifts': {
        // Try to find the contact for gap detection on misses
        let contactId: string | undefined;
        if (input.contactName) {
          const c = await getContact(userId, input.contactName);
          if (c) contactId = c.id;
        }
        const results = await searchGifts(input.category, {
          subcategory: input.subcategory,
          priceRange: input.priceRange,
          limit: 5,
          contactId,
        });
        if (results.length === 0) {
          return JSON.stringify({ status: 'no_results', category: input.category, message: 'No gifts found for this category yet. I\'ve flagged it — check back soon.' });
        }
        return JSON.stringify({
          status: 'ok',
          gifts: results.map(g => ({
            name: g.name,
            description: g.description,
            price: g.priceEstimate ? `~$${g.priceEstimate}` : g.priceRange,
            url: g.affiliateUrl || g.purchaseUrl || null,
            source: g.source,
            tags: g.tags ? JSON.parse(g.tags) : [],
          })),
        });
      }
      case 'delete_contact': {
        const contact = await getContact(userId, input.name);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.name });
        await deleteContact(contact.id, userId);
        return JSON.stringify({ status: 'deleted', name: contact.name });
      }
      default:
        return JSON.stringify({ status: 'error', message: 'Unknown tool' });
    }
  } catch (error: any) {
    console.error(`Gemini tool ${toolName} error:`, error);
    return JSON.stringify({ status: 'error', message: error.message });
  }
}

export async function chatGemini(userId: string, userMessage: string): Promise<string> {
  const recentMessages = await getRecentMessages(userId, 20);
  const history = recentMessages.map((msg: any) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  // Inject current date so Nell can resolve "tomorrow", "next week", etc.
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Los_Angeles' });
  const dynamicPrompt = SYSTEM_PROMPT + `\n\n## Current date\nToday is ${dateStr}. Use this to resolve relative dates like "tomorrow", "next week", "this Saturday", etc. Convert them to MM-DD format before calling tools.`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: dynamicPrompt,
    tools: [{ functionDeclarations: toolDeclarations }],
  });

  const chatSession = model.startChat({ history });
  let response = await chatSession.sendMessage(userMessage);

  // Handle tool calls (max 5 iterations)
  let iterations = 0;
  while (iterations < 5) {
    const candidate = response.response.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const functionCalls = parts.filter((p: any) => p.functionCall);

    if (functionCalls.length === 0) break;
    iterations++;

    const functionResponses = [];
    for (const part of functionCalls) {
      const fc = (part as any).functionCall;
      console.log(`Gemini tool call: ${fc.name}(${JSON.stringify(fc.args)})`);
      const result = await executeTool(fc.name, fc.args, userId);
      console.log(`Gemini tool result: ${result}`);
      functionResponses.push({
        functionResponse: {
          name: fc.name,
          response: JSON.parse(result),
        },
      });
    }

    response = await chatSession.sendMessage(functionResponses);
  }

  // Extract text
  const finalCandidate = response.response.candidates?.[0];
  if (!finalCandidate?.content?.parts?.some((p: any) => p.text)) {
    console.log('Gemini returned no text parts. Candidate:', JSON.stringify(finalCandidate?.content?.parts?.map((p: any) => Object.keys(p))));
    // If tools ran successfully but Gemini didn't generate text, nudge it
    if (iterations > 0) {
      try {
        const nudge = await chatSession.sendMessage('Please confirm what you just did in a brief response.');
        const nudgeText = nudge.response.candidates?.[0]?.content?.parts
          ?.filter((p: any) => p.text)
          ?.map((p: any) => p.text)
          ?.join('');
        if (nudgeText) return nudgeText;
      } catch (e) {
        console.error('Nudge failed:', e);
      }
    }
  }
  const text = response.response.candidates?.[0]?.content?.parts
    ?.filter((p: any) => p.text)
    ?.map((p: any) => p.text)
    ?.join('') || "Sorry, I couldn't process that.";

  return text;
}
