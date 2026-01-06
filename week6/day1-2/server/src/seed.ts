import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env
dotenv.config({ path: resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopco';

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    pointsPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
    type: { type: String },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    dressStyle: { type: String, required: true },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    isOnSale: { type: Boolean, default: false },
    isPointsOnly: { type: Boolean, default: false },
    isHybrid: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' },
    loyaltyPoints: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
});

const Product = mongoose.model('Product', ProductSchema);
const User = mongoose.model('User', UserSchema);

const products = [
    {
        name: 'T-SHIRT WITH TAPE DETAILS',
        description: 'A stylish t-shirt with unique tape details on the sleeves.',
        price: 120,
        stock: 50,
        category: 'mens-clothing',
        type: 't-shirts',
        colors: ['White', 'Black', 'Blue'],
        sizes: ['small', 'medium', 'large'],
        dressStyle: 'casual',
        images: ['/images/pic1.png'],
        rating: 4.5,
        discountPercentage: 0,
        isOnSale: false,
    },
    {
        name: 'SKINNY FIT JEANS',
        description: 'Classic skinny fit jeans for a modern look.',
        price: 240,
        stock: 30,
        category: 'mens-clothing',
        type: 'jeans',
        colors: ['Blue', 'Black'],
        sizes: ['medium', 'large', 'x-large'],
        dressStyle: 'casual',
        images: ['/images/pic2.png'],
        rating: 4.8,
        discountPercentage: 20,
        isOnSale: true,
    },
    {
        name: 'CHECKERED SHIRT',
        description: 'A comfortable checkered shirt perfect for casual outings.',
        price: 180,
        stock: 40,
        category: 'mens-clothing',
        type: 'shirts',
        colors: ['Red', 'Blue', 'Green'],
        sizes: ['small', 'medium', 'large'],
        dressStyle: 'casual',
        images: ['/images/pic3.png'],
        rating: 4.2,
        discountPercentage: 0,
        isOnSale: false,
    },
    {
        name: 'SLEEVE STRIPED T-SHIRT',
        description: 'Striped t-shirt with long sleeves.',
        price: 130,
        stock: 60,
        category: 'mens-clothing',
        type: 't-shirts',
        colors: ['Orange', 'White'],
        sizes: ['medium', 'large'],
        dressStyle: 'casual',
        images: ['/images/pic4.png'],
        rating: 4.0,
        discountPercentage: 30,
        isOnSale: true,
    },
    {
        name: 'VERTICAL STRIPED SHIRT',
        description: 'Elegant vertical striped shirt.',
        price: 212,
        stock: 25,
        category: 'mens-clothing',
        type: 'shirts',
        colors: ['White', 'Blue'],
        sizes: ['small', 'medium', 'large', 'x-large'],
        dressStyle: 'formal',
        images: ['/images/pic11.png'],
        rating: 5.0,
        discountPercentage: 20,
        isOnSale: true,
    },
    {
        name: 'COURAGE GRAPHIC T-SHIRT',
        description: 'Graphic t-shirt with "Courage" print.',
        price: 145,
        stock: 100,
        category: 'womens-clothing',
        type: 't-shirts',
        colors: ['Black', 'White', 'Pink'],
        sizes: ['x-small', 'small', 'medium'],
        dressStyle: 'party',
        images: ['/images/pic12.png'],
        rating: 4.0,
        discountPercentage: 0,
        isOnSale: false,
    },
    {
        name: 'LOOSE FIT BERMUDA SHORTS',
        description: 'Comfortable loose fit bermuda shorts.',
        price: 80,
        stock: 15,
        category: 'mens-clothing',
        type: 'shorts',
        colors: ['Grey', 'Blue'],
        sizes: ['medium', 'large'],
        dressStyle: 'gym',
        images: ['/images/pic13.png'],
        rating: 3.5,
        discountPercentage: 0,
        isOnSale: false,
    },
    {
        name: 'FADED SKINNY JEANS',
        description: 'Modern faded skinny jeans.',
        price: 210,
        stock: 20,
        category: 'womens-clothing',
        type: 'jeans',
        colors: ['Black', 'Blue'],
        sizes: ['xx-small', 'x-small', 'small'],
        dressStyle: 'casual',
        images: ['/images/pic14.png'],
        rating: 4.5,
        discountPercentage: 0,
        isOnSale: false,
    },
    {
        name: 'POLO SHIRT',
        description: 'Classic polo shirt.',
        price: 95,
        stock: 50,
        category: 'mens-clothing',
        type: 'shirts',
        colors: ['White', 'Blue', 'Yellow'],
        sizes: ['medium', 'large', 'x-large'],
        dressStyle: 'casual',
        images: ['/images/pic1.png'],
        rating: 4.6,
        discountPercentage: 10,
        isOnSale: true,
    },
    {
        name: 'HOODED SWEATSHIRT',
        description: 'Warm hooded sweatshirt.',
        price: 160,
        stock: 40,
        category: 'mens-clothing',
        type: 'hoodie',
        colors: ['Black', 'Grey'],
        sizes: ['small', 'medium', 'large', 'x-large'],
        dressStyle: 'gym',
        images: ['/images/pic2.png'],
        rating: 4.4,
        discountPercentage: 0,
        isOnSale: false,
    },
    {
        name: 'EXCLUSIVE POINTS T-SHIRT',
        description: 'Special edition t-shirt available only with loyalty points.',
        price: 0,
        pointsPrice: 500,
        stock: 20,
        category: 'mens-clothing',
        type: 't-shirts',
        colors: ['Gold', 'Silver'],
        sizes: ['medium', 'large'],
        dressStyle: 'casual',
        images: ['/images/pic1.png'],
        rating: 5.0,
        isPointsOnly: true,
        discountPercentage: 0,
        isOnSale: false,
    },
    {
        name: 'HYBRID PREMIUM JACKET',
        description: 'Premium jacket - buy with money or points.',
        price: 200,
        pointsPrice: 1500,
        stock: 15,
        category: 'mens-clothing',
        type: 'jackets',
        colors: ['Black', 'Navy'],
        sizes: ['medium', 'large', 'x-large'],
        dressStyle: 'formal',
        images: ['/images/pic3.png'],
        rating: 4.8,
        isHybrid: true,
        discountPercentage: 0,
        isOnSale: false,
    },
    {
        name: 'LUXURY DESIGNER COAT',
        description: 'High-end designer coat for special occasions.',
        price: 600,
        pointsPrice: 4000,
        stock: 5,
        category: 'mens-clothing',
        type: 'coats',
        colors: ['Black', 'Charcoal'],
        sizes: ['medium', 'large'],
        dressStyle: 'formal',
        images: ['/images/pic4.png'],
        rating: 4.9,
        isHybrid: true,
        discountPercentage: 0,
        isOnSale: false,
    },
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        console.log('Cleaning database...');
        const db = mongoose.connection.db;
        if (db) {
            await db.dropDatabase();
            console.log('Database cleaned.');
        } else {
            console.log('Database connection established but DB object is missing. Skipping cleanup.');
        }

        console.log('Seeding super admin...');
        const hashedPassword = await bcrypt.hash('Password123!', 10);
        await User.create({
            name: 'Super Admin',
            email: 'admin@shopco.com',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        });
        console.log('Super admin seeded.');

        console.log('Seeding products...');
        await Product.insertMany(products);
        console.log('Products seeded.');

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
