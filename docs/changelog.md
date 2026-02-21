# Nell Changelog

## 2026-02-21

### Gift Catalog System
- Added `gift_catalog` table to database schema
- Created `search_gifts` tool — Nell queries real curated products instead of hallucinating
- Seeded 43 products across 12 categories: spirits, cooking, outdoors, fitness, tech, gaming, reading, true crime, art, gardening, music, pets
- Sources: Wirecutter, NY Mag Strategist, Reddit, Amazon Best Sellers, Uncommon Goods, Bon Appétit, WIRED, REI
- Products organized by price tier: budget (~$25), mid (~$50), premium (~$100+)
- Each product scored for giftability (1-5) and tagged (crowd-pleaser, unique, impressive, etc.)
- DB functions for nightly cron: gap detection, stale product checks, category analysis
- Updated Nell's system prompt to always use `search_gifts` tool for gift recommendations

### Documentation
- Added `/update-docs` Claude Code command
- Created docs/ structure: architecture.md, project-status.md, changelog.md, references/

## 2026-02-21 (earlier)

### Model Switch
- Switched from Claude Sonnet to Gemini 2.0 Flash
- ~10x cost reduction ($0.02/mo vs $0.15/mo per user)
- Personality preservation confirmed via A/B testing
- Tool reliability slightly lower — monitoring

### Monorepo
- Consolidated into monorepo at github.com/paullaw110/textnell
- `apps/web/` — Next.js marketing site (Vercel)
- `apps/server/` — Hono SMS bot + AI

## 2026-02-18

### 10DLC Submission
- Brand approved (TCR ID: BV4Q0I5)
- Campaign submitted, pending review (3-7 business days)

## 2026-02-17

### Marketing Site Redesign
- Warm, playful theme replacing dark "AI slop" template
- Design reference: callbaba.com
- Deployed to textnell.com via Vercel

## Pre-2026-02-17

### MVP
- Full conversation AI with Claude Sonnet (later Gemini Flash)
- 11 tools: contact CRUD, interests, occasions, reminders, gifts
- Twilio SMS integration
- Web chat fallback
- Reminder scheduler (daily cron)
- Cloudflare Tunnel for local hosting
