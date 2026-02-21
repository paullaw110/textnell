/**
 * Seed script for Nell's curated gift database.
 * Run: npx tsx src/seed-gifts.ts
 * 
 * Sources: Wirecutter, Strategist, Reddit r/GiftIdeas, Amazon Best Sellers,
 * Uncommon Goods, Bon Appétit, WIRED, REI
 */
import { addGiftCatalogItem, getGiftCatalogStats } from './db';

interface GiftSeed {
  category: string;
  subcategory?: string;
  name: string;
  description: string;
  priceRange: 'budget' | 'mid' | 'premium';
  priceEstimate: number;
  purchaseUrl?: string;
  source: string;
  giftability: number;
  tags: string[];
}

const gifts: GiftSeed[] = [
  // ========== SPIRITS ==========
  {
    category: 'spirits', subcategory: 'bourbon',
    name: 'Woodford Reserve Double Oaked',
    description: 'The one that makes bourbon guys nod approvingly. Extra matured, butterscotch finish.',
    priceRange: 'mid', priceEstimate: 55,
    purchaseUrl: 'https://www.amazon.com/dp/B008BFKM1I',
    source: 'wirecutter', giftability: 5,
    tags: ['crowd-pleaser', 'impressive'],
  },
  {
    category: 'spirits', subcategory: 'bourbon',
    name: 'Whiskey Stones Gift Set',
    description: 'Soapstone cubes that chill without diluting. Comes in a nice wooden box.',
    priceRange: 'budget', priceEstimate: 20,
    purchaseUrl: 'https://www.amazon.com/dp/B07QC89XPN',
    source: 'amazon_bestseller', giftability: 4,
    tags: ['crowd-pleaser', 'safe-bet'],
  },
  {
    category: 'spirits', subcategory: 'bourbon',
    name: 'Norlan Whisky Glass (Set of 2)',
    description: 'Double-walled, designed to concentrate aroma. Looks like you know what you\'re doing.',
    priceRange: 'mid', priceEstimate: 48,
    purchaseUrl: 'https://www.amazon.com/dp/B01BGIEMJ4',
    source: 'strategist', giftability: 5,
    tags: ['unique', 'impressive'],
  },
  {
    category: 'spirits', subcategory: 'bourbon',
    name: 'Angel\'s Envy Bourbon',
    description: 'Port barrel finished. Smooth enough to convert non-bourbon people.',
    priceRange: 'mid', priceEstimate: 50,
    purchaseUrl: 'https://www.amazon.com/dp/B009LRX32C',
    source: 'reddit', giftability: 5,
    tags: ['crowd-pleaser', 'impressive'],
  },
  {
    category: 'spirits', subcategory: 'bourbon',
    name: 'Aged & Ore Duo Glass',
    description: 'Travel whiskey glass with built-in measuring. For the serious drinker who travels.',
    priceRange: 'premium', priceEstimate: 75,
    purchaseUrl: 'https://www.uncommongoods.com/product/travel-whiskey-glass',
    source: 'uncommon_goods', giftability: 5,
    tags: ['unique', 'impressive', 'personalized'],
  },
  {
    category: 'spirits', subcategory: 'wine',
    name: 'Coravin Pivot Wine Preservation System',
    description: 'Pour wine without pulling the cork. Keeps it fresh for weeks.',
    priceRange: 'premium', priceEstimate: 100,
    purchaseUrl: 'https://www.amazon.com/dp/B09VQ3VZ2K',
    source: 'wirecutter', giftability: 5,
    tags: ['impressive', 'unique'],
  },
  {
    category: 'spirits', subcategory: 'wine',
    name: 'Wine Folly Magnum Edition Book',
    description: 'The visual guide to wine. Beautiful enough to display, actually useful to read.',
    priceRange: 'budget', priceEstimate: 28,
    purchaseUrl: 'https://www.amazon.com/dp/1592408990',
    source: 'amazon_bestseller', giftability: 4,
    tags: ['crowd-pleaser', 'safe-bet'],
  },

  // ========== HIKING / OUTDOORS ==========
  {
    category: 'outdoors', subcategory: 'hiking',
    name: 'Darn Tough Hiker Micro Crew Socks',
    description: 'Lifetime guarantee. Merino wool. The gift that says "I actually thought about this."',
    priceRange: 'budget', priceEstimate: 25,
    purchaseUrl: 'https://www.amazon.com/dp/B074BHWL98',
    source: 'wirecutter', giftability: 3,
    tags: ['safe-bet', 'practical'],
  },
  {
    category: 'outdoors', subcategory: 'hiking',
    name: 'Stanley Classic Flask',
    description: 'Stainless steel, leakproof, wide mouth. Classic for a reason.',
    priceRange: 'budget', priceEstimate: 25,
    purchaseUrl: 'https://www.amazon.com/dp/B000FZX93K',
    source: 'reddit', giftability: 4,
    tags: ['crowd-pleaser', 'practical'],
  },
  {
    category: 'outdoors', subcategory: 'hiking',
    name: 'Hydro Flask 32oz Wide Mouth',
    description: 'Keeps cold for 24 hours. The trail water bottle everyone wants but won\'t buy themselves.',
    priceRange: 'mid', priceEstimate: 45,
    purchaseUrl: 'https://www.amazon.com/dp/B09GFJ6TL5',
    source: 'rei', giftability: 4,
    tags: ['crowd-pleaser', 'practical'],
  },
  {
    category: 'outdoors', subcategory: 'hiking',
    name: 'Garmin inReach Mini 2 Satellite Communicator',
    description: 'Emergency SOS from anywhere on earth. The premium "I care about your safety" gift.',
    priceRange: 'premium', priceEstimate: 300,
    purchaseUrl: 'https://www.amazon.com/dp/B09ZLGY3P1',
    source: 'wirecutter', giftability: 5,
    tags: ['impressive', 'unique', 'practical'],
  },
  {
    category: 'outdoors', subcategory: 'hiking',
    name: 'National Parks Scratch-Off Map',
    description: 'Poster-sized map, scratch off parks you\'ve visited. Decorative and motivating.',
    priceRange: 'budget', priceEstimate: 30,
    purchaseUrl: 'https://www.uncommongoods.com/product/national-parks-scratch-off-map',
    source: 'uncommon_goods', giftability: 5,
    tags: ['unique', 'crowd-pleaser'],
  },

  // ========== COOKING / FOOD ==========
  {
    category: 'cooking', subcategory: 'general',
    name: 'Salt Fat Acid Heat by Samin Nosrat',
    description: 'The cookbook that teaches you to cook, not just follow recipes. Beautiful illustrations.',
    priceRange: 'budget', priceEstimate: 22,
    purchaseUrl: 'https://www.amazon.com/dp/1476753830',
    source: 'bon_appetit', giftability: 5,
    tags: ['crowd-pleaser', 'impressive'],
  },
  {
    category: 'cooking', subcategory: 'general',
    name: 'Thermapen One Instant-Read Thermometer',
    description: 'Reads in 1 second. The one every serious cook wants. No more guessing.',
    priceRange: 'premium', priceEstimate: 105,
    purchaseUrl: 'https://www.thermoworks.com/thermapen-one/',
    source: 'wirecutter', giftability: 4,
    tags: ['impressive', 'practical'],
  },
  {
    category: 'cooking', subcategory: 'general',
    name: 'Maldon Sea Salt Flakes',
    description: 'The finishing salt. Pyramid crystals, satisfying crunch. Fancy but affordable.',
    priceRange: 'budget', priceEstimate: 10,
    purchaseUrl: 'https://www.amazon.com/dp/B00017028M',
    source: 'bon_appetit', giftability: 3,
    tags: ['safe-bet', 'stocking-stuffer'],
  },
  {
    category: 'cooking', subcategory: 'grilling',
    name: 'Meater Plus Wireless Thermometer',
    description: 'Bluetooth meat thermometer. Monitors cook from your phone. Grill nerds lose their minds.',
    priceRange: 'premium', priceEstimate: 100,
    purchaseUrl: 'https://www.amazon.com/dp/B07H8WTFHW',
    source: 'wirecutter', giftability: 5,
    tags: ['impressive', 'unique'],
  },
  {
    category: 'cooking', subcategory: 'coffee',
    name: 'AeroPress Clear Coffee Maker',
    description: 'The cult-favorite brewer. Makes better coffee than machines 5x the price.',
    priceRange: 'budget', priceEstimate: 40,
    purchaseUrl: 'https://www.amazon.com/dp/B0CYDGFH3Z',
    source: 'wirecutter', giftability: 4,
    tags: ['crowd-pleaser', 'practical'],
  },
  {
    category: 'cooking', subcategory: 'coffee',
    name: 'Fellow Stagg EKG Electric Kettle',
    description: 'Pour-over precision, gorgeous design. The kettle that makes people ask "where did you get that?"',
    priceRange: 'premium', priceEstimate: 165,
    purchaseUrl: 'https://www.amazon.com/dp/B077JBQZPX',
    source: 'strategist', giftability: 5,
    tags: ['impressive', 'unique'],
  },

  // ========== FITNESS / YOGA ==========
  {
    category: 'fitness', subcategory: 'yoga',
    name: 'Manduka PRO Yoga Mat',
    description: 'Dense, grippy, lasts forever. The mat yoga people actually want.',
    priceRange: 'premium', priceEstimate: 120,
    purchaseUrl: 'https://www.amazon.com/dp/B0028MBQJ0',
    source: 'wirecutter', giftability: 4,
    tags: ['impressive', 'practical'],
  },
  {
    category: 'fitness', subcategory: 'yoga',
    name: 'Yoga Anatomy Book by Leslie Kaminoff',
    description: 'Illustrated guide showing what\'s actually happening in each pose. Nerdy and useful.',
    priceRange: 'budget', priceEstimate: 18,
    purchaseUrl: 'https://www.amazon.com/dp/1450400248',
    source: 'reddit', giftability: 3,
    tags: ['safe-bet', 'practical'],
  },
  {
    category: 'fitness', subcategory: 'yoga',
    name: 'Lululemon Reversible Mat 5mm',
    description: 'Antimicrobial, reversible, beautiful colors. Premium without being obnoxious.',
    priceRange: 'mid', priceEstimate: 88,
    purchaseUrl: 'https://shop.lululemon.com/p/yoga-mats/Reversible-Mat-5/',
    source: 'strategist', giftability: 4,
    tags: ['crowd-pleaser', 'impressive'],
  },
  {
    category: 'fitness', subcategory: 'running',
    name: 'Goodr OG Sunglasses',
    description: 'No-slip, no-bounce running sunglasses. Fun colors. Absurdly cheap for how good they are.',
    priceRange: 'budget', priceEstimate: 25,
    purchaseUrl: 'https://www.amazon.com/dp/B07D6NBDMF',
    source: 'reddit', giftability: 4,
    tags: ['crowd-pleaser', 'safe-bet'],
  },
  {
    category: 'fitness', subcategory: 'running',
    name: 'Shokz OpenRun Pro Bone Conduction Headphones',
    description: 'Open-ear so you hear traffic. Every runner wants these. Every runner.',
    priceRange: 'premium', priceEstimate: 130,
    purchaseUrl: 'https://www.amazon.com/dp/B09BVXZG3P',
    source: 'wirecutter', giftability: 5,
    tags: ['impressive', 'practical'],
  },

  // ========== GAMING ==========
  {
    category: 'gaming', subcategory: 'board_games',
    name: 'Wingspan Board Game',
    description: 'Beautiful bird-themed strategy game. Wins awards. Even non-gamers get hooked.',
    priceRange: 'mid', priceEstimate: 45,
    purchaseUrl: 'https://www.amazon.com/dp/B07YQ641NQ',
    source: 'reddit', giftability: 5,
    tags: ['crowd-pleaser', 'impressive'],
  },
  {
    category: 'gaming', subcategory: 'video_games',
    name: 'PlayStation Store Gift Card ($50)',
    description: 'Let them pick. Sometimes the best gift is not pretending you know their taste.',
    priceRange: 'mid', priceEstimate: 50,
    purchaseUrl: 'https://www.amazon.com/dp/B00GAC1D2G',
    source: 'manual', giftability: 3,
    tags: ['safe-bet'],
  },
  {
    category: 'gaming', subcategory: 'video_games',
    name: 'SteelSeries Arctis Nova 7 Headset',
    description: 'Wireless, great mic, comfortable for marathon sessions. The headset upgrade they won\'t buy themselves.',
    priceRange: 'premium', priceEstimate: 130,
    purchaseUrl: 'https://www.amazon.com/dp/B0BX3LXYWK',
    source: 'wired', giftability: 4,
    tags: ['impressive', 'practical'],
  },

  // ========== READING / BOOKS ==========
  {
    category: 'reading', subcategory: 'general',
    name: 'Kindle Paperwhite (Latest)',
    description: 'Waterproof, warm light, weeks of battery. The upgrade readers don\'t realize they need.',
    priceRange: 'premium', priceEstimate: 150,
    purchaseUrl: 'https://www.amazon.com/dp/B09TMN58KL',
    source: 'wirecutter', giftability: 5,
    tags: ['impressive', 'practical'],
  },
  {
    category: 'reading', subcategory: 'general',
    name: 'Book of the Month Subscription (3 months)',
    description: 'Curated picks, they choose one per month. Fresh reads without decision fatigue.',
    priceRange: 'mid', priceEstimate: 50,
    purchaseUrl: 'https://www.bookofthemonth.com/gift',
    source: 'strategist', giftability: 5,
    tags: ['unique', 'crowd-pleaser'],
  },
  {
    category: 'reading', subcategory: 'general',
    name: 'Leuchtturm1917 Notebook',
    description: 'The journal that bullet journalers swear by. Numbered pages, table of contents.',
    priceRange: 'budget', priceEstimate: 20,
    purchaseUrl: 'https://www.amazon.com/dp/B002TSIMW4',
    source: 'reddit', giftability: 4,
    tags: ['safe-bet', 'practical'],
  },

  // ========== TRUE CRIME ==========
  {
    category: 'true_crime', subcategory: 'general',
    name: 'I\'ll Be Gone in the Dark by Michelle McNamara',
    description: 'The gold standard. If they haven\'t read it, this is the move.',
    priceRange: 'budget', priceEstimate: 14,
    purchaseUrl: 'https://www.amazon.com/dp/0062319795',
    source: 'reddit', giftability: 4,
    tags: ['crowd-pleaser', 'safe-bet'],
  },
  {
    category: 'true_crime', subcategory: 'general',
    name: 'Hunt A Killer Mystery Box',
    description: 'Solve-at-home murder mystery. Multiple episodes, feels like a show you participate in.',
    priceRange: 'mid', priceEstimate: 45,
    purchaseUrl: 'https://www.amazon.com/dp/B08FWPDHZ2',
    source: 'uncommon_goods', giftability: 5,
    tags: ['unique', 'impressive'],
  },
  {
    category: 'true_crime', subcategory: 'general',
    name: 'MasterClass Annual Subscription',
    description: 'Includes forensic science with actual experts. Plus every other class. Premium gift.',
    priceRange: 'premium', priceEstimate: 120,
    purchaseUrl: 'https://www.masterclass.com/gift',
    source: 'strategist', giftability: 5,
    tags: ['impressive', 'unique'],
  },

  // ========== TECH ==========
  {
    category: 'tech', subcategory: 'general',
    name: 'Anker 737 Power Bank (24,000mAh)',
    description: 'Charges a laptop. Yes, a laptop. The power bank to end all power banks.',
    priceRange: 'premium', priceEstimate: 110,
    purchaseUrl: 'https://www.amazon.com/dp/B09VPHVT2Z',
    source: 'wirecutter', giftability: 4,
    tags: ['practical', 'impressive'],
  },
  {
    category: 'tech', subcategory: 'general',
    name: 'Apple AirTag (4-pack)',
    description: 'For keys, bags, pets, sanity. Useful enough that they\'ll actually use it.',
    priceRange: 'mid', priceEstimate: 80,
    purchaseUrl: 'https://www.amazon.com/dp/B0D54JZTHY',
    source: 'amazon_bestseller', giftability: 4,
    tags: ['practical', 'crowd-pleaser'],
  },
  {
    category: 'tech', subcategory: 'general',
    name: 'Keychron K2 Mechanical Keyboard',
    description: 'Wireless mechanical keyboard that works with everything. The upgrade they didn\'t know they needed.',
    priceRange: 'premium', priceEstimate: 90,
    purchaseUrl: 'https://www.amazon.com/dp/B07Z45X2PP',
    source: 'wired', giftability: 4,
    tags: ['impressive', 'practical'],
  },

  // ========== MUSIC ==========
  {
    category: 'music', subcategory: 'general',
    name: 'Crosley Cruiser Plus Turntable',
    description: 'Bluetooth, built-in speakers, portable. Entry-level vinyl for the curious.',
    priceRange: 'mid', priceEstimate: 70,
    purchaseUrl: 'https://www.amazon.com/dp/B07BKC8GCL',
    source: 'amazon_bestseller', giftability: 5,
    tags: ['crowd-pleaser', 'impressive'],
  },
  {
    category: 'music', subcategory: 'general',
    name: 'Fender Play Gift Card (1 Year)',
    description: 'Online guitar/bass/ukulele lessons. For the person who keeps saying they\'ll learn.',
    priceRange: 'premium', priceEstimate: 100,
    purchaseUrl: 'https://www.fender.com/play/gift-cards',
    source: 'manual', giftability: 4,
    tags: ['unique', 'impressive'],
  },

  // ========== GARDENING ==========
  {
    category: 'gardening', subcategory: 'general',
    name: 'Click & Grow Smart Garden 3',
    description: 'Indoor herb garden, no soil, no effort. Fresh basil year-round.',
    priceRange: 'mid', priceEstimate: 60,
    purchaseUrl: 'https://www.amazon.com/dp/B01MRVMKXQ',
    source: 'wirecutter', giftability: 5,
    tags: ['unique', 'crowd-pleaser'],
  },
  {
    category: 'gardening', subcategory: 'general',
    name: 'Felco F-2 Pruning Shears',
    description: 'The gold standard. Swiss-made, lifetime use, every gardener knows these.',
    priceRange: 'mid', priceEstimate: 55,
    purchaseUrl: 'https://www.amazon.com/dp/B00004R9GJ',
    source: 'reddit', giftability: 3,
    tags: ['practical', 'impressive'],
  },

  // ========== ART / CREATIVE ==========
  {
    category: 'art', subcategory: 'general',
    name: 'Prismacolor Premier Colored Pencils (72)',
    description: 'Professional-grade colored pencils. Buttery smooth. The set artists actually want.',
    priceRange: 'mid', priceEstimate: 45,
    purchaseUrl: 'https://www.amazon.com/dp/B000E23RSQ',
    source: 'amazon_bestseller', giftability: 4,
    tags: ['crowd-pleaser', 'practical'],
  },
  {
    category: 'art', subcategory: 'general',
    name: 'Moleskine Art Sketchbook (Large)',
    description: 'Thick paper, lays flat, hardcover. The sketchbook that makes you want to draw.',
    priceRange: 'budget', priceEstimate: 20,
    purchaseUrl: 'https://www.amazon.com/dp/B015NG45GW',
    source: 'reddit', giftability: 4,
    tags: ['safe-bet', 'practical'],
  },

  // ========== PETS ==========
  {
    category: 'pets', subcategory: 'dogs',
    name: 'BarkBox Subscription (3 months)',
    description: 'Monthly themed box of treats and toys. The dog will love it. The human will love the dog loving it.',
    priceRange: 'mid', priceEstimate: 75,
    purchaseUrl: 'https://www.barkbox.com/gift',
    source: 'reddit', giftability: 5,
    tags: ['crowd-pleaser', 'unique'],
  },
  {
    category: 'pets', subcategory: 'dogs',
    name: 'Furbo Dog Camera',
    description: 'Watch and toss treats to your dog from your phone. Peak 2020s pet parenting.',
    priceRange: 'premium', priceEstimate: 150,
    purchaseUrl: 'https://www.amazon.com/dp/B0C7CK4RZ6',
    source: 'wirecutter', giftability: 5,
    tags: ['impressive', 'unique'],
  },
];

async function seed() {
  console.log(`Seeding ${gifts.length} gifts into catalog...`);
  
  let added = 0;
  for (const gift of gifts) {
    try {
      await addGiftCatalogItem(gift);
      added++;
      process.stdout.write('.');
    } catch (e: any) {
      console.error(`\nFailed: ${gift.name} — ${e.message}`);
    }
  }
  
  console.log(`\n\nSeeded ${added}/${gifts.length} gifts.`);
  
  const stats = await getGiftCatalogStats();
  console.log('\nCatalog by category:');
  for (const s of stats) {
    console.log(`  ${s.category}: ${s.count} products`);
  }
}

seed().catch(console.error);
