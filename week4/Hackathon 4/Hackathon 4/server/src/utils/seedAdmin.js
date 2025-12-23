const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const seedAdminUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create SuperAdmin
    const superAdminExists = await User.findOne({ email: 'superadmin@streamvibe.com' });
    if (!superAdminExists) {
      const superAdmin = new User({
        name: 'Super Admin',
        email: 'superadmin@streamvibe.com',
        password: 'superadmin123',
        role: 'superadmin'
      });
      await superAdmin.save();
      console.log('SuperAdmin created: superadmin@streamvibe.com / superadmin123');
    }

    // Create Admin
    const adminExists = await User.findOne({ email: 'admin@streamvibe.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin User',
        email: 'admin@streamvibe.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin created: admin@streamvibe.com / admin123');
    }

    // Create Regular User
    const userExists = await User.findOne({ email: 'user@streamvibe.com' });
    if (!userExists) {
      const user = new User({
        name: 'Regular User',
        email: 'user@streamvibe.com',
        password: 'user123',
        role: 'user'
      });
      await user.save();
      console.log('User created: user@streamvibe.com / user123');
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedAdminUsers();