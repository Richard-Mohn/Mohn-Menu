/**
 * Seed Demo Business — run with: node scripts/seedDemo.js
 *
 * Creates a fully-configured demo restaurant in Firestore with:
 *  - Business document (website, settings, brand, all new fields)
 *  - 30+ menu items across multiple categories (from menu.json)
 *  - Ready to test at http://localhost:3000/china-wok-rva (tenant site)
 *  - Ready to test at http://localhost:3000/order/china-wok-rva (order page)
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// ── Init Firebase Admin ──
const serviceAccount = require(path.resolve(__dirname, '..', 'serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://chinese-system-default-rtdb.firebaseio.com',
  });
}

const db = admin.firestore();

// ── Demo business ID (fixed so re-running overwrites cleanly) ──
const BUSINESS_ID = 'demo-china-wok-rva';
const BUSINESS_SLUG = 'china-wok-rva';

async function seed() {
  console.log('🌱 Seeding demo business...\n');

  // ── 1. Business document ──
  const now = new Date().toISOString();

  const business = {
    businessId: BUSINESS_ID,
    name: 'China Wok',
    slug: BUSINESS_SLUG,
    ownerId: 'demo-owner-uid',
    type: 'restaurant',
    description: 'Authentic Chinese cuisine made fresh daily in the heart of Richmond. Family recipes passed down for generations, using only the finest ingredients.',
    logo: '',

    tier: 'free',
    subscriptionStatus: 'active',
    subscriptionStartDate: now,

    brandColors: {
      primary: '#DC2626',
      secondary: '#991B1B',
      accent: '#F59E0B',
    },

    ownerEmail: 'owner@chinawok.com',
    ownerPhone: '(804) 555-1234',
    businessPhone: '(804) 555-8888',

    address: '1234 Broad Street',
    city: 'Richmond',
    state: 'VA',
    zipCode: '23220',
    latitude: 37.5538,
    longitude: -77.4603,
    timezone: 'America/New_York',
    location: { lat: 37.5538, lng: -77.4603 },

    // ── Full website config ──
    website: {
      enabled: true,
      setupComplete: true,
      customDomainEnabled: false,
      selectedServices: ['online-ordering', 'delivery', 'takeout', 'dine-in', 'catering'],
      selectedStates: ['VA'],
      selectedCities: ['Richmond', 'Henrico', 'Glen Allen', 'Short Pump', 'Midlothian'],
      cuisineType: 'chinese',
      foodCategories: ['appetizers', 'entrees', 'soups', 'fried-rice', 'lo-mein'],
      menuHighlights: ["General Tso's Chicken", 'Sesame Chicken', 'Mongolian Beef', 'Shrimp Lo Mein'],
      specialties: ['Authentic Cantonese', 'Szechuan Favorites', 'House Special Combos'],
      content: {
        tagline: 'Richmond\'s Favorite Chinese Restaurant Since 2005',
        heroTitle: 'China Wok',
        heroSubtitle: 'Authentic Chinese cuisine crafted fresh daily. Order online for delivery or pickup — no middleman, no inflated prices.',
        aboutTitle: 'About China Wok',
        aboutContent: 'For over 20 years, China Wok has been serving the Richmond community with authentic Chinese dishes made from scratch. Our chefs bring decades of experience and family recipes from Guangdong Province.',
        aboutMission: 'To bring the authentic flavors of China to every home in Richmond — fresh, affordable, and made with love.',
        aboutValues: 'Fresh ingredients, generous portions, fast service, and fair prices.',
        contactTitle: 'Get in Touch',
        contactContent: 'Questions? Want to place a catering order? Reach out and we\'ll get back to you right away.',
        businessHours: 'Mon-Thu: 11am-10pm | Fri-Sat: 11am-11pm | Sun: 12pm-9:30pm',
        serviceDescriptions: {
          'online-ordering': 'Browse our full menu and order from your phone or computer. Your food is prepared the moment we receive your order.',
          'delivery': 'Fast delivery within 30-45 minutes to Richmond, Henrico, and surrounding areas. Real-time GPS tracking included.',
          'takeout': 'Order ahead and your food will be hot and ready when you arrive. Skip the wait!',
          'dine-in': 'Enjoy our comfortable dining room. Perfect for family dinners and special occasions.',
          'catering': 'We cater events from 10 to 500 people. Custom menus available. Call for a quote!',
        },
      },
      seo: {
        metaTitle: 'China Wok - Best Chinese Food in Richmond VA | Order Online',
        metaDescription: 'Order authentic Chinese food online from China Wok in Richmond, VA. Delivery, takeout, dine-in. Fresh ingredients, generous portions, no middleman fees.',
        keywords: ['chinese food richmond va', 'chinese restaurant near me', 'order chinese food online', 'china wok richmond'],
      },
    },

    // ── Settings (with all new fields) ──
    settings: {
      orderingEnabled: true,
      primaryColor: '#DC2626',
      logoUrl: '',
      pricing: {
        deliveryFee: 3.99,
        minimumOrder: 15,
        taxRate: 0.07,
      },
      cashPaymentsEnabled: true, // Cash allowed — toggle off to test card-only
      thirdPartyDelivery: {
        enabled: true,
        uberEatsUrl: 'https://www.ubereats.com/store/china-wok-richmond',
        doordashUrl: 'https://www.doordash.com/store/china-wok-richmond',
        grubhubUrl: '',
      },
      useMarketplaceDrivers: false,
    },

    features: {
      liveOrderTracking: true,
      driverManagement: true,
      kitchenDisplaySystem: false,
      loyaltyProgram: false,
      liveStreaming: false,
      batchRouting: false,
      advancedAnalytics: false,
      apiAccess: false,
      customIntegrations: false,
      seoWebsite: true,
    },

    serviceAreas: ['Richmond', 'Henrico', 'Glen Allen', 'Short Pump', 'Midlothian'],
    services: ['dine-in', 'takeout', 'delivery', 'catering'],

    isActive: true,
    isLocked: false,

    maxInhouseDrivers: 3,
    inHouseDriverIds: [],
    staffCount: 8,

    monthlyRevenue: 0,
    totalOrders: 0,
    customerCount: 0,

    createdAt: now,
    updatedAt: now,
  };

  await db.doc(`businesses/${BUSINESS_ID}`).set(business);
  console.log('✅ Business document created: businesses/' + BUSINESS_ID);

  // ── 2. Menu items (grab a good sample from menu.json) ──
  const menuRaw = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '..', 'data', 'menu.json'), 'utf8')
  );

  // Pick items across categories for a good demo — first 3 from each category, up to ~50
  const categoryMap = {};
  for (const item of menuRaw) {
    if (!categoryMap[item.category]) categoryMap[item.category] = [];
    categoryMap[item.category].push(item);
  }

  const selectedItems = [];
  const categoriesToShow = [
    'Appetizers', 'Soup', 'Fried Rice', 'Lo Mein',
    'Chicken', 'Beef', 'Seafood', 'Pork',
    "Chef's Specialties", 'Sweet & Sour', 'Vegetables',
    'Combination Platters', 'Lunch Specials',
  ];

  for (const cat of categoriesToShow) {
    const items = categoryMap[cat] || [];
    selectedItems.push(...items.slice(0, 4)); // 4 per category
  }

  console.log(`📋 Seeding ${selectedItems.length} menu items across ${categoriesToShow.length} categories...`);

  const menuRef = db.collection(`businesses/${BUSINESS_ID}/menuItems`);

  // Clear existing menu items first
  const existing = await menuRef.get();
  const batch1 = db.batch();
  existing.docs.forEach(doc => batch1.delete(doc.ref));
  if (existing.docs.length > 0) {
    await batch1.commit();
    console.log(`   🗑️  Cleared ${existing.docs.length} existing menu items`);
  }

  // Write in batches of 20 (Firestore batch limit is 500)
  let batchCount = 0;
  let batch = db.batch();
  for (const item of selectedItems) {
    const docRef = menuRef.doc(item.id);
    const price = item.prices?.order ?? item.prices?.small ?? Object.values(item.prices || {})[0] ?? 0;
    batch.set(docRef, {
      id: item.id,
      category: item.category,
      name: item.name,
      description: item.description || '',
      price: price,
      prices: item.prices || { order: price },
      image_url: item.image_url || '',
      isSpicy: item.isSpicy || false,
      popular: item.popular || false,
      available: true,
    });
    batchCount++;
    if (batchCount % 20 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }
  if (batchCount % 20 !== 0) {
    await batch.commit();
  }

  console.log(`✅ ${selectedItems.length} menu items seeded\n`);

  // ── Summary ──
  console.log('════════════════════════════════════════════════════════');
  console.log('  🎉  DEMO BUSINESS READY!');
  console.log('════════════════════════════════════════════════════════');
  console.log('');
  console.log('  Start the dev server:  npm run dev');
  console.log('');
  console.log('  Then open these pages:');
  console.log('');
  console.log('  🏠 Tenant Website:');
  console.log('     http://localhost:3000/china-wok-rva');
  console.log('');
  console.log('  📋 Menu Page:');
  console.log('     http://localhost:3000/china-wok-rva/menu');
  console.log('');
  console.log('  🛒 Order & Pay (Stripe test cards):');
  console.log('     http://localhost:3000/order/china-wok-rva');
  console.log('');
  console.log('  💳 Test card: 4242 4242 4242 4242');
  console.log('     Exp: 12/28  CVC: 123  ZIP: 12345');
  console.log('');
  console.log('  ⚙️  Settings (toggle cash, delivery links):');
  console.log('     Log in as owner → /owner/settings');
  console.log('');
  console.log('════════════════════════════════════════════════════════');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
