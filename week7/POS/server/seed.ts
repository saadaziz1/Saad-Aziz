import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { RawMaterialService } from './src/modules/raw-materials/raw-materials.service';
import { ProductsService } from './src/modules/products/products.service';
import { UsersService } from './src/modules/users/users.service';
import { OrdersService } from './src/modules/orders/orders.service';
import { RawMaterialUnit } from './src/modules/raw-materials/schema/raw-material.schema';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    // Services
    const rawMaterialService = app.get(RawMaterialService);
    const productService = app.get(ProductsService);
    const usersService = app.get(UsersService);
    const ordersService = app.get(OrdersService);
    const configService = app.get(ConfigService);

    // Get DB Connection to clear collections
    const mongoUri = configService.get<string>('MONGO_URI');
    if (!mongoUri) {
        throw new Error('MONGO_URI is not defined');
    }
    const connection = await mongoose.connect(mongoUri);

    console.log('🌱 Clearing Database...');
    if (connection.connection.db) {
        await connection.connection.db.dropDatabase();
    }
    console.log('✅ Database Cleared');

    // 1. Seed Users
    console.log('👤 Seeding Users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const staffPassword = await bcrypt.hash('staff123', 10);

    const admin = await usersService.create({
        email: 'admin@pos.com',
        name: 'Admin User',
        password: adminPassword,
        isActive: true,
    });

    const staff = await usersService.create({
        email: 'staff@pos.com',
        name: 'Staff User',
        password: staffPassword,
        isActive: true,
    });
    console.log('✅ Users Seeded');

    // 2. Seed Raw Materials
    console.log('📦 Seeding Raw Materials...');
    const rawMaterialsMap: any = {};

    const materialNames = ['Material Alpha', 'Material Beta', 'Material Gamma', 'Material Delta', 'Material Epsilon'];
    for (let i = 0; i < materialNames.length; i++) {
        const rm = await rawMaterialService.create({
            name: materialNames[i],
            unit: i % 2 === 0 ? RawMaterialUnit.GRAM : RawMaterialUnit.PCS,
            stockQty: 100000 + (i * 50000), // increased stock so orders don't fail
            minAlertQty: 1000,
        });
        rawMaterialsMap[materialNames[i]] = rm;
    }
    console.log('✅ Raw Materials Seeded');

    // 3. Seed Products
    console.log('🍕 Seeding Products...');
    const categories = ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "Other"];
    const products: any[] = [];

    const productTemplates = [
        { name: 'Standard Item', priceBase: 10 },
        { name: 'Premium Item', priceBase: 25 },
        { name: 'Economy Item', priceBase: 5 },
    ];

    for (const cat of categories) {
        for (let i = 0; i < productTemplates.length; i++) {
            const template = productTemplates[i];
            const p = await productService.create({
                name: `${cat} ${template.name} ${i + 1}`,
                price: template.priceBase + (i * 2.5),
                category: cat,
                image: `https://picsum.photos/seed/${cat}${i}/400/400`,
                isActive: true,
                recipe: [
                    { rawMaterial: (rawMaterialsMap['Material Alpha'] as any)._id.toString(), quantity: 10 * (i + 1) },
                    { rawMaterial: (rawMaterialsMap['Material Beta'] as any)._id.toString(), quantity: 5 * (i + 1) },
                ],
            }, undefined as any);
            products.push(p);
        }
    }
    console.log('✅ Products Seeded');

    // 4. Seed Orders (to show something in the dashboard)
    console.log('🧾 Seeding Orders...');
    const orderTypes = ['IN_STORE', 'PICKUP', 'SHIPPING'];

    // Create random orders
    for (let i = 0; i < 20; i++) {
        try {
            const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, Math.min(3, products.length));
            const items = randomProducts.map(p => ({
                product: (p as any)._id.toString(),
                quantity: Math.floor(Math.random() * 2) + 1
            }));

            await ordersService.create({
                items,
                type: orderTypes[Math.floor(Math.random() * orderTypes.length)] as any,
                paymentMethod: 'Credit Card',
            }, (staff as any)._id.toString());
        } catch (err) {
            console.warn(`Failed to seed order ${i}: ${err.message}`);
        }
    }
    console.log('✅ Orders Seeded');

    console.log('🚀 Seeding Complete!');
    await app.close();
    process.exit(0);
}

bootstrap();
