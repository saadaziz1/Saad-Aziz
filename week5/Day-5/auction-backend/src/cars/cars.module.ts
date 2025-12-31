// CarsModule updated
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './schemas/car.schema';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    NotificationsModule,
  ],
  providers: [CarsService, CloudinaryService],
  controllers: [CarsController],
  exports: [CarsService],
})
export class CarsModule { }
