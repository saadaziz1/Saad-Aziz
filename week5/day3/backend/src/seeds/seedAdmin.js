require('dotenv').config();
const mongoose = require('mongoose');
const { hashPassword } = require('../utils/password');
const User = require('../models/user.model');
const connectDB = require('../config/db');

const seedAdmin = async () => {
  try {
    await connectDB();
    
    const existingAdmin = await User.findOne({ email: 'admin@teacommerce.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const passwordHash = await hashPassword('admin123');
    
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@teacommerce.com',
      passwordHash,
      role: 'superadmin'
    });

    console.log('Super admin created:', admin.email);
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();