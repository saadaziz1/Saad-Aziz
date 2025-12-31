/* eslint-disable prettier/prettier */
// car.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CarMake, CarModel } from '../enums';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    required: true,
    enum: Object.values(CarMake),
  })
  make: CarMake;

  @Prop({
    required: true,
    enum: Object.values(CarModel),
  })
  model: CarModel;

  @Prop({ required: true })
  year: number;

  @Prop({
    required: true,
    enum: ['sedan', 'sports', 'hatchback', 'convertible', 'suv', 'coupe'],
  })
  bodyType: string;

  @Prop()
  category: string;

  @Prop([String])
  photos: string[];

  @Prop({ required: true })
  startingPrice: number;

  @Prop({ default: 0 })
  currentPrice: number;

  @Prop([{ type: Types.ObjectId, ref: 'Bid' }])
  bids: Types.ObjectId[];

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  // Additional fields from form
  @Prop()
  vin: string;

  @Prop()
  mileage: number;

  @Prop({
    enum: ['4', '6', '8', '10', '12'],
  })
  engineSize: string;

  @Prop({
    enum: ['Original Paint', 'Partially Repainted', 'Totally Repainted'],
  })
  paint: string;

  @Prop({
    enum: ['yes', 'no'],
  })
  gccSpecs: string;

  @Prop({
    enum: ['yes', 'no'],
  })
  accidentHistory: string;

  @Prop({
    enum: ['yes', 'no'],
  })
  serviceHistory: string;

  @Prop({
    enum: ['stock', 'modified'],
  })
  modified: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);
