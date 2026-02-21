import Anthropic from '@anthropic-ai/sdk';
import {
  getContacts, getContact, createContact, updateContact, deleteContact,
  addInterest, getInterests, addOccasion, getUpcomingOccasions,
  addMessage, getRecentMessages, addGiftRecord, getGiftHistory,
  updateUserPreferences, getAllContacts, getOrCreateUser,
} from './db';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
Reminders: "Jake's birthday is Saturday. He's into bourbon — want gift ideas or are you handling it?"
Gift ideas: 2-3 specific products with prices. Add opinion: "The hiking socks are the safe bet. The whiskey stones are if you want to look like you tried harder than you did."
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

## Tools
You have tools to manage contacts, birthdays, interests, occasions, and gifts. Use them when appropriate — add/update/delete contacts, track interests, add occasions, log gifts, get summaries, change preferences, list upcoming occasions.

## Date parsing
Flexible: "the 29th" = current or next month. "Feb 6" = 02-06. "July 12th" = 07-12.
Names: capitalize properly. "charlie" → "Charlie"
Context: "update it" or "yes" — use conversation history.
Birthday format: MM-DD.
- For interests, categorize them into: spirits, outdoors, music, tech, food, sports, books, fashion, gaming, art, travel, etc.`;

const tools: Anthropic.Messages.Tool[] = [
  {
    name: 'add_contact',
    description: 'Add a new person with their birthday to the user\'s contacts',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Person\'s name (properly capitalized)' },
        birthday: { type: 'string', description: 'Birthday in MM-DD format (e.g., 07-12 for July 12)' },
        relationship: { type: 'string', description: 'Relationship like friend, mom, coworker (optional)' },
        phone: { type: 'string', description: 'Contact phone number (optional)' },
        email: { type: 'string', description: 'Contact email (optional)' },
      },
      required: ['name']
    }
  },
  {
    name: 'get_contact',
    description: 'Look up a contact by name to see their birthday, interests, and info',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Person\'s name to look up' }
      },
      required: ['name']
    }
  },
  {
    name: 'update_contact',
    description: 'Update an existing contact\'s info (birthday, relationship, etc.)',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Person\'s name to update' },
        birthday: { type: 'string', description: 'New birthday in MM-DD format (optional)' },
        relationship: { type: 'string', description: 'Relationship (optional)' },
        phone: { type: 'string', description: 'Phone number (optional)' },
        email: { type: 'string', description: 'Email (optional)' },
      },
      required: ['name']
    }
  },
  {
    name: 'list_upcoming',
    description: 'List upcoming birthdays and occasions for the user',
    input_schema: {
      type: 'object' as const,
      properties: {
        days_ahead: { type: 'number', description: 'Number of days to look ahead (default 30)' }
      },
      required: []
    }
  },
  {
    name: 'list_all_contacts',
    description: 'List all contacts the user has saved',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: []
    }
  },
  {
    name: 'set_reminder_days',
    description: 'Set how many days before a birthday the user wants to be reminded',
    input_schema: {
      type: 'object' as const,
      properties: {
        days: { type: 'number', description: 'Number of days before birthday to send reminder (1-30)' }
      },
      required: ['days']
    }
  },
  {
    name: 'delete_contact',
    description: 'Remove a contact from the user\'s list',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Person\'s name to remove' }
      },
      required: ['name']
    }
  },
  {
    name: 'add_occasion',
    description: 'Add a special date for a contact (anniversary, custom event)',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Contact name' },
        type: { type: 'string', description: 'Type: birthday, anniversary, or custom' },
        date: { type: 'string', description: 'Date in MM-DD format' },
        label: { type: 'string', description: 'Label like "Wedding Anniversary" (optional)' },
        reminder_days: { type: 'number', description: 'Days before to remind (optional, uses user default)' },
      },
      required: ['name', 'type', 'date']
    }
  },
  {
    name: 'add_interest',
    description: 'Tag a contact with an interest or preference',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Contact name' },
        category: { type: 'string', description: 'Category: spirits, outdoors, music, tech, food, sports, books, fashion, gaming, art, travel, etc.' },
        specifics: { type: 'string', description: 'Specific interest like bourbon, hiking, jazz, etc.' },
      },
      required: ['name', 'category', 'specifics']
    }
  },
  {
    name: 'log_gift',
    description: 'Record a gift given to a contact',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Contact name' },
        description: { type: 'string', description: 'What was given' },
        amount: { type: 'number', description: 'Cost/value (optional)' },
        date_given: { type: 'string', description: 'Date given in YYYY-MM-DD format' },
        notes: { type: 'string', description: 'Any notes (optional)' },
      },
      required: ['name', 'description', 'date_given']
    }
  },
  {
    name: 'relationship_summary',
    description: 'Get a full briefing on a contact: birthday, interests, gift history, occasions',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Contact name' }
      },
      required: ['name']
    }
  },
];

async function executeTool(toolName: string, input: any, userId: string): Promise<string> {
  try {
    switch (toolName) {
      case 'add_contact': {
        const { name, birthday, relationship, phone, email } = input;
        const existing = await getContact(userId, name);
        if (existing) {
          return JSON.stringify({ status: 'exists', contact: { name: existing.name, birthday: existing.birthday } });
        }
        const contact = await createContact(userId, { name, birthday, relationship, phone, email });
        return JSON.stringify({ status: 'created', contact: { name, birthday, relationship } });
      }

      case 'get_contact': {
        const contact = await getContact(userId, input.name);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.name });
        return JSON.stringify({ status: 'found', contact: { name: contact.name, birthday: contact.birthday, relationship: contact.relationship, interests: contact.interests } });
      }

      case 'update_contact': {
        const contact = await getContact(userId, input.name);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.name });
        
        const updateData: any = {};
        if (input.birthday) updateData.birthday = input.birthday;
        if (input.relationship) updateData.relationship = input.relationship;
        if (input.phone) updateData.phone = input.phone;
        if (input.email) updateData.email = input.email;
        
        const updated = await updateContact(contact.id, updateData);
        return JSON.stringify({ status: 'updated', contact: { name: contact.name, ...updateData } });
      }

      case 'list_upcoming': {
        const daysAhead = input.days_ahead || 30;
        const upcoming = await getUpcomingOccasions(userId, daysAhead);
        return JSON.stringify({ status: 'ok', occasions: upcoming.map(o => ({ name: o.contactName, type: o.type, date: o.date, label: o.label })) });
      }

      case 'list_all_contacts': {
        const allContacts = await getAllContacts(userId);
        return JSON.stringify({ status: 'ok', contacts: allContacts.map(c => ({ name: c.name, birthday: c.birthday, relationship: c.relationship, interests: c.interests.map(i => `${i.category}: ${i.specifics}`) })) });
      }

      case 'set_reminder_days': {
        const { days } = input;
        if (days < 1 || days > 30) return JSON.stringify({ status: 'error', message: 'Days must be between 1-30' });
        await updateUserPreferences(userId, { reminderDaysDefault: days });
        return JSON.stringify({ status: 'updated', days });
      }

      case 'delete_contact': {
        const contact = await getContact(userId, input.name);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.name });
        await deleteContact(contact.id, userId);
        return JSON.stringify({ status: 'deleted', name: contact.name });
      }

      case 'add_occasion': {
        const contact = await getContact(userId, input.name);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.name });
        const occasion = await addOccasion(contact.id, userId, input.type, input.date, input.label, input.reminder_days);
        return JSON.stringify({ status: 'created', occasion: { type: input.type, date: input.date, label: input.label } });
      }

      case 'add_interest': {
        const contact = await getContact(userId, input.name);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.name });
        const interest = await addInterest(contact.id, input.category, input.specifics);
        return JSON.stringify({ status: 'added', interest: { category: input.category, specifics: input.specifics } });
      }

      case 'log_gift': {
        const contact = await getContact(userId, input.name);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.name });
        await addGiftRecord(userId, contact.id, {
          description: input.description,
          amount: input.amount,
          dateGiven: input.date_given,
          notes: input.notes,
        });
        return JSON.stringify({ status: 'logged', gift: { description: input.description, date: input.date_given } });
      }

      case 'relationship_summary': {
        const contact = await getContact(userId, input.name);
        if (!contact) return JSON.stringify({ status: 'not_found', name: input.name });
        const ints = await getInterests(contact.id);
        const gifts = await getGiftHistory(contact.id);
        const occ = await getUpcomingOccasions(userId, 365);
        const contactOccasions = occ.filter(o => o.contactId === contact.id);
        return JSON.stringify({
          status: 'found',
          summary: {
            name: contact.name,
            birthday: contact.birthday,
            relationship: contact.relationship,
            interests: ints.map(i => ({ category: i.category, specifics: i.specifics })),
            gifts: gifts.map(g => ({ description: g.description, date: g.dateGiven, amount: g.amount })),
            occasions: contactOccasions.map(o => ({ type: o.type, date: o.date, label: o.label })),
          }
        });
      }

      default:
        return JSON.stringify({ status: 'error', message: 'Unknown tool' });
    }
  } catch (error: any) {
    console.error(`Tool ${toolName} error:`, error);
    return JSON.stringify({ status: 'error', message: error.message });
  }
}

export async function chat(userId: string, userMessage: string): Promise<string> {
  // Get conversation history
  const recentMessages = await getRecentMessages(userId, 20);
  const history: Anthropic.Messages.MessageParam[] = recentMessages.reverse().map((msg: any) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content
  }));

  // Add the new user message
  history.push({ role: 'user', content: userMessage });

  // Call Claude with tools
  let response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    tools,
    messages: history
  });

  // Handle tool use loop (max 3 iterations)
  let iterations = 0;
  while (response.stop_reason === 'tool_use' && iterations < 3) {
    iterations++;
    const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
    const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];
    
    for (const block of toolUseBlocks) {
      if (block.type !== 'tool_use') continue;
      console.log(`Tool call: ${block.name}(${JSON.stringify(block.input)})`);
      const result = await executeTool(block.name, block.input, userId);
      console.log(`Tool result: ${result}`);
      toolResults.push({ type: 'tool_result' as const, tool_use_id: block.id, content: result });
    }

    history.push({ role: 'assistant', content: response.content });
    history.push({ role: 'user', content: toolResults });

    response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      tools,
      messages: history
    });
  }

  // Extract text response
  const textBlock = response.content.find(b => b.type === 'text');
  return textBlock?.type === 'text' ? textBlock.text : "Sorry, I couldn't process that. Try again?";
}
