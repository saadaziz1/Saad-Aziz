require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const connectDB = require('../config/db');

const sampleProducts = [
  {
    "name": "Ceylon Ginger Cinnamon Chai Tea",
    "slug": "ceylon-ginger-cinnamon-chai",
    "description": "A lovely warming Chai tea with ginger cinnamon flavours. Perfect blend of Ceylon black tea with aromatic spices.",
    "category": "Chai",
    "tags": ["organic", "spicy", "warming", "ceylon"],
    "basePrice": 24.99,
    "featuredImage": "https://res.cloudinary.com/example/image/upload/v1/chai-tea.jpg",
    "rating": 4.7,
    "totalRatingsCount": 89,
    "flavor": "Spicy & Sweet",
    "origin": "Sri Lanka",
    "caffeine": "Medium",
    "variants": [
      {"name": "50g", "priceDiff": 0, "stock": 25, "sku": "CHAI-50G-001", "isActive": true},
      {"name": "100g", "priceDiff": 5, "stock": 15, "sku": "CHAI-100G-001", "isActive": true},
      {"name": "170g", "priceDiff": 12, "stock": 8, "sku": "CHAI-170G-001", "isActive": true},
      {"name": "250g", "priceDiff": 20, "stock": 0, "sku": "CHAI-250G-001", "isActive": false},
      {"name": "1kg", "priceDiff": 85, "stock": 3, "sku": "CHAI-1KG-001", "isActive": true},
      {"name": "sampler", "priceDiff": -15, "stock": 50, "sku": "CHAI-SAMP-001", "isActive": true}
    ]
  },
  {
    "name": "Earl Grey Supreme",
    "slug": "earl-grey-supreme",
    "description": "Classic Earl Grey with bergamot oil, cornflower petals, and a hint of vanilla. A refined twist on the traditional blend.",
    "category": "Black teas",
    "tags": ["classic", "bergamot", "premium", "floral"],
    "basePrice": 28.50,
    "featuredImage": "https://res.cloudinary.com/example/image/upload/v1/earl-grey.jpg",
    "rating": 4.8,
    "totalRatingsCount": 156,
    "flavor": "Citrusy & Floral",
    "origin": "India & Sri Lanka",
    "caffeine": "High",
    "variants": [
      {"name": "50g", "priceDiff": 0, "stock": 40, "sku": "EARL-50G-001", "isActive": true},
      {"name": "100g", "priceDiff": 8, "stock": 22, "sku": "EARL-100G-001", "isActive": true},
      {"name": "170g", "priceDiff": 15, "stock": 12, "sku": "EARL-170G-001", "isActive": true},
      {"name": "250g", "priceDiff": 25, "stock": 6, "sku": "EARL-250G-001", "isActive": true},
      {"name": "1kg", "priceDiff": 95, "stock": 2, "sku": "EARL-1KG-001", "isActive": true},
      {"name": "sampler", "priceDiff": -12, "stock": 75, "sku": "EARL-SAMP-001", "isActive": true}
    ]
  },
  {
    "name": "Dragon Well Green Tea",
    "slug": "dragon-well-green-tea",
    "description": "Premium Chinese green tea with delicate, fresh taste. Hand-picked leaves from the West Lake region of Hangzhou.",
    "category": "Green teas",
    "tags": ["premium", "chinese", "delicate", "fresh"],
    "basePrice": 32.00,
    "featuredImage": "https://res.cloudinary.com/example/image/upload/v1/dragon-well.jpg",
    "rating": 4.6,
    "totalRatingsCount": 73,
    "flavor": "Fresh & Grassy",
    "origin": "China",
    "caffeine": "Low",
    "variants": [
      {"name": "50g", "priceDiff": 0, "stock": 18, "sku": "DRAG-50G-001", "isActive": true},
      {"name": "100g", "priceDiff": 10, "stock": 0, "sku": "DRAG-100G-001", "isActive": false},
      {"name": "170g", "priceDiff": 18, "stock": 5, "sku": "DRAG-170G-001", "isActive": true},
      {"name": "250g", "priceDiff": 30, "stock": 3, "sku": "DRAG-250G-001", "isActive": true},
      {"name": "1kg", "priceDiff": 120, "stock": 1, "sku": "DRAG-1KG-001", "isActive": true},
      {"name": "sampler", "priceDiff": -8, "stock": 35, "sku": "DRAG-SAMP-001", "isActive": true}
    ]
  },
  {
    "name": "Chamomile Dreams",
    "slug": "chamomile-dreams",
    "description": "Soothing caffeine-free herbal tea perfect for evening relaxation. Pure Egyptian chamomile flowers with honey notes.",
    "category": "Herbal teas",
    "tags": ["caffeine-free", "relaxing", "egyptian", "honey"],
    "basePrice": 19.95,
    "featuredImage": "https://res.cloudinary.com/example/image/upload/v1/chamomile.jpg",
    "rating": 4.9,
    "totalRatingsCount": 203,
    "flavor": "Floral & Honey",
    "origin": "Egypt",
    "caffeine": "None",
    "variants": [
      {"name": "50g", "priceDiff": 0, "stock": 60, "sku": "CHAM-50G-001", "isActive": true},
      {"name": "100g", "priceDiff": 6, "stock": 35, "sku": "CHAM-100G-001", "isActive": true},
      {"name": "170g", "priceDiff": 12, "stock": 20, "sku": "CHAM-170G-001", "isActive": true},
      {"name": "250g", "priceDiff": 18, "stock": 12, "sku": "CHAM-250G-001", "isActive": true},
      {"name": "1kg", "priceDiff": 65, "stock": 4, "sku": "CHAM-1KG-001", "isActive": true},
      {"name": "sampler", "priceDiff": -10, "stock": 100, "sku": "CHAM-SAMP-001", "isActive": true}
    ]
  },
  {
    "name": "Himalayan Silver Tips",
    "slug": "himalayan-silver-tips",
    "description": "Rare high-altitude white tea with subtle sweetness. Handpicked from organic gardens in the Himalayas at 6000ft elevation.",
    "category": "White teas",
    "tags": ["rare", "high-altitude", "organic", "premium"],
    "basePrice": 65.00,
    "featuredImage": "https://res.cloudinary.com/example/image/upload/v1/white-tea.jpg",
    "rating": 4.9,
    "totalRatingsCount": 42,
    "flavor": "Delicate & Sweet",
    "origin": "Nepal",
    "caffeine": "Very Low",
    "variants": [
      {"name": "50g", "priceDiff": 0, "stock": 8, "sku": "HIMA-50G-001", "isActive": true},
      {"name": "100g", "priceDiff": 15, "stock": 4, "sku": "HIMA-100G-001", "isActive": true},
      {"name": "170g", "priceDiff": 28, "stock": 0, "sku": "HIMA-170G-001", "isActive": false},
      {"name": "250g", "priceDiff": 45, "stock": 2, "sku": "HIMA-250G-001", "isActive": true},
      {"name": "1kg", "priceDiff": 180, "stock": 0, "sku": "HIMA-1KG-001", "isActive": false},
      {"name": "sampler", "priceDiff": -5, "stock": 25, "sku": "HIMA-SAMP-001", "isActive": true}
    ]
  },
  {
    "name": "Rooibos Vanilla Comfort",
    "slug": "rooibos-vanilla-comfort",
    "description": "South African red bush tea with natural vanilla notes. Caffeine-free with antioxidants and a naturally sweet taste.",
    "category": "Rooibos",
    "tags": ["caffeine-free", "vanilla", "antioxidants", "sweet"],
    "basePrice": 22.25,
    "featuredImage": "https://res.cloudinary.com/example/image/upload/v1/rooibos.jpg",
    "rating": 4.5,
    "totalRatingsCount": 118,
    "flavor": "Sweet & Creamy",
    "origin": "South Africa",
    "caffeine": "None",
    "variants": [
      {"name": "50g", "priceDiff": 0, "stock": 45, "sku": "ROOI-50G-001", "isActive": true},
      {"name": "100g", "priceDiff": 7, "stock": 28, "sku": "ROOI-100G-001", "isActive": true},
      {"name": "170g", "priceDiff": 14, "stock": 15, "sku": "ROOI-170G-001", "isActive": true},
      {"name": "250g", "priceDiff": 22, "stock": 8, "sku": "ROOI-250G-001", "isActive": true},
      {"name": "1kg", "priceDiff": 78, "stock": 3, "sku": "ROOI-1KG-001", "isActive": true},
      {"name": "sampler", "priceDiff": -12, "stock": 80, "sku": "ROOI-SAMP-001", "isActive": true}
    ]
  },
  {
    "name": "Jasmine Phoenix Pearls",
    "slug": "jasmine-phoenix-pearls",
    "description": "Hand-rolled green tea pearls scented with jasmine flowers. Each pearl unfurls to release delicate floral aromatics.",
    "category": "Green teas",
    "tags": ["hand-rolled", "jasmine", "premium", "floral"],
    "basePrice": 48.50,
    "featuredImage": "https://res.cloudinary.com/example/image/upload/v1/jasmine-pearls.jpg",
    "rating": 4.8,
    "totalRatingsCount": 67,
    "flavor": "Floral & Aromatic",
    "origin": "China",
    "caffeine": "Medium",
    "variants": [
      {"name": "50g", "priceDiff": 0, "stock": 12, "sku": "JASM-50G-001", "isActive": true},
      {"name": "100g", "priceDiff": 12, "stock": 6, "sku": "JASM-100G-001", "isActive": true},
      {"name": "170g", "priceDiff": 22, "stock": 3, "sku": "JASM-170G-001", "isActive": true},
      {"name": "250g", "priceDiff": 35, "stock": 0, "sku": "JASM-250G-001", "isActive": false},
      {"name": "1kg", "priceDiff": 140, "stock": 1, "sku": "JASM-1KG-001", "isActive": true},
      {"name": "sampler", "priceDiff": -5, "stock": 30, "sku": "JASM-SAMP-001", "isActive": true}
    ]
  },
  {
    "name": "Masala Chai Supreme",
    "slug": "masala-chai-supreme",
    "description": "Traditional Indian spice blend with cardamom, cloves, cinnamon, and black pepper. Authentic recipe from Kerala spice gardens.",
    "category": "Chai",
    "tags": ["traditional", "spices", "authentic", "kerala"],
    "basePrice": 26.85,
    "featuredImage": "https://res.cloudinary.com/example/image/upload/v1/masala-chai.jpg",
    "rating": 4.7,
    "totalRatingsCount": 134,
    "flavor": "Spicy & Bold",
    "origin": "India",
    "caffeine": "High",
    "variants": [
      {"name": "50g", "priceDiff": 0, "stock": 32, "sku": "MASA-50G-001", "isActive": true},
      {"name": "100g", "priceDiff": 8, "stock": 18, "sku": "MASA-100G-001", "isActive": true},
      {"name": "170g", "priceDiff": 16, "stock": 10, "sku": "MASA-170G-001", "isActive": true},
      {"name": "250g", "priceDiff": 26, "stock": 5, "sku": "MASA-250G-001", "isActive": true},
      {"name": "1kg", "priceDiff": 95, "stock": 2, "sku": "MASA-1KG-001", "isActive": true},
      {"name": "sampler", "priceDiff": -10, "stock": 65, "sku": "MASA-SAMP-001", "isActive": true}
    ]
  },
  {
    "name": "Ceremonial Grade Matcha",
    "slug": "ceremonial-grade-matcha",
    "description": "Premium ceremonial grade matcha from Uji, Japan. Stone-ground from shade-grown tencha leaves for traditional tea ceremony.",
    "category": "Matcha",
    "tags": ["ceremonial", "premium", "japanese", "stone-ground"],
    "basePrice": 85.00,
    "featuredImage": "https://res.cloudinary.com/example/image/upload/v1/matcha.jpg",
    "rating": 4.9,
    "totalRatingsCount": 89,
    "flavor": "Umami & Vegetal",
    "origin": "Japan",
    "caffeine": "High",
    "variants": [
      {"name": "50g", "priceDiff": 0, "stock": 15, "sku": "MATC-50G-001", "isActive": true},
      {"name": "100g", "priceDiff": 20, "stock": 8, "sku": "MATC-100G-001", "isActive": true},
      {"name": "170g", "priceDiff": 35, "stock": 0, "sku": "MATC-170G-001", "isActive": false},
      {"name": "250g", "priceDiff": 55, "stock": 3, "sku": "MATC-250G-001", "isActive": true},
      {"name": "1kg", "priceDiff": 220, "stock": 0, "sku": "MATC-1KG-001", "isActive": false},
      {"name": "sampler", "priceDiff": 5, "stock": 40, "sku": "MATC-SAMP-001", "isActive": true}
    ]
  },
  {
    "name": "Iron Goddess Oolong",
    "slug": "iron-goddess-oolong",
    "description": "Traditional Tie Guan Yin oolong with complex floral notes. Semi-oxidized tea with multiple infusion capability.",
    "category": "Oolong",
    "tags": ["traditional", "floral", "complex", "multiple-infusions"],
    "basePrice": 42.00,
    "featuredImage": "https://res.cloudinary.com/example/image/upload/v1/oolong.jpg",
    "rating": 4.6,
    "totalRatingsCount": 95,
    "flavor": "Floral & Complex",
    "origin": "China",
    "caffeine": "Medium",
    "variants": [
      {"name": "50g", "priceDiff": 0, "stock": 20, "sku": "IRON-50G-001", "isActive": true},
      {"name": "100g", "priceDiff": 10, "stock": 12, "sku": "IRON-100G-001", "isActive": true},
      {"name": "170g", "priceDiff": 20, "stock": 6, "sku": "IRON-170G-001", "isActive": true},
      {"name": "250g", "priceDiff": 32, "stock": 4, "sku": "IRON-250G-001", "isActive": true},
      {"name": "1kg", "priceDiff": 125, "stock": 1, "sku": "IRON-1KG-001", "isActive": true},
      {"name": "sampler", "priceDiff": -8, "stock": 45, "sku": "IRON-SAMP-001", "isActive": true}
    ]
  },
  {
    "name": "Bamboo Tea Infuser Set",
    "slug": "bamboo-tea-infuser-set",
    "description": "Sustainable bamboo tea infuser with matching cup and saucer. Perfect for loose leaf tea brewing with eco-friendly materials.",
    "category": "Teaware",
    "tags": ["sustainable", "bamboo", "eco-friendly", "infuser"],
    "basePrice": 35.99,
    "featuredImage": "https://res.cloudinary.com/example/image/upload/v1/teaware.jpg",
    "rating": 4.4,
    "totalRatingsCount": 76,
    "flavor": "N/A",
    "origin": "China",
    "caffeine": "N/A",
    "variants": [
      {"name": "50g", "priceDiff": 0, "stock": 0, "sku": "BAMB-SET-001", "isActive": false},
      {"name": "100g", "priceDiff": 0, "stock": 0, "sku": "BAMB-SET-002", "isActive": false},
      {"name": "170g", "priceDiff": 0, "stock": 0, "sku": "BAMB-SET-003", "isActive": false},
      {"name": "250g", "priceDiff": 0, "stock": 0, "sku": "BAMB-SET-004", "isActive": false},
      {"name": "1kg", "priceDiff": 0, "stock": 25, "sku": "BAMB-SET-005", "isActive": true},
      {"name": "sampler", "priceDiff": -20, "stock": 15, "sku": "BAMB-SAMP-001", "isActive": true}
    ]
  }
]

const seedProducts = async () => {
  try {
    await connectDB();
    
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    
    console.log('Sample products seeded successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();