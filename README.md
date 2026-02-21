# Nell

SMS-first AI personal relationship manager. Never forget the people who matter.

## Structure

- `apps/web` — Marketing site (Next.js, deployed on Vercel at textnell.com)
- `apps/server` — SMS bot server (Hono + Claude + Turso, runs on Mac mini via Cloudflare Tunnel)

## Development

```bash
# Marketing site
cd apps/web && npm install && npm run dev

# Server
cd apps/server && npm install && npm run build && node dist/index.js
```

## Stack

| Layer | Technology |
|-------|-----------|
| Marketing | Next.js, Tailwind, Vercel |
| Server | Hono, Node.js |
| Database | Turso (libsql) + Drizzle ORM |
| AI | Claude Sonnet (tool-calling) |
| SMS | Twilio (A2P 10DLC) |
| Tunnel | Cloudflare (nell.superlandings.io) |
