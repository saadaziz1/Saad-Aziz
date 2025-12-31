import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Car } from './cars/schemas/car.schema';
import { User } from './users/schemas/user.schema';
import { Bid } from './bids/schemas/bid.schema';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const carModel = app.get(getModelToken(Car.name));
  const userModel = app.get(getModelToken(User.name));
  const bidModel = app.get(getModelToken(Bid.name));

  // Clear existing data first
  await bidModel.deleteMany({});
  await carModel.deleteMany({});
  await userModel.deleteMany({});
  console.log('Cleared existing data');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await userModel.insertMany([
    {
      username: 'seller1',
      email: 'seller1@example.com',
      passwordHash: hashedPassword,
      fullName: 'John Seller',
      mobileNumber: '234567890',
      countryCode: '+234',
    },
    {
      username: 'seller2',
      email: 'seller2@example.com',
      passwordHash: hashedPassword,
      fullName: 'Jane Dealer',
      mobileNumber: '1234567891',
      countryCode: '+234',
    },
  ]);

  const now = new Date();
  const cars = await carModel.insertMany([
    {
      sellerId: users[0]._id,
      title: 'Red Mazda MX-5 Sports Car',
      description: 'Beautiful red sports car in excellent condition with low mileage and full service history',
      make: 'Mazda',
      model: 'Other',
      year: 2022,
      bodyType: 'sports',
      category: 'Sports Cars',
      photos: [
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180159/car-auctions/f9wb6neoe0hsc6mchpoh.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/tewkwjspal62faeogqid.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/qwqwkgzrbzioeewfi85d.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/gd7hkahfeiso0vgvcise.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/ocntly5pquealxvfur0g.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180159/car-auctions/adphzes8ot9jjzoae4hd.png"
      ],
      startingPrice: 25000,
      currentPrice: 27500,
      isCompleted: false,
      startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
      vin: 'JM1NDAD76M0123456',
      mileage: 15000,
      engineSize: '4',
      paint: 'Original Paint',
      gccSpecs: 'yes',
      accidentHistory: 'no',
      serviceHistory: 'yes',
      modified: 'stock',
    },
    {
      sellerId: users[1]._id,
      title: 'White Porsche 911 Sports Car',
      description: 'Iconic white sports car with premium features and exceptional performance',
      make: 'Porsche',
      model: 'Other',
      year: 2023,
      bodyType: 'sports',
      category: 'Luxury Sports',
      photos: [
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180159/car-auctions/f9wb6neoe0hsc6mchpoh.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/tewkwjspal62faeogqid.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/qwqwkgzrbzioeewfi85d.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/gd7hkahfeiso0vgvcise.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/ocntly5pquealxvfur0g.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180159/car-auctions/adphzes8ot9jjzoae4hd.png"
      ], startingPrice: 85000,
      currentPrice: 92000,
      isCompleted: false,
      startTime: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      vin: 'WP0AB2A99NS123456',
      mileage: 8500,
      engineSize: '6',
      paint: 'Original Paint',
      gccSpecs: 'yes',
      accidentHistory: 'no',
      serviceHistory: 'yes',
      modified: 'stock',
    },
    {
      sellerId: users[0]._id,
      title: 'BMW X5 Luxury SUV',
      description: 'Premium SUV with advanced technology, spacious interior, and powerful engine. Perfect for families.',
      make: 'BMW',
      model: 'X5',
      year: 2021,
      bodyType: 'suv',
      category: 'Luxury SUV',
      photos: [
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180159/car-auctions/f9wb6neoe0hsc6mchpoh.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/tewkwjspal62faeogqid.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/qwqwkgzrbzioeewfi85d.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/gd7hkahfeiso0vgvcise.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/ocntly5pquealxvfur0g.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180159/car-auctions/adphzes8ot9jjzoae4hd.png"
      ], startingPrice: 55000,
      currentPrice: 58000,
      isCompleted: false,
      startTime: new Date(now.getTime() - 36 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      vin: 'WBAKR8C50LC123456',
      mileage: 32000,
      engineSize: '6',
      paint: 'Original Paint',
      gccSpecs: 'yes',
      accidentHistory: 'no',
      serviceHistory: 'yes',
      modified: 'stock',
    },
    {
      sellerId: users[1]._id,
      title: 'Tesla Model 3 Performance',
      description: 'Electric performance sedan with autopilot, premium interior, and incredible acceleration. Zero emissions.',
      make: 'Tesla',
      model: 'Model 3',
      year: 2022,
      bodyType: 'sedan',
      category: 'Electric Vehicles',
      photos: [
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180159/car-auctions/f9wb6neoe0hsc6mchpoh.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/tewkwjspal62faeogqid.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/qwqwkgzrbzioeewfi85d.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/gd7hkahfeiso0vgvcise.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/ocntly5pquealxvfur0g.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180159/car-auctions/adphzes8ot9jjzoae4hd.png"
      ], startingPrice: 45000,
      currentPrice: 45000,
      isCompleted: false,
      startTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      vin: '5YJ3E1EA5MF123456',
      mileage: 18000,
      engineSize: '4',
      paint: 'Original Paint',
      gccSpecs: 'no',
      accidentHistory: 'no',
      serviceHistory: 'yes',
      modified: 'stock',
    },
    {
      sellerId: users[0]._id,
      title: 'Honda Civic Type R',
      description: 'High-performance hot hatch with turbocharged engine, sport suspension, and aggressive styling.',
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      bodyType: 'hatchback',
      category: 'Performance Hatchback',
      photos: [
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180159/car-auctions/f9wb6neoe0hsc6mchpoh.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/tewkwjspal62faeogqid.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/qwqwkgzrbzioeewfi85d.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/gd7hkahfeiso0vgvcise.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/ocntly5pquealxvfur0g.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180159/car-auctions/adphzes8ot9jjzoae4hd.png"
      ], startingPrice: 38000,
      currentPrice: 41000,
      isCompleted: false,
      startTime: new Date(now.getTime() - 18 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      vin: '2HGFC1F39MH123456',
      mileage: 5000,
      engineSize: '4',
      paint: 'Original Paint',
      gccSpecs: 'yes',
      accidentHistory: 'no',
      serviceHistory: 'yes',
      modified: 'modified',
    },
    {
      sellerId: users[1]._id,
      title: 'Toyota Land Cruiser V8',
      description: 'Legendary off-road SUV with V8 power, luxury interior, and proven reliability. Perfect for desert adventures.',
      make: 'Toyota',
      model: 'Land Cruiser',
      year: 2020,
      bodyType: 'suv',
      category: 'Luxury SUV',
      photos: [
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180159/car-auctions/f9wb6neoe0hsc6mchpoh.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/tewkwjspal62faeogqid.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/qwqwkgzrbzioeewfi85d.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/gd7hkahfeiso0vgvcise.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180158/car-auctions/ocntly5pquealxvfur0g.png",
        "https://res.cloudinary.com/dxnxa5jgc/image/upload/v1767180159/car-auctions/adphzes8ot9jjzoae4hd.png"
      ], startingPrice: 65000,
      currentPrice: 68500,
      isCompleted: false,
      startTime: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      vin: 'JTMCY7AJ5L4123456',
      mileage: 45000,
      engineSize: '8',
      paint: 'Partially Repainted',
      gccSpecs: 'yes',
      accidentHistory: 'no',
      serviceHistory: 'yes',
      modified: 'stock',
    },
  ]);

  await bidModel.insertMany([
    {
      auctionId: cars[0]._id,
      bidderId: users[1]._id,
      amount: 26000,
      placedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      auctionId: cars[0]._id,
      bidderId: users[0]._id,
      amount: 27500,
      placedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    },
  ]);

  console.log('Dummy data added successfully!');
  await app.close();
}

seed().catch(console.error);