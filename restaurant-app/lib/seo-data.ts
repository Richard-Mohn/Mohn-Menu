/**
 * SEO Data Layer for MohnMenu Platform
 * 
 * Comprehensive data for auto-generating SEO websites for restaurants,
 * convenience stores, bakeries, food trucks, and all food/store businesses.
 * 
 * This is the brain behind the WebsiteBuilder — it generates rich,
 * unique, keyword-dense content for every service + location page combo.
 */

// ─────────────────────────────────────────────────────────────────
// CUISINE TYPES — what kind of food does this business serve?
// ─────────────────────────────────────────────────────────────────

export interface CuisineType {
  key: string;
  label: string;
  emoji: string;
  keywords: string[];
  description: string;
}

export const CUISINE_TYPES: CuisineType[] = [
  { key: 'chinese', label: 'Chinese', emoji: '🥡', keywords: ['chinese food', 'chinese restaurant', 'asian cuisine', 'lo mein', 'general tso', 'fried rice', 'dim sum', 'wonton'], description: 'Authentic Chinese cuisine featuring traditional wok-fried dishes, dim sum, noodles, and family-style meals.' },
  { key: 'mexican', label: 'Mexican', emoji: '🌮', keywords: ['mexican food', 'tacos', 'burritos', 'quesadillas', 'enchiladas', 'tamales', 'mexican restaurant'], description: 'Flavorful Mexican cuisine with handmade tortillas, slow-cooked meats, fresh salsas, and traditional recipes.' },
  { key: 'italian', label: 'Italian', emoji: '🍕', keywords: ['italian food', 'pizza', 'pasta', 'calzone', 'italian restaurant', 'lasagna', 'garlic bread'], description: 'Classic Italian cuisine featuring hand-tossed pizzas, fresh pasta, wood-fired entrees, and homemade sauces.' },
  { key: 'american', label: 'American', emoji: '🍔', keywords: ['american food', 'burgers', 'fries', 'sandwiches', 'wings', 'american grill', 'comfort food'], description: 'Classic American comfort food — juicy burgers, crispy fries, loaded sandwiches, and all your favorites.' },
  { key: 'japanese', label: 'Japanese', emoji: '🍣', keywords: ['japanese food', 'sushi', 'ramen', 'teriyaki', 'hibachi', 'japanese restaurant', 'tempura'], description: 'Fresh Japanese cuisine including sushi rolls, ramen bowls, teriyaki, tempura, and bento boxes.' },
  { key: 'indian', label: 'Indian', emoji: '🍛', keywords: ['indian food', 'curry', 'tandoori', 'biryani', 'naan', 'tikka masala', 'indian restaurant'], description: 'Rich Indian cuisine with aromatic curries, fresh-baked naan, tandoori specialties, and bold spices.' },
  { key: 'thai', label: 'Thai', emoji: '🍜', keywords: ['thai food', 'pad thai', 'thai curry', 'spring rolls', 'thai restaurant', 'coconut curry'], description: 'Vibrant Thai cuisine with perfectly balanced flavors — pad thai, curries, spring rolls, and stir-fry.' },
  { key: 'korean', label: 'Korean', emoji: '🍖', keywords: ['korean food', 'korean bbq', 'bibimbap', 'kimchi', 'bulgogi', 'korean restaurant'], description: 'Korean cuisine featuring BBQ, bibimbap bowls, kimchi, and bold fermented flavors.' },
  { key: 'vietnamese', label: 'Vietnamese', emoji: '🍲', keywords: ['vietnamese food', 'pho', 'banh mi', 'spring rolls', 'vietnamese restaurant', 'bun'], description: 'Fresh Vietnamese cuisine — pho noodle soups, banh mi sandwiches, spring rolls, and vermicelli bowls.' },
  { key: 'mediterranean', label: 'Mediterranean', emoji: '🥙', keywords: ['mediterranean food', 'falafel', 'hummus', 'gyro', 'kebab', 'shawarma', 'pita'], description: 'Mediterranean and Middle Eastern flavors — falafel, hummus, shawarma, fresh salads, and grilled kebabs.' },
  { key: 'caribbean', label: 'Caribbean', emoji: '🍗', keywords: ['caribbean food', 'jerk chicken', 'plantains', 'rice and peas', 'oxtail', 'caribbean restaurant'], description: 'Bold Caribbean flavors with jerk-seasoned meats, plantains, rice and peas, and island-inspired dishes.' },
  { key: 'soul-food', label: 'Soul Food', emoji: '🍖', keywords: ['soul food', 'fried chicken', 'collard greens', 'mac and cheese', 'cornbread', 'southern cooking'], description: 'Hearty soul food and Southern cooking — fried chicken, collard greens, mac and cheese, and homestyle sides.' },
  { key: 'bbq', label: 'BBQ & Smokehouse', emoji: '🔥', keywords: ['bbq', 'barbecue', 'smoked meat', 'ribs', 'brisket', 'pulled pork', 'bbq restaurant'], description: 'Slow-smoked BBQ with tender ribs, brisket, pulled pork, and all the classic sides.' },
  { key: 'seafood', label: 'Seafood', emoji: '🦞', keywords: ['seafood', 'fish', 'shrimp', 'crab', 'lobster', 'seafood restaurant', 'fish fry'], description: 'Fresh seafood — fish fry, shrimp, crab legs, lobster, and ocean-to-table specialties.' },
  { key: 'pizza', label: 'Pizza', emoji: '🍕', keywords: ['pizza', 'pizza delivery', 'pizza shop', 'slices', 'NY style pizza', 'calzones', 'stromboli'], description: 'Hot, fresh pizza made with quality ingredients. Classic pies, specialty toppings, calzones, and more.' },
  { key: 'wings', label: 'Wings', emoji: '🍗', keywords: ['wings', 'chicken wings', 'buffalo wings', 'wing restaurant', 'hot wings', 'wing delivery'], description: 'Crispy wings in every flavor — buffalo, honey garlic, lemon pepper, BBQ, and dozens more.' },
  { key: 'sub-sandwich', label: 'Subs & Sandwiches', emoji: '🥪', keywords: ['subs', 'sandwiches', 'hoagies', 'deli', 'cheesesteak', 'sub shop', 'grinder'], description: 'Fresh-made subs, sandwiches, cheesesteaks, and wraps with premium deli meats and toppings.' },
  { key: 'breakfast', label: 'Breakfast & Brunch', emoji: '🥞', keywords: ['breakfast', 'brunch', 'pancakes', 'eggs', 'waffles', 'breakfast delivery', 'omelette'], description: 'Breakfast and brunch favorites — pancakes, eggs, waffles, omelettes, and hearty morning plates.' },
  { key: 'vegan', label: 'Vegan & Plant-Based', emoji: '🥗', keywords: ['vegan food', 'plant-based', 'vegan restaurant', 'vegetarian', 'vegan delivery', 'meatless'], description: 'Delicious vegan and plant-based meals. Flavorful, nutritious, and 100% cruelty-free.' },
  { key: 'desserts', label: 'Desserts & Sweets', emoji: '🧁', keywords: ['desserts', 'ice cream', 'cupcakes', 'cookies', 'cake', 'pastry', 'sweets'], description: 'Sweet treats — custom cakes, cupcakes, cookies, ice cream, and freshly baked pastries.' },
  { key: 'coffee-tea', label: 'Coffee & Tea', emoji: '☕', keywords: ['coffee', 'tea', 'espresso', 'latte', 'cafe', 'coffee shop', 'boba', 'bubble tea'], description: 'Fresh brewed coffee, espresso drinks, specialty teas, and refreshing boba — made to order.' },
  { key: 'smoothie-juice', label: 'Smoothies & Juice', emoji: '🥤', keywords: ['smoothies', 'juice', 'juice bar', 'acai bowl', 'fresh juice', 'protein shake'], description: 'Fresh-pressed juices, blended smoothies, acai bowls, and healthy protein shakes.' },
  { key: 'greek', label: 'Greek', emoji: '🥙', keywords: ['greek food', 'gyro', 'souvlaki', 'greek salad', 'greek restaurant', 'spanakopita'], description: 'Authentic Greek cuisine with gyros, souvlaki, fresh salads, and classic Mediterranean flavors.' },
  { key: 'ethiopian', label: 'Ethiopian', emoji: '🍲', keywords: ['ethiopian food', 'injera', 'wat', 'ethiopian restaurant', 'tibs', 'kitfo'], description: 'Traditional Ethiopian cuisine served on injera bread with flavorful stews, lentils, and spiced meats.' },
  { key: 'african', label: 'African', emoji: '🍲', keywords: ['african food', 'jollof rice', 'suya', 'west african', 'african restaurant', 'fufu'], description: 'West African and pan-African cuisine featuring jollof rice, suya, fufu, and bold regional flavors.' },
  { key: 'halal', label: 'Halal', emoji: '🥙', keywords: ['halal food', 'halal restaurant', 'halal cart', 'halal chicken', 'halal meat', 'halal delivery'], description: 'Certified halal food prepared with care. Chicken, lamb, beef, and rice platters made fresh.' },
  { key: 'fusion', label: 'Fusion', emoji: '🍽️', keywords: ['fusion food', 'fusion restaurant', 'modern cuisine', 'creative menu', 'craft kitchen'], description: 'Creative fusion cuisine blending global flavors into unique, Instagram-worthy dishes.' },
  { key: 'general', label: 'General / Other', emoji: '🍽️', keywords: ['restaurant', 'food', 'local food', 'order food', 'food delivery', 'eat local'], description: 'Great food made fresh to order. Browse our menu and order online for delivery or pickup.' },
];

// ─────────────────────────────────────────────────────────────────
// STORE ITEM CATEGORIES — for convenience stores, grocery, etc.
// ─────────────────────────────────────────────────────────────────

export interface StoreCategory {
  key: string;
  label: string;
  emoji: string;
  keywords: string[];
}

export const STORE_CATEGORIES: StoreCategory[] = [
  { key: 'snacks', label: 'Snacks & Chips', emoji: '🍿', keywords: ['snacks', 'chips', 'candy', 'jerky', 'nuts', 'popcorn'] },
  { key: 'drinks', label: 'Drinks & Beverages', emoji: '🥤', keywords: ['drinks', 'soda', 'water', 'juice', 'energy drinks', 'beverages'] },
  { key: 'tobacco', label: 'Tobacco & Vape', emoji: '🚬', keywords: ['tobacco', 'cigarettes', 'vape', 'e-cigarette', 'cigars'] },
  { key: 'beer-wine', label: 'Beer & Wine', emoji: '🍺', keywords: ['beer', 'wine', 'liquor', 'alcohol', 'craft beer', 'spirits'] },
  { key: 'grocery', label: 'Grocery Essentials', emoji: '🛒', keywords: ['grocery', 'milk', 'eggs', 'bread', 'butter', 'essentials'] },
  { key: 'household', label: 'Household Items', emoji: '🧹', keywords: ['household', 'cleaning', 'paper towels', 'trash bags', 'soap'] },
  { key: 'health', label: 'Health & Wellness', emoji: '💊', keywords: ['health', 'medicine', 'vitamins', 'first aid', 'pain relief'] },
  { key: 'personal-care', label: 'Personal Care', emoji: '🧴', keywords: ['personal care', 'shampoo', 'deodorant', 'toothpaste', 'body wash'] },
  { key: 'ice-cream', label: 'Ice Cream & Frozen', emoji: '🍦', keywords: ['ice cream', 'frozen', 'popsicles', 'frozen meals', 'ice'] },
  { key: 'phone-accessories', label: 'Phone & Accessories', emoji: '📱', keywords: ['phone charger', 'earbuds', 'phone case', 'phone accessories'] },
  { key: 'lottery', label: 'Lottery & Scratch-offs', emoji: '🎰', keywords: ['lottery', 'scratch off', 'lotto', 'powerball', 'mega millions'] },
  { key: 'prepared-food', label: 'Hot Prepared Food', emoji: '🌭', keywords: ['hot food', 'prepared food', 'hot dogs', 'pizza slices', 'breakfast sandwiches'] },
];

// ─────────────────────────────────────────────────────────────────
// SERVICE_INFO EXTENDED — with richer content generators
// ─────────────────────────────────────────────────────────────────

/**
 * Generate a rich, unique service page description based on the business name,
 * city, state, cuisine type, and service type.
 */
export function generateServiceContent(
  businessName: string,
  city: string,
  state: string,
  serviceKey: string,
  cuisineType?: string,
): { title: string; intro: string; features: string[]; faq: { q: string; a: string }[] } {
  const cuisine = CUISINE_TYPES.find(c => c.key === cuisineType);
  const cuisineLabel = cuisine?.label || 'fresh';

  const templates: Record<string, {
    title: (biz: string, loc: string) => string;
    intro: (biz: string, loc: string, cuisineLabel: string) => string;
    features: string[];
    faq: (biz: string, loc: string) => { q: string; a: string }[];
  }> = {
    'online-ordering': {
      title: (biz, loc) => `Order Online from ${biz} — ${loc}`,
      intro: (biz, loc, c) => `${biz} makes it easy to order ${c} food online in ${loc}. Browse our full menu, customize your order, and check out in seconds. No app downloads needed — just pick your items, choose delivery or pickup, and we handle the rest. No inflated prices, no hidden fees, just great food at honest prices.`,
      features: ['Full menu available 24/7', 'No app download required', 'Save your favorites', 'Real-time order updates', 'No service fees or markups', 'Guest checkout available'],
      faq: (biz, loc) => [
        { q: `How do I order online from ${biz}?`, a: `Visit our website, browse the menu, add items to your cart, and check out. You can pay online or choose cash on delivery. It takes less than 2 minutes.` },
        { q: `Is there a minimum order for online ordering?`, a: `We may have a small minimum for delivery orders. Pickup orders have no minimum. Check our menu page for current details.` },
        { q: `Can I schedule an order for later?`, a: `Yes! You can place your order now and schedule it for a specific date and time.` },
      ],
    },
    'delivery': {
      title: (biz, loc) => `${biz} Delivery in ${loc} — Fast & Fresh`,
      intro: (biz, loc, c) => `Get ${c} food delivered from ${biz} right to your door in ${loc}. We deliver fast with real-time GPS tracking so you always know where your order is. Our drivers are local, our food is fresh, and our prices are honest — no inflated delivery menu prices like the big apps charge.`,
      features: ['Real-time GPS tracking', 'Fast delivery times', 'No inflated menu prices', 'Hot food guarantee', 'Contactless delivery option', 'Delivery text/call updates'],
      faq: (biz, loc) => [
        { q: `What is ${biz}'s delivery area in ${loc}?`, a: `We deliver throughout ${loc} and surrounding areas. Enter your address at checkout to confirm delivery availability.` },
        { q: `How much does delivery cost?`, a: `Our delivery fee is transparent and shown at checkout. No hidden fees, no surprise charges. Much less than third-party apps.` },
        { q: `How can I track my delivery?`, a: `After placing your order, you'll receive a real-time tracking link via text. Watch your driver on a live map as they head to you.` },
      ],
    },
    'takeout': {
      title: (biz, loc) => `Takeout & Pickup from ${biz} — ${loc}`,
      intro: (biz, loc, c) => `Order ahead from ${biz} in ${loc} and pick up your ${c} food hot and ready. Skip the wait — your order will be prepared and packaged by the time you arrive. Just walk in, grab your bag, and go. It's the fastest way to enjoy ${biz} without sitting down.`,
      features: ['Order ahead, skip the line', 'Ready when you arrive', 'Curbside pickup available', 'No service fees', 'Packaged fresh for travel', 'Phone-in orders accepted'],
      faq: (biz, loc) => [
        { q: `How does pickup work at ${biz}?`, a: `Place your order online, select a pickup time, and come to our ${loc} location. Your food will be ready and waiting. No line, no wait.` },
        { q: `Do you offer curbside pickup?`, a: `Yes! Just let us know you're in the parking lot and we'll bring your order out to you.` },
        { q: `How far in advance can I order for pickup?`, a: `You can order for immediate pickup (usually ready in 15-30 minutes) or schedule ahead for any time during business hours.` },
      ],
    },
    'dine-in': {
      title: (biz, loc) => `Dine In at ${biz} — ${loc} Restaurant`,
      intro: (biz, loc, c) => `Experience the best ${c} dining in ${loc} at ${biz}. Our comfortable restaurant offers a welcoming atmosphere, friendly staff, and food that's made fresh in our kitchen. Whether it's a family dinner, a date night, or a quick lunch break, we've got the perfect table for you.`,
      features: ['Comfortable dining room', 'Full menu available', 'Groups & families welcome', 'Clean, inviting atmosphere', 'Friendly, attentive service', 'Daily specials'],
      faq: (biz, loc) => [
        { q: `Do I need a reservation at ${biz}?`, a: `Walk-ins are always welcome! For large parties, we recommend calling ahead so we can prepare your table.` },
        { q: `What are ${biz}'s dine-in hours?`, a: `Check our Contact page for current hours. We're typically open for lunch and dinner service.` },
        { q: `Is parking available?`, a: `Yes, we have convenient parking at our ${loc} location. See our contact page for the full address.` },
      ],
    },
    'catering': {
      title: (biz, loc) => `Catering by ${biz} — Events in ${loc}`,
      intro: (biz, loc, c) => `${biz} provides professional ${c} catering for events in ${loc} and surrounding areas. From corporate lunches to birthday parties, graduation celebrations to wedding receptions — we bring the kitchen to you. Full menu available, custom packages, and reliable delivery to your venue.`,
      features: ['Corporate events & meetings', 'Birthday & graduation parties', 'Wedding receptions', 'Custom menu packages', 'Serving utensils included', 'Setup & delivery available'],
      faq: (biz, loc) => [
        { q: `How far in advance should I book catering?`, a: `We recommend booking at least 48-72 hours in advance. For large events (50+ guests), 1-2 weeks notice is ideal.` },
        { q: `What is the minimum order for catering?`, a: `Our catering packages start at 10 servings. Contact us for custom quotes on larger events.` },
        { q: `Do you deliver catering orders?`, a: `Yes! We deliver catering orders throughout ${loc} and surrounding areas. Setup service is also available.` },
      ],
    },
    'convenience-store': {
      title: (biz, loc) => `${biz} Convenience Store — ${loc}`,
      intro: (biz, loc) => `${biz} is your neighborhood convenience store in ${loc}. We carry snacks, drinks, everyday essentials, and more — available for delivery or in-store pickup. Need something fast? Order through our app and we'll have it ready in minutes, or get it delivered to your door.`,
      features: ['Snacks, drinks & essentials', 'Fast delivery available', 'Open late hours', 'Everyday low prices', 'Lottery & scratch-offs', 'ATM on-site'],
      faq: (biz, loc) => [
        { q: `Does ${biz} deliver convenience store items?`, a: `Yes! Order online and we'll deliver snacks, drinks, and essentials right to your door in ${loc}.` },
        { q: `What hours is ${biz} open?`, a: `Check our Contact page for current hours. We're typically open early morning through late night.` },
        { q: `Do you sell lottery tickets?`, a: `Yes, we sell lottery tickets and scratch-offs in-store.` },
      ],
    },
    'grocery': {
      title: (biz, loc) => `Grocery Delivery from ${biz} — ${loc}`,
      intro: (biz, loc) => `Shop grocery essentials from ${biz} in ${loc}. Fresh produce, pantry staples, dairy, meats, and household items — delivered to your door or ready for pickup. Skip the grocery store lines and shop from home.`,
      features: ['Fresh produce & dairy', 'Pantry staples & dry goods', 'Meats & proteins', 'Household essentials', 'Fast delivery or pickup', 'Competitive prices'],
      faq: (biz, loc) => [
        { q: `How fast is grocery delivery from ${biz}?`, a: `Most grocery orders in ${loc} are delivered within 1-2 hours. You can also schedule for a specific time.` },
        { q: `Is there a minimum order for grocery delivery?`, a: `Check our site for the current minimum. We keep it low so you can order what you need.` },
        { q: `Can I substitute items if something is out of stock?`, a: `Yes! We'll contact you about substitutions before completing your order.` },
      ],
    },
    'bakery': {
      title: (biz, loc) => `${biz} Bakery — Fresh Baked in ${loc}`,
      intro: (biz, loc) => `Freshly baked goods from ${biz} in ${loc}. Custom cakes, pastries, bread, cookies, and desserts — all made from scratch daily. Order ahead for guaranteed freshness. Perfect for birthdays, weddings, holidays, or treating yourself any day of the week.`,
      features: ['Custom cakes & cupcakes', 'Fresh bread daily', 'Pastries & croissants', 'Cookie platters & trays', 'Wedding & event cakes', 'Pre-order for pickup'],
      faq: (biz, loc) => [
        { q: `How far in advance should I order a custom cake?`, a: `We recommend at least 3-5 days for custom cakes. For wedding cakes, 2-4 weeks is ideal.` },
        { q: `Does ${biz} deliver baked goods in ${loc}?`, a: `Yes! We deliver fresh baked goods throughout ${loc}. Order online and choose your delivery time.` },
        { q: `Are your baked goods made fresh daily?`, a: `Absolutely. Everything is baked fresh in our ${loc} kitchen daily. We never sell day-old goods.` },
      ],
    },
    'meal-prep': {
      title: (biz, loc) => `Meal Prep by ${biz} — Healthy Meals in ${loc}`,
      intro: (biz, loc, c) => `${biz} offers weekly ${c} meal prep packages in ${loc}. Healthy, portioned, ready-to-eat meals that save you time and keep you on track. Perfect for busy professionals, fitness enthusiasts, and families who want home-cooked quality without the daily cooking.`,
      features: ['Weekly meal packages', 'Macro-friendly portions', 'Fresh, never frozen', 'Customizable menus', 'Delivery or pickup', 'Subscription discounts'],
      faq: (biz, loc) => [
        { q: `How does meal prep delivery work in ${loc}?`, a: `Choose your meals for the week, place your order by the cutoff date, and we deliver fresh prepared meals to your door.` },
        { q: `Can I customize my meal prep plan?`, a: `Yes! Choose from our rotating menu each week. We accommodate dietary preferences and allergies.` },
        { q: `How long do meal prep meals last?`, a: `Our meals stay fresh in the refrigerator for 4-5 days. They can also be frozen for up to 3 months.` },
      ],
    },
    'food-truck': {
      title: (biz, loc) => `${biz} Food Truck — ${loc} Schedule & Menu`,
      intro: (biz, loc, c) => `Find ${biz}'s food truck serving ${c} food around ${loc}. Check our schedule, see where we'll be next, and pre-order your favorites so they're ready when you arrive. Catch us at events, festivals, office parks, and popular spots throughout ${loc}.`,
      features: ['Live location schedule', 'Pre-order online', 'Event & festival catering', 'Office park service', 'Follow us on social media', 'Corporate lunch programs'],
      faq: (biz, loc) => [
        { q: `Where is ${biz}'s food truck today?`, a: `Check our schedule page or follow us on social media for daily location updates in ${loc}.` },
        { q: `Can I book the food truck for a private event?`, a: `Absolutely! We do private events, corporate lunches, weddings, and parties. Contact us for a quote.` },
        { q: `Can I pre-order from the food truck?`, a: `Yes! Pre-order online and your food will be ready when you arrive at our current location.` },
      ],
    },
    'family-packs': {
      title: (biz, loc) => `Family Meal Packs from ${biz} — ${loc}`,
      intro: (biz, loc, c) => `Feed the whole family with ${c} family packs from ${biz} in ${loc}. Our value-packed family meals include everything you need — entrees, sides, drinks, and desserts at bundle prices. Perfect for busy weeknights, game days, and family gatherings.`,
      features: ['Feeds 4-6 people', 'Entrees + sides + drinks included', 'Better value than ordering separately', 'Customizable combos', 'Delivery or pickup', 'Great for parties'],
      faq: (biz, loc) => [
        { q: `How many people does a family pack feed?`, a: `Our family packs typically feed 4-6 people, depending on the package. Check the menu for specific portions.` },
        { q: `Can I customize a family pack?`, a: `Yes! You can swap items and customize most family packs when ordering online.` },
        { q: `Are family packs available for delivery in ${loc}?`, a: `Yes, all family packs are available for delivery throughout ${loc}. Order online for the best experience.` },
      ],
    },
    'late-night': {
      title: (biz, loc) => `Late Night Food from ${biz} — ${loc}`,
      intro: (biz, loc, c) => `Hungry late? ${biz} has you covered in ${loc}. Our late-night ${c} menu is available for delivery and pickup when most places are already closed. Quality food, fast service, and real-time tracking — even at midnight.`,
      features: ['Open late hours', 'Full menu available', 'Fast late-night delivery', 'Pickup available', 'Real-time order tracking', 'College student specials'],
      faq: (biz, loc) => [
        { q: `What time does ${biz} close?`, a: `We're open late! Check our Contact page for exact hours. Our late-night menu is available until close.` },
        { q: `Is delivery available late at night in ${loc}?`, a: `Yes! We deliver during all operating hours, including late night. Order through our website.` },
        { q: `Is the full menu available late night?`, a: `Most of our menu is available during late-night hours. Some specialty items may be limited — check online for the current late-night menu.` },
      ],
    },
  };

  const tmpl = templates[serviceKey] || templates['online-ordering']!;
  const location = `${city}, ${state}`;

  return {
    title: tmpl.title(businessName, location),
    intro: tmpl.intro(businessName, location, cuisineLabel),
    features: tmpl.features,
    faq: tmpl.faq(businessName, location),
  };
}

// ─────────────────────────────────────────────────────────────────
// LOCATION PAGE CONTENT GENERATOR
// ─────────────────────────────────────────────────────────────────

export function generateLocationContent(
  businessName: string,
  city: string,
  state: string,
  cuisineType?: string,
  services?: string[],
): { title: string; intro: string; highlights: string[] } {
  const cuisine = CUISINE_TYPES.find(c => c.key === cuisineType);
  const cuisineLabel = cuisine?.label || 'delicious';
  const serviceLabels = (services || []).slice(0, 3).join(', ') || 'delivery and pickup';

  return {
    title: `${businessName} in ${city}, ${state} — Order ${cuisineLabel} Food Online`,
    intro: `Looking for the best ${cuisineLabel.toLowerCase()} food in ${city}, ${state}? ${businessName} serves ${city} and the surrounding area with ${serviceLabels}. Browse our full menu online, place your order in seconds, and enjoy fresh food without the hassle. No third-party app markups — order direct from us and save.`,
    highlights: [
      `Serving ${city}, ${state} and nearby areas`,
      `${cuisineLabel} food made fresh to order`,
      'Order online — no app download needed',
      'Real-time delivery tracking',
      'No hidden fees or inflated prices',
      `Fast, reliable service in ${city}`,
    ],
  };
}

// ─────────────────────────────────────────────────────────────────
// STATE → CITY DATABASE — all 50 states with major cities
// ─────────────────────────────────────────────────────────────────

export const US_STATES_WITH_CITIES: Record<string, { name: string; cities: string[] }> = {
  AL: { name: 'Alabama', cities: ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile', 'Tuscaloosa', 'Hoover', 'Dothan', 'Auburn', 'Decatur', 'Madison', 'Florence', 'Gadsden'] },
  AK: { name: 'Alaska', cities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan', 'Wasilla', 'Kenai', 'Kodiak', 'Bethel', 'Palmer'] },
  AZ: { name: 'Arizona', cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe', 'Peoria', 'Surprise', 'Yuma', 'Flagstaff'] },
  AR: { name: 'Arkansas', cities: ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro', 'North Little Rock', 'Conway', 'Rogers', 'Pine Bluff', 'Bentonville'] },
  CA: { name: 'California', cities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 'Stockton', 'Irvine', 'Chula Vista', 'Fremont', 'San Bernardino', 'Modesto', 'Fontana', 'Moreno Valley'] },
  CO: { name: 'Colorado', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Pueblo', 'Boulder', 'Greeley', 'Longmont'] },
  CT: { name: 'Connecticut', cities: ['Bridgeport', 'New Haven', 'Stamford', 'Hartford', 'Waterbury', 'Norwalk', 'Danbury', 'New Britain', 'West Hartford', 'Greenwich', 'Hamden', 'Bristol'] },
  DE: { name: 'Delaware', cities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna', 'Milford', 'Seaford', 'Georgetown', 'Elsmere', 'New Castle'] },
  FL: { name: 'Florida', cities: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Fort Lauderdale', 'Port St. Lucie', 'Cape Coral', 'Pembroke Pines', 'Hollywood', 'Gainesville', 'Miramar', 'Coral Springs', 'Clearwater', 'Palm Bay', 'Lakeland', 'West Palm Beach'] },
  GA: { name: 'Georgia', cities: ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens', 'Sandy Springs', 'Roswell', 'Macon', 'Johns Creek', 'Albany', 'Warner Robins', 'Alpharetta', 'Marietta', 'Valdosta', 'Smyrna', 'Dunwoody'] },
  HI: { name: 'Hawaii', cities: ['Honolulu', 'East Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Waipahu', 'Kaneohe', 'Mililani Town', 'Kahului', 'Ewa Gentry'] },
  ID: { name: 'Idaho', cities: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Caldwell', 'Pocatello', 'Coeur d\'Alene', 'Twin Falls', 'Post Falls', 'Lewiston'] },
  IL: { name: 'Illinois', cities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield', 'Elgin', 'Peoria', 'Champaign', 'Waukegan', 'Cicero', 'Bloomington', 'Arlington Heights', 'Evanston', 'Schaumburg'] },
  IN: { name: 'Indiana', cities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel', 'Fishers', 'Bloomington', 'Hammond', 'Gary', 'Lafayette', 'Muncie', 'Terre Haute', 'Kokomo', 'Noblesville'] },
  IA: { name: 'Iowa', cities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City', 'Waterloo', 'Ames', 'West Des Moines', 'Council Bluffs', 'Ankeny', 'Dubuque', 'Urbandale'] },
  KS: { name: 'Kansas', cities: ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka', 'Lawrence', 'Shawnee', 'Manhattan', 'Lenexa', 'Salina', 'Hutchinson'] },
  KY: { name: 'Kentucky', cities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington', 'Richmond', 'Georgetown', 'Florence', 'Hopkinsville', 'Nicholasville', 'Elizabethtown'] },
  LA: { name: 'Louisiana', cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Metairie', 'Lafayette', 'Lake Charles', 'Kenner', 'Bossier City', 'Monroe', 'Alexandria', 'Houma'] },
  ME: { name: 'Maine', cities: ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn', 'Biddeford', 'Sanford', 'Brunswick', 'Scarborough', 'Westbrook'] },
  MD: { name: 'Maryland', cities: ['Baltimore', 'Columbia', 'Germantown', 'Silver Spring', 'Waldorf', 'Glen Burnie', 'Ellicott City', 'Frederick', 'Dundalk', 'Rockville', 'Bethesda', 'Bowie', 'Towson', 'Annapolis', 'Hagerstown'] },
  MA: { name: 'Massachusetts', cities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton', 'New Bedford', 'Quincy', 'Lynn', 'Fall River', 'Newton', 'Somerville', 'Lawrence', 'Framingham'] },
  MI: { name: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn', 'Livonia', 'Troy', 'Westland', 'Farmington Hills', 'Kalamazoo', 'Wyoming'] },
  MN: { name: 'Minnesota', cities: ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington', 'Brooklyn Park', 'Plymouth', 'Maple Grove', 'Woodbury', 'St. Cloud', 'Eagan', 'Eden Prairie'] },
  MS: { name: 'Mississippi', cities: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi', 'Meridian', 'Tupelo', 'Greenville', 'Olive Branch', 'Horn Lake', 'Clinton', 'Pearl'] },
  MO: { name: 'Missouri', cities: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence', 'Lee\'s Summit', 'O\'Fallon', 'St. Joseph', 'St. Charles', 'Blue Springs', 'St. Peters', 'Florissant', 'Joplin'] },
  MT: { name: 'Montana', cities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte', 'Helena', 'Kalispell', 'Havre', 'Anaconda', 'Miles City'] },
  NE: { name: 'Nebraska', cities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney', 'Fremont', 'Hastings', 'Norfolk', 'North Platte', 'Columbus'] },
  NV: { name: 'Nevada', cities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City', 'Fernley', 'Elko', 'Mesquite', 'Boulder City'] },
  NH: { name: 'New Hampshire', cities: ['Manchester', 'Nashua', 'Concord', 'Derry', 'Dover', 'Rochester', 'Salem', 'Merrimack', 'Hudson', 'Londonderry'] },
  NJ: { name: 'New Jersey', cities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Lakewood', 'Edison', 'Woodbridge', 'Toms River', 'Hamilton', 'Trenton', 'Clifton', 'Camden', 'Brick', 'Cherry Hill', 'Passaic', 'Union City', 'Old Bridge', 'Middletown', 'Bayonne'] },
  NM: { name: 'New Mexico', cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell', 'Farmington', 'South Valley', 'Clovis', 'Hobbs', 'Alamogordo'] },
  NY: { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica', 'White Plains', 'Hempstead', 'Troy', 'Niagara Falls', 'Binghamton', 'Freeport', 'Long Beach'] },
  NC: { name: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Wilmington', 'High Point', 'Concord', 'Asheville', 'Greenville', 'Gastonia', 'Jacksonville', 'Chapel Hill', 'Huntersville'] },
  ND: { name: 'North Dakota', cities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo', 'Williston', 'Dickinson', 'Mandan', 'Jamestown', 'Wahpeton'] },
  OH: { name: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown', 'Lorain', 'Hamilton', 'Springfield', 'Kettering', 'Elyria', 'Lakewood'] },
  OK: { name: 'Oklahoma', cities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond', 'Lawton', 'Moore', 'Midwest City', 'Enid', 'Stillwater', 'Muskogee'] },
  OR: { name: 'Oregon', cities: ['Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro', 'Beaverton', 'Bend', 'Medford', 'Springfield', 'Corvallis', 'Albany', 'Tigard'] },
  PA: { name: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg', 'Altoona', 'York', 'State College', 'Wilkes-Barre', 'Erie', 'Chester'] },
  RI: { name: 'Rhode Island', cities: ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence', 'Woonsocket', 'Coventry', 'Cumberland', 'North Providence', 'South Kingstown'] },
  SC: { name: 'South Carolina', cities: ['Charleston', 'Columbia', 'North Charleston', 'Mount Pleasant', 'Rock Hill', 'Greenville', 'Summerville', 'Goose Creek', 'Hilton Head Island', 'Sumter', 'Florence', 'Spartanburg'] },
  SD: { name: 'South Dakota', cities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown', 'Mitchell', 'Yankton', 'Pierre', 'Huron', 'Vermillion'] },
  TN: { name: 'Tennessee', cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro', 'Franklin', 'Jackson', 'Johnson City', 'Bartlett', 'Hendersonville', 'Kingsport', 'Collierville'] },
  TX: { name: 'Texas', cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo', 'Lubbock', 'Garland', 'Irving', 'Frisco', 'McKinney', 'Amarillo', 'Grand Prairie', 'Brownsville', 'Killeen', 'Pasadena', 'McAllen', 'Midland', 'Denton', 'Round Rock'] },
  UT: { name: 'Utah', cities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem', 'Sandy', 'Ogden', 'St. George', 'Layton', 'South Jordan', 'Lehi', 'Millcreek'] },
  VT: { name: 'Vermont', cities: ['Burlington', 'South Burlington', 'Rutland', 'Essex Junction', 'Barre', 'Montpelier', 'Winooski', 'St. Albans', 'Newport', 'Bennington'] },
  VA: { name: 'Virginia', cities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News', 'Alexandria', 'Hampton', 'Roanoke', 'Portsmouth', 'Suffolk', 'Lynchburg', 'Harrisonburg', 'Leesburg', 'Charlottesville', 'Manassas', 'Petersburg', 'Fredericksburg', 'Winchester'] },
  WA: { name: 'Washington', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Renton', 'Federal Way', 'Spokane Valley', 'Kirkland', 'Bellingham', 'Auburn', 'Olympia', 'Redmond'] },
  DC: { name: 'Washington DC', cities: ['Washington'] },
  WV: { name: 'West Virginia', cities: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling', 'Weirton', 'Fairmont', 'Martinsburg', 'Beckley', 'Clarksburg'] },
  WI: { name: 'Wisconsin', cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton', 'Waukesha', 'Oshkosh', 'Eau Claire', 'Janesville', 'West Allis', 'La Crosse', 'Sheboygan', 'Wauwatosa'] },
  WY: { name: 'Wyoming', cities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs', 'Sheridan', 'Green River', 'Evanston', 'Riverton', 'Cody'] },
};

/** Get sorted state abbreviations */
export const US_STATE_LIST = Object.keys(US_STATES_WITH_CITIES).sort();

/** Get state full name */
export function getStateName(abbr: string): string {
  return US_STATES_WITH_CITIES[abbr]?.name || abbr;
}

/** Get cities for a state */
export function getCitiesForState(abbr: string): string[] {
  return US_STATES_WITH_CITIES[abbr]?.cities || [];
}

/** Get cities for multiple states */
export function getCitiesForStates(states: string[]): string[] {
  const cities: string[] = [];
  states.forEach(state => {
    cities.push(...getCitiesForState(state));
  });
  return cities;
}

// ─────────────────────────────────────────────────────────────────
// SEO KEYWORD GENERATORS
// ─────────────────────────────────────────────────────────────────

/** Generate all SEO keywords for a business based on their selections */
export function generateSeoKeywords(
  businessName: string,
  city: string,
  state: string,
  cuisineType?: string,
  services?: string[],
  storeCategories?: string[],
): string[] {
  const keywords = new Set<string>();
  const cuisine = CUISINE_TYPES.find(c => c.key === cuisineType);
  const stateName = getStateName(state);

  // Business name keywords
  keywords.add(businessName);
  keywords.add(`${businessName} ${city}`);
  keywords.add(`${businessName} ${city} ${state}`);
  keywords.add(`${businessName} menu`);
  keywords.add(`${businessName} delivery`);
  keywords.add(`order from ${businessName}`);

  // Location keywords
  keywords.add(`food delivery ${city}`);
  keywords.add(`restaurant ${city} ${state}`);
  keywords.add(`order food ${city}`);
  keywords.add(`${city} ${state} food`);
  keywords.add(`best food in ${city}`);
  keywords.add(`food near me ${city}`);
  keywords.add(`${city} ${stateName} restaurants`);

  // Cuisine keywords
  if (cuisine) {
    cuisine.keywords.forEach(kw => {
      keywords.add(kw);
      keywords.add(`${kw} ${city}`);
      keywords.add(`${kw} near me`);
      keywords.add(`best ${kw} ${city}`);
    });
    keywords.add(`${cuisine.label} food ${city}`);
    keywords.add(`${cuisine.label} restaurant ${city} ${state}`);
    keywords.add(`${cuisine.label} delivery ${city}`);
  }

  // Store category keywords
  if (storeCategories) {
    storeCategories.forEach(catKey => {
      const cat = STORE_CATEGORIES.find(c => c.key === catKey);
      if (cat) {
        cat.keywords.forEach(kw => {
          keywords.add(`${kw} ${city}`);
          keywords.add(`${kw} delivery`);
        });
      }
    });
  }

  return Array.from(keywords);
}
