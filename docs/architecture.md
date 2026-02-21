# Nell Architecture

## Overview

Nell is a personal relationship CRM delivered via SMS (and web chat). Users text naturally, Nell extracts structured data about contacts, interests, occasions, and gift preferences.

## Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js + TypeScript |
| Server | Hono (lightweight HTTP) |
| AI | Google Gemini 2.0 Flash (tool-calling) |
| Database | SQLite via libsql + Drizzle ORM |
| SMS | Twilio (pending 10DLC approval) |
| Hosting | Cloudflare Tunnel → localhost:3001 |
| Marketing | Next.js on Vercel (textnell.com) |

## Directory Structure

```
nell/
├── src/
│   ├── index.ts                 # Hono server, routes, webhook
│   ├── conversation-gemini.ts   # Gemini AI conversation handler + tool definitions
│   ├── conversation.ts          # Sonnet conversation handler (backup)
│   ├── db.ts                    # All database operations
│   ├── reminders.ts             # Cron-based reminder scheduler
│   ├── twilio-client.ts         # Twilio SMS client
│   ├── seed-gifts.ts            # Gift catalog seeding script
│   └── lib/
│       └── db/
│           ├── index.ts         # Drizzle client setup
│           └── schema.ts        # All table schemas
├── docs/                        # Project documentation
│   ├── architecture.md          # This file
│   ├── changelog.md             # Version history
│   ├── project-status.md        # Current state + where we left off
│   └── references/              # Feature-specific docs
├── drizzle.config.ts            # Drizzle Kit config
├── package.json
└── tsconfig.json
```

## Database Schema

### Core Tables
- **users** — Phone-based user accounts
- **contacts** — People the user wants to remember
- **interests** — Structured interests per contact (category + specifics)
- **occasions** — Birthdays, anniversaries, custom dates
- **reminders** — Scheduled reminder delivery
- **messages** — Conversation history per user
- **gift_history** — Logged gifts given to contacts

### Gift Engine Tables
- **gift_catalog** — Curated product database (43+ products, 12 categories)
  - Sourced from: Wirecutter, Strategist, Reddit, Amazon, Uncommon Goods, Bon Appétit, WIRED, REI
  - Fields: category, subcategory, name, description, price_range, price_estimate, affiliate_url, purchase_url, source, giftability score, tags, stock status, last_verified

## AI Architecture

Nell uses Gemini 2.0 Flash with function calling. The model has access to 12 tools:

| Tool | Purpose |
|------|---------|
| add_contact | Create new contact with birthday |
| get_contact | Look up contact by name |
| update_contact | Update contact info |
| list_all_contacts | List all saved contacts |
| list_upcoming | Upcoming birthdays/occasions |
| add_interest | Add structured interest to contact |
| add_occasion | Add anniversary or custom date |
| log_gift | Record a gift given |
| relationship_summary | Full contact summary |
| set_reminder_days | Configure reminder timing |
| delete_contact | Remove a contact |
| search_gifts | Query curated gift database by interest |

## Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/sms` | POST | Twilio SMS webhook |
| `/chat` | GET | Web chat UI |
| `/api/chat` | POST | Web chat API |
| `/health` | GET | Health check |

## Reminder System

- `node-cron` runs daily at 8:00 AM PT
- Checks `reminders` table for today's date
- Sends SMS via Twilio with contact context + gift suggestions
- Marks reminder as sent after delivery
