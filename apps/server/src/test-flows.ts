/**
 * Nell End-to-End Test Suite
 * Run: npx tsx src/test-flows.ts
 * 
 * Tests the full conversation flow through the actual AI + DB stack.
 * Each test gets a fresh session (unique userId).
 */
import { chat } from './conversation';
import { getOrCreateUser, getContact, getInterests, getAllContacts, getPendingResearch, getGiftCatalogStats } from './db';
import { db, schema } from './lib/db';
import { eq } from 'drizzle-orm';

const PASS = '✅';
const FAIL = '❌';
const WARN = '⚠️';

let passed = 0;
let failed = 0;
let warnings = 0;

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  reply: string;
  details?: string;
}

const results: TestResult[] = [];

async function createTestUser(label: string): Promise<string> {
  const user = await getOrCreateUser(`test:${label}-${Date.now()}`);
  return user.id;
}

function check(name: string, reply: string, assertions: {
  shouldContain?: string[];
  shouldNotContain?: string[];
  maxLength?: number;
}): TestResult {
  const issues: string[] = [];

  if (assertions.shouldContain) {
    for (const term of assertions.shouldContain) {
      if (!reply.toLowerCase().includes(term.toLowerCase())) {
        issues.push(`missing "${term}"`);
      }
    }
  }
  if (assertions.shouldNotContain) {
    for (const term of assertions.shouldNotContain) {
      if (reply.toLowerCase().includes(term.toLowerCase())) {
        issues.push(`contains banned "${term}"`);
      }
    }
  }
  if (assertions.maxLength && reply.length > assertions.maxLength) {
    issues.push(`too long: ${reply.length} chars (max ${assertions.maxLength})`);
  }

  const status = issues.length === 0 ? 'pass' : 'fail';
  if (status === 'pass') passed++;
  else failed++;

  const result: TestResult = { name, status, reply, details: issues.join(', ') };
  results.push(result);
  console.log(`${status === 'pass' ? PASS : FAIL} ${name}${issues.length ? ' — ' + issues.join(', ') : ''}`);
  return result;
}

async function checkDB(name: string, fn: () => Promise<boolean>, details?: string): Promise<TestResult> {
  try {
    const ok = await fn();
    const status = ok ? 'pass' : 'fail';
    if (ok) passed++; else failed++;
    const result: TestResult = { name, status, reply: '', details: ok ? undefined : details };
    results.push(result);
    console.log(`${ok ? PASS : FAIL} ${name}${!ok && details ? ' — ' + details : ''}`);
    return result;
  } catch (e: any) {
    failed++;
    const result: TestResult = { name, status: 'fail', reply: '', details: e.message };
    results.push(result);
    console.log(`${FAIL} ${name} — ${e.message}`);
    return result;
  }
}

// ============================================
// Test Groups
// ============================================

async function testBasicContact() {
  console.log('\n--- Basic Contact Flow ---');
  const userId = await createTestUser('basic-contact');

  const r1 = await chat(userId, 'add my friend Jake, birthday july 12');
  check('Add contact with birthday', r1, {
    shouldNotContain: ['happy to help', 'let me know', 'else!'],
    maxLength: 300,
  });

  await checkDB('Jake saved in DB', async () => {
    const c = await getContact(userId, 'Jake');
    return c !== null && c.birthday === '07-12';
  }, 'Jake not found or wrong birthday');
}

async function testContactWithInterests() {
  console.log('\n--- Contact + Interests Flow ---');
  const userId = await createTestUser('contact-interests');

  const r1 = await chat(userId, 'my friend Dave birthday march 10, he loves bourbon and cooking');
  check('Add contact with interests', r1, {
    shouldNotContain: ['happy to help', 'let me know', 'else!'],
    maxLength: 300,
  });

  await checkDB('Dave saved in DB', async () => {
    const c = await getContact(userId, 'Dave');
    return c !== null;
  });

  await checkDB('Interests saved', async () => {
    const c = await getContact(userId, 'Dave');
    if (!c) return false;
    const ints = await getInterests(c.id);
    return ints.length >= 1; // at least bourbon or cooking
  }, 'No interests found for Dave');
}

async function testGiftRecsWithProducts() {
  console.log('\n--- Gift Recs (products in catalog) ---');
  const userId = await createTestUser('gift-recs');

  await chat(userId, 'add my friend Sarah, birthday march 15, she likes running');
  const r2 = await chat(userId, 'gift ideas for Sarah?');
  
  check('Gift recs include real products', r2, {
    shouldContain: ['shokz', 'goodr'],
    shouldNotContain: ['else!'],
  });

  check('Gift recs include links', r2, {
    shouldContain: ['amazon.com'],
  });

  check('Gift recs include prices', r2, {
    shouldContain: ['$'],
  });
}

async function testGiftRecsEmpty() {
  console.log('\n--- Gift Recs (no products in catalog) ---');
  const userId = await createTestUser('gift-empty');

  await chat(userId, 'add my friend Tom, birthday april 1, he likes golf');
  const r2 = await chat(userId, 'gift ideas for Tom?');

  check('Empty recs are honest', r2, {
    shouldNotContain: ['golf club', 'golf ball', 'headcover', 'towel', 'rangefinder', 'gift card'],
    maxLength: 500,
  });

  check('No hallucinated products', r2, {
    shouldNotContain: ['$20-$40', '$30-$50', '$15-$25', '$10-$20'],
  });
}

async function testPronounResolution() {
  console.log('\n--- Pronoun Resolution ---');
  const userId = await createTestUser('pronouns');

  await chat(userId, 'add my friend Hubert, birthday march 5');
  const r2 = await chat(userId, 'he likes the Lakers');

  check('Pronoun "he" resolves to Hubert', r2, {
    shouldNotContain: ['who', 'which contact', 'name', 'else!'],
  });

  await checkDB('Lakers interest saved to Hubert', async () => {
    const c = await getContact(userId, 'Hubert');
    if (!c) return false;
    const ints = await getInterests(c.id);
    return ints.some(i => i.specifics.toLowerCase().includes('laker'));
  }, 'Lakers not saved as interest');
}

async function testNameFollowUp() {
  console.log('\n--- Name Follow-Up (no re-search) ---');
  const userId = await createTestUser('name-followup');

  await chat(userId, 'my friend likes golf, gift ideas?');
  const r2 = await chat(userId, 'their name is Jeff');

  check('Name follow-up is concise', r2, {
    shouldNotContain: ['golf club', 'headcover', 'gift', 'recommendation'],
    maxLength: 200,
  });
}

async function testRelativeDates() {
  console.log('\n--- Relative Date Parsing ---');
  const userId = await createTestUser('dates');

  const r1 = await chat(userId, 'add my friend Mike, his birthday is tomorrow');

  await checkDB('Tomorrow resolves to actual date', async () => {
    const c = await getContact(userId, 'Mike');
    if (!c || !c.birthday) return false;
    // Birthday should be set to something (we can't predict exact MM-DD but it should exist)
    return c.birthday.match(/^\d{2}-\d{2}$/) !== null;
  }, 'Birthday not in MM-DD format');
}

async function testBirthdayPrompt() {
  console.log('\n--- Birthday Prompt ---');
  const userId = await createTestUser('bday-prompt');

  const r1 = await chat(userId, 'add my coworker Lisa, she likes photography');

  check('Asks for birthday when missing', r1, {
    shouldContain: ['birthday'],
    maxLength: 300,
  });
}

async function testGapDetection() {
  console.log('\n--- Gap Detection ---');
  const userId = await createTestUser('gap-detect');

  await chat(userId, 'add my friend Alex, birthday june 1, he likes pickleball');

  await checkDB('Pickleball gap queued', async () => {
    const pending = await getPendingResearch();
    return pending.some(p => p.category === 'pickleball');
  }, 'No pickleball gap in research queue');
}

async function testPersonality() {
  console.log('\n--- Personality Enforcement ---');
  const userId = await createTestUser('personality');

  const r1 = await chat(userId, 'hello');
  check('Greeting is not cheerful', r1, {
    shouldNotContain: ['happy to help', 'how can i assist', 'welcome', 'glad'],
    maxLength: 200,
  });

  const r2 = await chat(userId, 'thanks');
  check('Thanks response is chill', r2, {
    shouldNotContain: ['you\'re welcome', 'no problem', 'anytime', 'happy to'],
    maxLength: 200,
  });

  const r3 = await chat(userId, 'what\'s the weather like?');
  check('Off-topic handled correctly', r3, {
    shouldNotContain: ['sunny', 'rain', 'forecast', 'temperature', 'degrees'],
    maxLength: 200,
  });
}

async function testBrevity() {
  console.log('\n--- Brevity ---');
  const userId = await createTestUser('brevity');

  const r1 = await chat(userId, 'add my friend Sam, birthday dec 25, he likes bourbon and hiking and cooking and gaming');
  check('Multi-interest response is concise', r1, {
    shouldNotContain: ['else!'],
    maxLength: 400,
  });

  const r2 = await chat(userId, 'gift ideas for Sam?');
  check('Gift recs with links stay under limit', r2, {
    shouldNotContain: ['else!'],
    maxLength: 600, // higher because of URLs
  });
}

async function testMultiTurnContext() {
  console.log('\n--- Multi-Turn Context ---');
  const userId = await createTestUser('multi-turn');

  await chat(userId, 'add my friend Emma, birthday february 14');
  await chat(userId, 'she likes yoga');
  await chat(userId, 'she also likes true crime');
  const r4 = await chat(userId, 'what do you know about Emma?');

  check('Remembers multi-turn info', r4, {
    shouldContain: ['emma'],
    shouldNotContain: ['not found', 'don\'t have'],
  });
}

// ============================================
// Runner
// ============================================

async function cleanup(userId: string) {
  // Clean up test contacts
  const contacts = await getAllContacts(userId);
  for (const c of contacts) {
    await db.delete(schema.interests).where(eq(schema.interests.contactId, c.id));
    await db.delete(schema.occasions).where(eq(schema.occasions.contactId, c.id));
    await db.delete(schema.reminders).where(eq(schema.reminders.contactId, c.id));
    await db.delete(schema.giftHistory).where(eq(schema.giftHistory.contactId, c.id));
    await db.delete(schema.contacts).where(eq(schema.contacts.id, c.id));
  }
  await db.delete(schema.messages).where(eq(schema.messages.userId, userId));
  await db.delete(schema.users).where(eq(schema.users.id, userId));
}

async function run() {
  console.log('🧪 Nell Test Suite');
  console.log('==================\n');

  const startTime = Date.now();
  const testUserIds: string[] = [];

  try {
    await testBasicContact();
    await testContactWithInterests();
    await testGiftRecsWithProducts();
    await testGiftRecsEmpty();
    await testPronounResolution();
    await testNameFollowUp();
    await testRelativeDates();
    await testBirthdayPrompt();
    await testGapDetection();
    await testPersonality();
    await testBrevity();
    await testMultiTurnContext();
  } catch (e: any) {
    console.error(`\n💥 Test runner error: ${e.message}`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n==================');
  console.log(`Results: ${PASS} ${passed} passed | ${FAIL} ${failed} failed | ${WARN} ${warnings} warnings`);
  console.log(`Time: ${elapsed}s`);

  if (failed > 0) {
    console.log('\nFailed tests:');
    for (const r of results.filter(r => r.status === 'fail')) {
      console.log(`  ${FAIL} ${r.name}: ${r.details}`);
      if (r.reply) console.log(`     Reply: "${r.reply.substring(0, 100)}..."`);
    }
  }

  // Cleanup test data
  console.log('\nCleaning up test data...');
  const testUsers = await db.select().from(schema.users).where(
    eq(schema.users.phone, '') // we'll clean by pattern below
  );
  // Clean test users (ignore FK errors)
  const allUsers = await db.select().from(schema.users);
  for (const u of allUsers) {
    if (u.phone.startsWith('test:')) {
      try { await cleanup(u.id); } catch (e) { /* FK constraint, fine */ }
    }
  }
  console.log('Done.');

  process.exit(failed > 0 ? 1 : 0);
}

run().catch(console.error);
