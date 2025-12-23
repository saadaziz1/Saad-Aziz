const mongoose = require('mongoose');
const Plan = require('../models/Plan');
require('dotenv').config();

const defaultPlans = [
  {
    name: 'Basic Plan',
    price: 9.99,
    duration: 30, // 30 days
    features: [
      'Access to wide selection of movies and shows',
      'Limited to 720p resolution',
      'Watch on 1 device at a time'
    ],
    isActive: true
  },
  {
    name: 'Standard Plan',
    price: 12.99,
    duration: 30,
    features: [
      'Access to wider selection of movies and shows',
      'Watch in Full HD (1080p)',
      'Watch on 2 devices at a time'
    ],
    isActive: true
  },
  {
    name: 'Premium Plan',
    price: 14.99,
    duration: 30,
    features: [
      'Access to widest selection of movies and shows',
      'Watch in Ultra HD (4K) + HDR',
      'Watch on 4 devices at a time'
    ],
    isActive: true
  }
];

const seedPlans = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing plans
    await Plan.deleteMany({});
    console.log('Cleared existing plans');

    // Insert default plans
    await Plan.insertMany(defaultPlans);
    console.log('Default plans created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding plans:', error);
    process.exit(1);
  }
};

seedPlans();