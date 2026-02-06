/**
 * Starter Menu Templates
 *
 * When an owner completes onboarding, we auto-seed their menu with
 * realistic items based on their business type so they can start
 * taking orders immediately. They can edit/delete/add items later.
 */

export interface StarterMenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

const RESTAURANT_GENERIC: StarterMenuItem[] = [
  { name: 'Classic Burger', description: 'Angus beef patty, lettuce, tomato, pickles, house sauce', price: 12.99, category: 'Entrees' },
  { name: 'Grilled Chicken Sandwich', description: 'Herb-marinated chicken breast, arugula, aioli', price: 11.99, category: 'Entrees' },
  { name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, house caesar dressing', price: 9.99, category: 'Salads' },
  { name: 'French Fries', description: 'Hand-cut, seasoned, served with ketchup', price: 4.99, category: 'Sides' },
  { name: 'Onion Rings', description: 'Beer-battered, golden fried, ranch dipping sauce', price: 5.99, category: 'Sides' },
  { name: 'Mozzarella Sticks', description: 'Breaded mozzarella, marinara sauce', price: 7.99, category: 'Appetizers' },
  { name: 'Wings (6pc)', description: 'Choose: Buffalo, BBQ, Garlic Parmesan, or Plain', price: 9.99, category: 'Appetizers' },
  { name: 'Fish & Chips', description: 'Beer-battered cod, fries, tartar sauce, coleslaw', price: 14.99, category: 'Entrees' },
  { name: 'Milkshake', description: 'Vanilla, Chocolate, or Strawberry', price: 5.99, category: 'Drinks' },
  { name: 'Soft Drink', description: 'Coke, Diet Coke, Sprite, Dr Pepper', price: 2.49, category: 'Drinks' },
];

const CHINESE_RESTAURANT: StarterMenuItem[] = [
  { name: 'General Tso\'s Chicken', description: 'Crispy chicken in sweet & spicy sauce with broccoli', price: 13.99, category: 'Entrees' },
  { name: 'Beef & Broccoli', description: 'Tender sliced beef stir-fried with fresh broccoli', price: 14.99, category: 'Entrees' },
  { name: 'Sesame Chicken', description: 'Crispy chicken tossed in sesame glaze', price: 12.99, category: 'Entrees' },
  { name: 'Shrimp Lo Mein', description: 'Jumbo shrimp with soft egg noodles and vegetables', price: 13.99, category: 'Noodles & Rice' },
  { name: 'Chicken Fried Rice', description: 'Day-old rice wok-tossed with egg, chicken, vegetables', price: 10.99, category: 'Noodles & Rice' },
  { name: 'Egg Rolls (2pc)', description: 'Crispy pork & vegetable egg rolls with duck sauce', price: 4.99, category: 'Appetizers' },
  { name: 'Crab Rangoon (6pc)', description: 'Cream cheese & imitation crab in wonton wrappers', price: 6.99, category: 'Appetizers' },
  { name: 'Hot & Sour Soup', description: 'Traditional spicy & tangy soup with tofu and mushroom', price: 5.99, category: 'Soups' },
  { name: 'Wonton Soup', description: 'Pork wontons in clear chicken broth', price: 5.99, category: 'Soups' },
  { name: 'Sweet & Sour Pork', description: 'Crispy pork with pineapple, peppers in sweet & sour sauce', price: 12.99, category: 'Entrees' },
  { name: 'Kung Pao Chicken', description: 'Diced chicken with peanuts, peppers, zucchini in spicy sauce', price: 13.99, category: 'Entrees' },
  { name: 'Vegetable Stir-Fry', description: 'Mixed seasonal vegetables in garlic sauce', price: 10.99, category: 'Entrees' },
];

const PIZZA_SHOP: StarterMenuItem[] = [
  { name: 'Cheese Pizza (Large)', description: 'Hand-tossed dough, house marinara, 100% mozzarella', price: 14.99, category: 'Pizzas' },
  { name: 'Pepperoni Pizza (Large)', description: 'Classic pepperoni with mozzarella and marinara', price: 16.99, category: 'Pizzas' },
  { name: 'Supreme Pizza (Large)', description: 'Pepperoni, sausage, peppers, onions, mushrooms, olives', price: 18.99, category: 'Pizzas' },
  { name: 'Margherita Pizza (Large)', description: 'Fresh mozzarella, tomato, basil, olive oil', price: 15.99, category: 'Pizzas' },
  { name: 'BBQ Chicken Pizza (Large)', description: 'Grilled chicken, BBQ sauce, red onion, cilantro', price: 17.99, category: 'Pizzas' },
  { name: 'Garlic Bread', description: 'Toasted Italian bread with garlic butter and herbs', price: 4.99, category: 'Sides' },
  { name: 'Buffalo Wings (8pc)', description: 'Crispy wings tossed in buffalo sauce, blue cheese dip', price: 10.99, category: 'Sides' },
  { name: 'Caesar Salad', description: 'Romaine, croutons, parmesan, caesar dressing', price: 7.99, category: 'Salads' },
  { name: 'Cannoli (2pc)', description: 'Ricotta-filled pastry shells, chocolate chips', price: 6.99, category: 'Desserts' },
  { name: '2-Liter Soda', description: 'Coke, Diet Coke, Sprite, or Fanta', price: 3.49, category: 'Drinks' },
];

const MEXICAN_RESTAURANT: StarterMenuItem[] = [
  { name: 'Burrito Bowl', description: 'Rice, beans, choice of protein, salsa, cheese, sour cream, guacamole', price: 12.99, category: 'Bowls' },
  { name: 'Street Tacos (3pc)', description: 'Corn tortillas, onion, cilantro, choice of meat', price: 10.99, category: 'Tacos' },
  { name: 'Quesadilla', description: 'Flour tortilla, melted cheese, choice of protein', price: 10.99, category: 'Entrees' },
  { name: 'Chicken Enchiladas (3pc)', description: 'Corn tortillas, chicken, red sauce, cheese, rice & beans', price: 13.99, category: 'Entrees' },
  { name: 'Chips & Guacamole', description: 'Fresh-made guacamole with warm tortilla chips', price: 7.99, category: 'Appetizers' },
  { name: 'Chips & Salsa', description: 'House-made salsa with warm tortilla chips', price: 4.99, category: 'Appetizers' },
  { name: 'Nachos Supreme', description: 'Loaded nachos with meat, cheese, beans, jalapeños, sour cream', price: 11.99, category: 'Appetizers' },
  { name: 'Churros (3pc)', description: 'Cinnamon sugar churros with chocolate dipping sauce', price: 5.99, category: 'Desserts' },
  { name: 'Horchata', description: 'Traditional rice drink with cinnamon', price: 3.99, category: 'Drinks' },
  { name: 'Mexican Coca-Cola', description: 'Classic Coke made with real cane sugar', price: 2.99, category: 'Drinks' },
];

const BAKERY_CAFE: StarterMenuItem[] = [
  { name: 'Drip Coffee', description: 'House blend, 12 oz', price: 2.99, category: 'Coffee' },
  { name: 'Latte', description: 'Espresso with steamed milk, 16 oz', price: 4.99, category: 'Coffee' },
  { name: 'Cappuccino', description: 'Espresso, steamed milk, foam', price: 4.49, category: 'Coffee' },
  { name: 'Croissant', description: 'Buttery French croissant, baked fresh daily', price: 3.49, category: 'Pastries' },
  { name: 'Blueberry Muffin', description: 'Made with fresh blueberries', price: 3.99, category: 'Pastries' },
  { name: 'Cinnamon Roll', description: 'Warm cinnamon roll with cream cheese glaze', price: 4.49, category: 'Pastries' },
  { name: 'Avocado Toast', description: 'Sourdough, smashed avocado, everything seasoning, egg', price: 9.99, category: 'Breakfast' },
  { name: 'Turkey Club Sandwich', description: 'Turkey, bacon, lettuce, tomato, mayo on sourdough', price: 10.99, category: 'Sandwiches' },
  { name: 'Chocolate Chip Cookie', description: 'Fresh-baked, gooey center', price: 2.49, category: 'Pastries' },
  { name: 'Iced Tea', description: 'Sweetened or unsweetened, 20 oz', price: 2.99, category: 'Drinks' },
];

const CONVENIENCE_STORE: StarterMenuItem[] = [
  { name: 'Water Bottle (16 oz)', description: 'Purified drinking water', price: 1.49, category: 'Beverages' },
  { name: 'Energy Drink', description: 'Red Bull, Monster, or Celsius', price: 3.49, category: 'Beverages' },
  { name: 'Soda (20 oz)', description: 'Coke, Pepsi, Sprite, or Mountain Dew', price: 2.29, category: 'Beverages' },
  { name: 'Chips (Bag)', description: 'Lays, Doritos, Cheetos, or Ruffles', price: 2.49, category: 'Snacks' },
  { name: 'Candy Bar', description: 'Snickers, Reese\'s, Kit Kat, or M&M\'s', price: 1.99, category: 'Snacks' },
  { name: 'Cigarettes (Pack)', description: 'Various brands available', price: 8.99, category: 'Tobacco' },
  { name: 'Phone Charger Cable', description: 'USB-C or Lightning cable', price: 9.99, category: 'Essentials' },
  { name: 'Pain Reliever', description: 'Tylenol or Advil travel pack', price: 3.99, category: 'Essentials' },
  { name: 'Beef Jerky', description: 'Jack Link\'s Original, 2.85 oz', price: 5.99, category: 'Snacks' },
  { name: 'Coffee (Hot, 16 oz)', description: 'Fresh-brewed house coffee', price: 1.99, category: 'Beverages' },
];

const GROCERY_STORE: StarterMenuItem[] = [
  { name: 'Dozen Eggs', description: 'Grade A large eggs', price: 3.99, category: 'Dairy & Eggs' },
  { name: 'Gallon of Milk', description: 'Whole, 2%, or Skim', price: 4.49, category: 'Dairy & Eggs' },
  { name: 'Bread Loaf', description: 'White or wheat sliced bread', price: 3.29, category: 'Bakery' },
  { name: 'Bananas (1 lb)', description: 'Fresh yellow bananas', price: 0.69, category: 'Produce' },
  { name: 'Ground Beef (1 lb)', description: '80/20 ground chuck', price: 5.99, category: 'Meat' },
  { name: 'Chicken Breast (1 lb)', description: 'Boneless, skinless', price: 4.99, category: 'Meat' },
  { name: 'Rice (2 lb bag)', description: 'Long grain white rice', price: 3.49, category: 'Pantry' },
  { name: 'Butter (1 stick)', description: 'Salted or unsalted', price: 2.99, category: 'Dairy & Eggs' },
  { name: 'Bottled Water (24pk)', description: 'Purified drinking water', price: 4.99, category: 'Beverages' },
  { name: 'Paper Towels (2 roll)', description: 'Select-a-size rolls', price: 3.99, category: 'Household' },
];

const FOOD_TRUCK: StarterMenuItem[] = [
  { name: 'Signature Burger', description: 'Smash patty, American cheese, pickles, special sauce', price: 10.99, category: 'Mains' },
  { name: 'Loaded Fries', description: 'Fries topped with cheese, bacon, jalapeños, sour cream', price: 8.99, category: 'Mains' },
  { name: 'Fish Tacos (2pc)', description: 'Beer-battered fish, cabbage slaw, chipotle crema', price: 9.99, category: 'Mains' },
  { name: 'Mac & Cheese', description: 'Creamy three-cheese mac, bread crumb topping', price: 7.99, category: 'Sides' },
  { name: 'Coleslaw', description: 'Creamy house-made coleslaw', price: 3.99, category: 'Sides' },
  { name: 'Bottled Water', description: 'Purified, 16 oz', price: 1.99, category: 'Drinks' },
  { name: 'Lemonade', description: 'Fresh-squeezed lemonade', price: 3.99, category: 'Drinks' },
  { name: 'Brownie', description: 'Rich chocolate fudge brownie', price: 3.99, category: 'Desserts' },
];

const BAR_GRILL: StarterMenuItem[] = [
  { name: 'Bar Burger', description: 'Half-pound beef patty, cheddar, bacon, onion rings, BBQ sauce', price: 14.99, category: 'Entrees' },
  { name: 'Crispy Chicken Tenders', description: 'Hand-breaded tenders, fries, honey mustard', price: 11.99, category: 'Entrees' },
  { name: 'Pulled Pork Sandwich', description: 'Slow-smoked pork, coleslaw, pickles, brioche bun', price: 12.99, category: 'Entrees' },
  { name: 'Loaded Nachos', description: 'Queso, ground beef, jalapeños, pico, sour cream', price: 10.99, category: 'Appetizers' },
  { name: 'Fried Pickles', description: 'Pickle chips, beer batter, ranch dip', price: 7.99, category: 'Appetizers' },
  { name: 'Soft Pretzel & Beer Cheese', description: 'Warm pretzel, house beer cheese dip', price: 8.99, category: 'Appetizers' },
  { name: 'House Salad', description: 'Mixed greens, tomato, cucumber, croutons, choice of dressing', price: 7.99, category: 'Salads' },
  { name: 'French Fries', description: 'Crispy seasoned fries', price: 4.99, category: 'Sides' },
  { name: 'Soft Drink', description: 'Coke, Diet Coke, Sprite, or Ginger Ale', price: 2.49, category: 'Drinks' },
  { name: 'Sweet Tea', description: 'Southern-style sweet iced tea', price: 2.99, category: 'Drinks' },
];

/**
 * Returns the starter menu items for a given business type.
 * Falls back to the generic restaurant menu if no match is found.
 */
export function getStarterMenu(businessType: string): StarterMenuItem[] {
  switch (businessType) {
    case 'chinese_restaurant':
      return CHINESE_RESTAURANT;
    case 'pizza':
      return PIZZA_SHOP;
    case 'mexican':
      return MEXICAN_RESTAURANT;
    case 'bakery':
      return BAKERY_CAFE;
    case 'convenience_store':
      return CONVENIENCE_STORE;
    case 'grocery':
      return GROCERY_STORE;
    case 'food_truck':
      return FOOD_TRUCK;
    case 'bar_grill':
      return BAR_GRILL;
    case 'restaurant':
    default:
      return RESTAURANT_GENERIC;
  }
}
