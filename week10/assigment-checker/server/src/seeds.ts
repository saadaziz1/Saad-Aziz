import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './auth/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userModel = app.get<Model<any>>(getModelToken(User.name));

    const demoUsers = [
        {
            email: 'teacher@demo.com',
            password: 'password123',
            firstName: 'Demo',
            lastName: 'Teacher',
            role: 'teacher',
        },
        {
            email: 'student@demo.com',
            password: 'password123',
            firstName: 'Demo',
            lastName: 'Student',
            role: 'student',
            rollNumber: 'DEMO-001',
        },
        {
            email: 'moderator@demo.com',
            password: 'password123',
            firstName: 'Demo',
            lastName: 'Moderator',
            role: 'moderator',
        },
    ];

    console.log('🚀 Starting seeding process...');

    for (const userData of demoUsers) {
        const exists = await userModel.findOne({ email: userData.email });
        if (!exists) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new userModel({
                ...userData,
                password: hashedPassword,
            });
            await user.save();
            console.log(`✅ Seeded demo user: ${userData.email}`);
        } else {
            console.log(`ℹ️ Demo user already exists: ${userData.email}`);
        }
    }

    console.log('🏁 Seeding completed successfully.');
    await app.close();
}

bootstrap();
