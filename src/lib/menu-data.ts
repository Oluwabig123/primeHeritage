import { MenuItem, CateringPackage } from '@/types';

export const MENU_ITEMS: MenuItem[] = [
  // 1. RICE & COMBOS
  {
    id: 'ph-jollof-combo',
    name: 'Smoky Party Jollof Combo',
    description:
      'Authentic firewood-infused smoky party Jollof rice, served with tender grilled quarter chicken, sweet fried plantain (dodo), and spicy pepper sauce.',
    price: 4500,
    category: 'rice_combos',
    imageUrl:
      'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    modifierGroups: [
      {
        id: 'protein_choice',
        title: 'Choice of Protein',
        required: true,
        options: [
          { id: 'chicken', name: 'Jumbo Grilled Chicken (Quarter)', priceDelta: 0 },
          { id: 'turkey', name: 'Peppered Turkey (+₦1,500)', priceDelta: 1500 },
          { id: 'catfish', name: 'Grilled Croaker/Catfish (+₦2,000)', priceDelta: 2000 },
          { id: 'beef_suya', name: 'Prime Spicy Beef Suya (+₦1,200)', priceDelta: 1200 },
        ],
      },
      {
        id: 'extras',
        title: 'Delicious Add-ons',
        required: false,
        options: [
          { id: 'extra_dodo', name: 'Extra Fried Plantain (Dodo)', priceDelta: 800 },
          { id: 'coleslaw', name: 'Creamy Heritage Coleslaw', priceDelta: 600 },
          { id: 'moi_moi', name: 'Steamed Egg & Fish Moi-Moi', priceDelta: 900 },
        ],
      },
    ],
  },
  {
    id: 'ph-fried-rice-combo',
    name: 'Special Heritage Fried Rice & Turkey',
    description:
      'Fragrant wok-tossed fried rice infused with sweet corn, carrots, liver chunks, and aromatic herbs, served with large golden peppered turkey.',
    price: 6000,
    category: 'rice_combos',
    imageUrl:
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    modifierGroups: [
      {
        id: 'protein_choice',
        title: 'Choice of Protein',
        required: true,
        options: [
          { id: 'turkey', name: 'Large Peppered Turkey', priceDelta: 0 },
          { id: 'chicken', name: 'Jumbo Fried Chicken (-₦500)', priceDelta: -500 },
          { id: 'asun', name: 'Peppered Goat Meat / Asun (+₦1,000)', priceDelta: 1000 },
        ],
      },
      {
        id: 'extras',
        title: 'Delicious Add-ons',
        required: false,
        options: [
          { id: 'extra_dodo', name: 'Extra Fried Plantain (Dodo)', priceDelta: 800 },
          { id: 'coleslaw', name: 'Creamy Heritage Coleslaw', priceDelta: 600 },
        ],
      },
    ],
  },
  {
    id: 'ph-ofada-rice-delight',
    name: 'Special Ofada Rice & Designer Ayamase Stew',
    description:
      'Traditional unpolished Ofada rice wrapped in banana leaf, served with rich bleaching palm oil green pepper stew, assorted beef chunks, and boiled egg.',
    price: 5500,
    category: 'rice_combos',
    imageUrl:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    modifierGroups: [
      {
        id: 'extras',
        title: 'Extras',
        required: false,
        options: [
          { id: 'extra_egg', name: 'Extra Boiled Egg', priceDelta: 400 },
          { id: 'extra_dodo', name: 'Sweet Fried Plantain', priceDelta: 800 },
        ],
      },
    ],
  },

  // 2. GRILLS & ASUN
  {
    id: 'ph-peppered-asun',
    name: 'Signature Peppered Asun Platter',
    description:
      'Slow-smoked tender diced goat meat tossed in habanero scotch bonnet peppers, onions, and indigenous spices. Fiery and intensely flavorful.',
    price: 5000,
    category: 'grills',
    imageUrl:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    modifierGroups: [
      {
        id: 'spice_level',
        title: 'Spice Preference',
        required: true,
        options: [
          { id: 'hot', name: 'Standard Fiery Pepper (Original Asun)', priceDelta: 0 },
          { id: 'medium', name: 'Mild Heat (Less Pepper)', priceDelta: 0 },
          { id: 'extra_hot', name: 'Extra Hot (Suicide Pepper)', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'ph-grilled-catfish-point',
    name: 'Barbecue Point & Kill Catfish',
    description:
      'Whole fresh charcoal-grilled catfish coated in aromatic spicy pepper glaze, served with seasoned roasted potatoes or fried yam chips.',
    price: 8500,
    category: 'grills',
    imageUrl:
      'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'ph-beef-suya-deluxe',
    name: 'Prime Heritage Beef Suya (Large Wrap)',
    description:
      'Thinly sliced skewered beef grilled over glowing coals, dusted with authentic Yaji spice blend, served with fresh red onions and cabbage.',
    price: 3500,
    category: 'grills',
    imageUrl:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
  },

  // 3. FAST BITES & CHOPS
  {
    id: 'ph-shawarma-supreme',
    name: 'Double Sausage Chicken Shawarma',
    description:
      'Juicy shredded chicken breast, two jumbo grilled sausages, crunchy cabbage, and creamy signature garlic-mayo sauce wrapped in toasted flatbread.',
    price: 3800,
    category: 'fast_bites',
    imageUrl:
      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    modifierGroups: [
      {
        id: 'extras',
        title: 'Add-ons',
        required: false,
        options: [
          { id: 'extra_cheese', name: 'Melted Mozzarella Cheese', priceDelta: 800 },
          { id: 'extra_sausage', name: 'Extra Grilled Sausage', priceDelta: 600 },
        ],
      },
    ],
  },
  {
    id: 'ph-small-chops-box',
    name: 'Deluxe Small Chops Finger Food Box',
    description:
      'Crispy Spring Rolls (3 pcs), Beef Samosas (3 pcs), Golden Puff-Puff (6 pcs), and Spicy Peppered Gizzard skewers (2 pcs).',
    price: 4000,
    category: 'fast_bites',
    imageUrl:
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'ph-crispy-wings-chips',
    name: 'Crispy Peppered Wings & French Fries',
    description:
      '6 pieces of golden seasoned chicken wings tossed in sweet-chili pepper sauce, served with salted golden French fries and dipping mayo.',
    price: 4800,
    category: 'fast_bites',
    imageUrl:
      'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isAvailable: true,
  },

  // 4. DRINKS & REFRESHMENTS
  {
    id: 'ph-chapman-special',
    name: 'Signature Chilled Chapman (750ml)',
    description:
      'The classic Nigerian party cocktail blend with Fanta, Sprite, Angostura bitters, grenadine, cucumber slices, and lemon wedges. Non-alcoholic.',
    price: 2200,
    category: 'drinks',
    imageUrl:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'ph-zobo-supreme',
    name: 'Fresh Hibiscus Zobo Infusion (500ml)',
    description:
      'Natural hibiscus leaves brewed with crushed fresh ginger, pineapple puree, cloves, and date fruit sweetener. Served icy cold.',
    price: 1500,
    category: 'drinks',
    imageUrl:
      'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'ph-fresh-smoothie',
    name: 'Tropical Mango-Pineapple Smoothie',
    description:
      '100% real fruit blend of sweet mango, pineapple, and banana with a dash of Greek yogurt.',
    price: 2500,
    category: 'drinks',
    imageUrl:
      'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isAvailable: true,
  },
];

export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: 'mini-heritage-box',
    name: 'Mini Heritage Party Box',
    tagline: 'Ideal for intimate birthday parties, family gatherings & office lunches',
    minGuests: 15,
    pricePerGuest: 4200, // ₦4,200 per guest
    imageUrl:
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Packaged luxury food boxes with handles',
      'Choice of Smoky Jollof or Special Fried Rice',
      'Quarter Grilled Chicken or Peppered Turkey',
      'Fried Plantain + Coleslaw in separate cups',
      'Chilled Chapman or Zobo drink bottle',
      'Cutlery pack and refreshing wipe included',
    ],
  },
  {
    id: 'celebration-buffet-trays',
    name: 'Celebration Feast & Party Trays',
    tagline: 'Perfect for naming ceremonies, housewarmings, anniversaries & weddings',
    minGuests: 30,
    pricePerGuest: 6500, // ₦6,500 per guest
    imageUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Hot chafing dish food warmer presentation',
      'Dual Rice Station: Party Jollof & Special Fried Rice',
      'Protein Assortment: Peppered Turkey, Jumbo Chicken & Asun',
      'Small Chops station (Samosa, Spring rolls, Puff-Puff)',
      'Side Delights: Dodo, Salad/Coleslaw, and Moi-Moi',
      'Dedicated food service attendants available',
    ],
  },
  {
    id: 'grand-event-buffet',
    name: 'Grand Executive Gala Banquet',
    tagline: 'Full-service catering for corporate events, grand weddings & banquets',
    minGuests: 100,
    pricePerGuest: 9800, // ₦9,800 per guest
    imageUrl:
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Premium 3-course catering with uniformed banquet staff',
      'Live Charcoal Barbecue Grill Station (Fish, Suya & Asun)',
      'Gourmet Rice Bar: Smoky Jollof, Basmati Fried Rice, Ofada Bar',
      'Executive Small Chops & Finger Foods on arrival',
      'Signature Mocktail Bar with custom drinks & chilled wines',
      'Full setup, porcelain dinnerware, and clearing service',
    ],
  },
];
