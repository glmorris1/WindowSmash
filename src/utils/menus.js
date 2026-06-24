const MENU_TEMPLATES = {
  pizza: [
    { name: 'Margherita Smash', desc: 'Fresh mozzarella, basil, crushed tomato', base: 14.99 },
    { name: 'Pepperoni Window', desc: 'Double pepperoni, extra cheese', base: 16.49 },
    { name: 'Meat Lovers Pane', desc: 'Sausage, bacon, ham, pepperoni', base: 18.99 },
    { name: 'Garlic Knots (6)', desc: 'Butter, parmesan, marinara dip', base: 6.99 },
    { name: 'Caesar Side Salad', desc: 'Romaine, croutons, parmesan', base: 8.49 },
  ],
  chinese: [
    { name: 'Kung Pao Chicken', desc: 'Peanuts, chili, Szechuan pepper', base: 13.99 },
    { name: 'Beef & Broccoli', desc: 'Wok-tossed in brown garlic sauce', base: 14.49 },
    { name: 'Vegetable Fried Rice', desc: 'Egg, peas, carrots, soy', base: 10.99 },
    { name: 'Pork Dumplings (8)', desc: 'Steamed, ginger soy dip', base: 9.99 },
    { name: 'Hot & Sour Soup', desc: 'Tofu, mushrooms, vinegar kick', base: 5.49 },
  ],
  mexican: [
    { name: 'Carnitas Burrito', desc: 'Rice, beans, salsa verde, crema', base: 12.99 },
    { name: 'Chicken Tacos (3)', desc: 'Corn tortillas, onion, cilantro', base: 11.49 },
    { name: 'Queso Fundido', desc: 'Melted cheese, chorizo, tortillas', base: 9.99 },
    { name: 'Guacamole & Chips', desc: 'Fresh avo, lime, sea salt', base: 7.99 },
    { name: 'Horchata', desc: 'Cinnamon rice milk, iced', base: 4.49 },
  ],
  burger: [
    { name: 'Classic Smash Burger', desc: 'Double patty, american, pickles', base: 11.99 },
    { name: 'Bacon Avocado Burger', desc: 'Swiss, chipotle aioli', base: 14.49 },
    { name: 'Crispy Chicken Sandwich', desc: 'Slaw, pickles, brioche', base: 12.99 },
    { name: 'Truffle Fries', desc: 'Parmesan, herbs, truffle oil', base: 6.99 },
    { name: 'Chocolate Shake', desc: 'Thick, whipped cream', base: 5.99 },
  ],
  sushi: [
    { name: 'Salmon Nigiri (2)', desc: 'Fresh Atlantic salmon', base: 7.99 },
    { name: 'Spicy Tuna Roll', desc: '8 pieces, chili mayo', base: 12.99 },
    { name: 'Dragon Roll', desc: 'Eel, avocado, unagi sauce', base: 15.99 },
    { name: 'Edamame', desc: 'Sea salt, steamed', base: 5.49 },
    { name: 'Miso Soup', desc: 'Tofu, wakame, scallion', base: 3.99 },
  ],
  thai: [
    { name: 'Pad Thai', desc: 'Shrimp, peanuts, tamarind', base: 13.99 },
    { name: 'Green Curry', desc: 'Chicken, bamboo, basil, jasmine rice', base: 14.49 },
    { name: 'Tom Yum Soup', desc: 'Spicy lemongrass broth', base: 6.99 },
    { name: 'Spring Rolls (4)', desc: 'Crispy veggie, sweet chili', base: 7.49 },
    { name: 'Mango Sticky Rice', desc: 'Coconut cream, toasted sesame', base: 6.99 },
  ],
  indian: [
    { name: 'Butter Chicken', desc: 'Creamy tomato, basmati rice', base: 15.99 },
    { name: 'Chicken Tikka Masala', desc: 'Spiced yogurt marinade', base: 15.49 },
    { name: 'Garlic Naan (2)', desc: 'Tandoor baked', base: 4.99 },
    { name: 'Samosas (3)', desc: 'Potato, pea, mint chutney', base: 6.99 },
    { name: 'Mango Lassi', desc: 'Yogurt, cardamom', base: 4.49 },
  ],
  default: [
    { name: 'House Special', desc: 'Chef\'s signature plate', base: 14.99 },
    { name: 'Grilled Chicken Bowl', desc: 'Seasonal veggies, grains', base: 13.49 },
    { name: 'Crispy Appetizer', desc: 'Shareable starter', base: 8.99 },
    { name: 'Garden Salad', desc: 'Mixed greens, vinaigrette', base: 9.49 },
    { name: 'Seasonal Dessert', desc: 'Made fresh daily', base: 6.99 },
    { name: 'Fountain Drink', desc: 'Refills on us (virtually)', base: 2.99 },
  ],
}

const TYPE_MAP = [
  ['pizza', ['pizza', 'pizza_restaurant']],
  ['chinese', ['chinese', 'chinese_restaurant']],
  ['mexican', ['mexican', 'mexican_restaurant', 'taco']],
  ['burger', ['hamburger', 'burger', 'fast_food', 'american_restaurant']],
  ['sushi', ['sushi', 'japanese_restaurant', 'japanese']],
  ['thai', ['thai', 'thai_restaurant']],
  ['indian', ['indian', 'indian_restaurant']],
]

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i)
  return Math.abs(h)
}

function detectCuisine(types = [], name = '') {
  const blob = [...types, name].join(' ').toLowerCase()
  for (const [key, keywords] of TYPE_MAP) {
    if (keywords.some((k) => blob.includes(k))) return key
  }
  return 'default'
}

export function generateMenu(restaurant) {
  const cuisine = detectCuisine(restaurant.types, restaurant.name)
  const template = MENU_TEMPLATES[cuisine] || MENU_TEMPLATES.default
  const seed = hash(restaurant.id)

  return template.map((item, i) => {
    const priceJitter = ((seed + i * 17) % 7) * 0.5
    const price = Math.round((item.base + priceJitter) * 100) / 100
    return {
      id: `${restaurant.id}-item-${i}`,
      name: item.name,
      description: item.desc,
      price,
      image: cuisineImages[cuisine][i % cuisineImages[cuisine].length],
    }
  })
}

const cuisineImages = {
  pizza: ['🍕', '🧀', '🍅'],
  chinese: ['🥡', '🍜', '🥢'],
  mexican: ['🌮', '🌯', '🥑'],
  burger: ['🍔', '🍟', '🥤'],
  sushi: ['🍣', '🍱', '🥢'],
  thai: ['🍛', '🌶️', '🥥'],
  indian: ['🍛', '🫓', '🥭'],
  default: ['🍽️', '🥗', '🍲'],
}