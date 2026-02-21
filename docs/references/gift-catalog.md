# Gift Catalog System

## Overview

Nell's curated gift database provides real product recommendations instead of AI-hallucinated suggestions. Products are sourced from trusted editorial and community sources, scored for giftability, and organized by interest category and price tier.

## How It Works

1. User adds a contact with interests (e.g., "bourbon", "hiking")
2. When a reminder fires or user asks for gift ideas, Nell calls `search_gifts`
3. Tool queries `gift_catalog` table by interest category, optional subcategory and price range
4. Results sorted by giftability score, limited to 5
5. Nell presents 2-3 picks with her personality layer

## Database Schema

```sql
gift_catalog (
  id              TEXT PRIMARY KEY,
  category        TEXT NOT NULL,       -- matches interest categories
  subcategory     TEXT,                -- e.g., bourbon, scotch, coffee
  name            TEXT NOT NULL,       -- product name
  description     TEXT NOT NULL,       -- Nell-voice description
  price_range     TEXT NOT NULL,       -- budget | mid | premium
  price_estimate  REAL,               -- dollar amount
  affiliate_url   TEXT,               -- Amazon affiliate link (pending)
  purchase_url    TEXT,               -- direct product URL
  source          TEXT NOT NULL,       -- editorial source
  giftability     INTEGER,            -- 1-5 score
  tags            TEXT,               -- JSON array of tags
  image_url       TEXT,
  in_stock        INTEGER DEFAULT 1,
  last_verified   TIMESTAMP,
  created_at      TIMESTAMP,
  updated_at      TIMESTAMP
)
```

## Categories (as of 2026-02-21)

| Category | Count | Subcategories |
|----------|-------|---------------|
| spirits | 7 | bourbon, wine |
| cooking | 6 | general, grilling, coffee |
| outdoors | 5 | hiking |
| fitness | 5 | yoga, running |
| tech | 3 | general |
| gaming | 3 | board_games, video_games |
| reading | 3 | general |
| true_crime | 3 | general |
| art | 2 | general |
| gardening | 2 | general |
| music | 2 | general |
| pets | 2 | dogs |

## Sources

| Source | Type | Used For |
|--------|------|----------|
| Wirecutter | Editorial (NYT) | Best-tested picks across categories |
| Strategist (NY Mag) | Editorial | Taste-forward, unique gifts |
| Reddit (r/GiftIdeas, r/BuyItForLife) | Community | Real recommendations, upvote-validated |
| Amazon Best Sellers / Most Wished For | Purchase data | Popular items with real demand signal |
| Uncommon Goods | Marketplace | Unique/artisan items |
| Bon Appétit / Serious Eats | Editorial (food) | Kitchen & food gifts |
| WIRED | Editorial (tech) | Tech & gadget gifts |
| REI | Retail (outdoor) | Outdoor & fitness gear |
| Product Hunt | Community (tech) | Tech-forward crowd |
| GQ / Esquire | Editorial | Men's gifting, premium tier |

## Price Tiers

| Tier | Range | Use Case |
|------|-------|----------|
| budget | ~$10-30 | Stocking stuffers, casual gifts, "thought of you" |
| mid | ~$40-75 | Birthdays, holidays, solid gifts |
| premium | ~$90-300 | Milestone birthdays, close relationships, "wow" gifts |

## Nightly Refresh (Planned)

Cron job to run nightly:
1. **Gap check** — compare user interest categories vs catalog coverage
2. **Freshness check** — flag products not verified in 90+ days
3. **Research** — web search for new products in gap/stale categories
4. **Verify** — check prices, availability on existing products
5. **Update** — add new, retire dead, update prices
6. **Log** — post summary to Slack #nell

## Adding Products

```typescript
import { addGiftCatalogItem } from './db';

await addGiftCatalogItem({
  category: 'spirits',
  subcategory: 'bourbon',
  name: 'Product Name',
  description: 'Nell-voice description',
  priceRange: 'mid',
  priceEstimate: 55,
  purchaseUrl: 'https://...',
  source: 'wirecutter',
  giftability: 5,
  tags: ['crowd-pleaser', 'impressive'],
});
```

## Affiliate Monetization (Pending)

- Need Amazon Associates tag from Paul
- All Amazon URLs will get `?tag=YOURTAG-20` appended
- Short link system planned: `nell.to/g/<id>` → tracks clicks → redirects with affiliate tag
- Commission: ~4% on most categories, 24-hour cookie
