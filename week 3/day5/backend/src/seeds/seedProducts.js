require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const connectDB = require('../config/db');

const sampleProducts = [
  {
    name: 'Earl Grey Tea',
    slug: 'earl-grey-tea',
    description: 'Classic Earl Grey tea with bergamot oil',
    category: 'Black Tea',
    tags: ['classic', 'bergamot', 'afternoon'],
    basePrice: 15.99,
    images: ['https://example.com/earl-grey.jpg'],
    variants: [
      {
        name: '50g Pack',
        priceDiff: 0,
        stock: 100,
        sku: 'EG-50G',
        isActive: true
      },
      {
        name: '100g Pack',
        priceDiff: 10,
        stock: 50,
        sku: 'EG-100G',
        isActive: true
      }
    ]
  },
  {
    name: 'Green Dragon Well',
    slug: 'green-dragon-well',
    description: 'Premium Chinese green tea with delicate flavor',
    category: 'Green Tea',
    tags: ['chinese', 'premium', 'delicate'],
    basePrice: 22.99,
    images: ['https://example.com/dragon-well.jpg'],
    variants: [
      {
        name: '50g Pack',
        priceDiff: 0,
        stock: 75,
        sku: 'GDW-50G',
        isActive: true
      },
      {
        name: '100g Pack',
        priceDiff: 15,
        stock: 30,
        sku: 'GDW-100G',
        isActive: true
      }
    ]
  }
];

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