import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { CarMake, CarModel } from '../enums';

export class CreateCarDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1', description: 'ID of the seller', required: false })
  @IsOptional()
  @IsMongoId({ message: 'Invalid seller ID format' })
  @Transform(({ value }) => value ? new Types.ObjectId(value) : undefined)
  sellerId?: Types.ObjectId;

  @ApiProperty({ example: '2022 BMW M4 Competition', description: 'Car title' })
  @IsNotEmpty({ message: 'Car title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({ example: 'Mint condition, low mileage', description: 'Car description', required: false })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({ enum: CarMake, example: CarMake.BMW, description: 'Car make' })
  @IsNotEmpty({ message: 'Make is required' })
  @IsEnum(CarMake, { message: 'Invalid car make' })
  make: CarMake;

  @ApiProperty({ enum: CarModel, example: CarModel.SERIES_3, description: 'Car model' })
  @IsNotEmpty({ message: 'Model is required' })
  @IsEnum(CarModel, { message: 'Invalid car model' })
  model: CarModel;

  @ApiProperty({ example: 2022, description: 'Year of manufacture' })
  @IsNotEmpty({ message: 'Year is required' })
  @Transform(({ value }) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? value : parsed;
  })
  @IsNumber({}, { message: 'Year must be a number' })
  @Min(1900, { message: 'Year must be after 1900' })
  year: number;

  @ApiProperty({
    example: 'coupe',
    enum: ['sedan', 'sports', 'hatchback', 'convertible', 'suv', 'coupe'],
    description: 'Body type'
  })
  @IsNotEmpty({ message: 'Body type is required' })
  @IsEnum(['sedan', 'sports', 'hatchback', 'convertible', 'suv', 'coupe'], {
    message: 'Body type must be one of: sedan, sports, hatchback, convertible, suv, coupe'
  })
  bodyType: string;

  @ApiProperty({ example: 'Sports Cars', description: 'Category', required: false })
  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  category?: string;

  @ApiProperty({
    type: [String],
    description: 'URLs of car photos',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Photos must be an array' })
  @IsString({ each: true, message: 'Each photo must be a string' })
  photos?: string[];

  @ApiProperty({ example: 50000, description: 'Starting bid price' })
  @IsNotEmpty({ message: 'Starting price is required' })
  @Transform(({ value }) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? value : parsed;
  })
  @IsNumber({}, { message: 'Starting price must be a number' })
  @Min(0, { message: 'Starting price must be positive' })
  startingPrice: number;

  @ApiProperty({ example: 55000, description: 'Current bid price', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? value : parsed;
  })
  @IsNumber({}, { message: 'Current price must be a number' })
  @Min(0, { message: 'Current price must be positive' })
  currentPrice?: number;

  @ApiProperty({ type: [String], description: 'List of bid IDs', required: false })
  @IsOptional()
  @IsArray({ message: 'Bids must be an array' })
  @IsMongoId({ each: true, message: 'Each bid ID must be valid' })
  bids?: Types.ObjectId[];

  @ApiProperty({ example: false, description: 'Whether the auction is completed', required: false })
  @IsOptional()
  @IsBoolean({ message: 'Completed status must be boolean' })
  isCompleted?: boolean;

  @ApiProperty({ example: '2025-01-01T10:00:00Z', description: 'Auction start time' })
  @IsNotEmpty({ message: 'Start time is required' })
  @Transform(({ value }) => {
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date;
  })
  @IsDate({ message: 'Start time must be a valid date' })
  startTime: Date;

  @ApiProperty({ example: '2025-01-02T10:00:00Z', description: 'Auction end time' })
  @IsNotEmpty({ message: 'End time is required' })
  @Transform(({ value }) => {
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date;
  })
  @IsDate({ message: 'End time must be a valid date' })
  endTime: Date;

  @ApiProperty({ example: '1A2B3C4D5E6F7G8H9', description: 'VIN Number', required: false })
  @IsOptional()
  @IsString({ message: 'VIN must be a string' })
  vin?: string;

  @ApiProperty({ example: 15000, description: 'Mileage in km', required: false })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  @IsNumber({}, { message: 'Mileage must be a number' })
  mileage?: number;

  @ApiProperty({ example: '8', enum: ['4', '6', '8', '10', '12'], description: 'Engine cylinders', required: false })
  @IsOptional()
  @IsEnum(['4', '6', '8', '10', '12'], {
    message: 'Engine size must be one of: 4, 6, 8, 10, 12'
  })
  engineSize?: string;

  @ApiProperty({
    example: 'Original Paint',
    enum: ['Original Paint', 'Partially Repainted', 'Totally Repainted'],
    description: 'Paint condition',
    required: false
  })
  @IsOptional()
  @IsEnum(['Original Paint', 'Partially Repainted', 'Totally Repainted'], {
    message: 'Paint must be one of: Original Paint, Partially Repainted, Totally Repainted'
  })
  paint?: string;

  @ApiProperty({ example: 'yes', enum: ['yes', 'no'], description: 'GCC Specifications', required: false })
  @IsOptional()
  @IsEnum(['yes', 'no'], {
    message: 'GCC specs must be yes or no'
  })
  gccSpecs?: string;

  @ApiProperty({ example: 'no', enum: ['yes', 'no'], description: 'Accident History', required: false })
  @IsOptional()
  @IsEnum(['yes', 'no'], {
    message: 'Accident history must be yes or no'
  })
  accidentHistory?: string;

  @ApiProperty({ example: 'yes', enum: ['yes', 'no'], description: 'Full Service History', required: false })
  @IsOptional()
  @IsEnum(['yes', 'no'], {
    message: 'Service history must be yes or no'
  })
  serviceHistory?: string;

  @ApiProperty({ example: 'stock', enum: ['stock', 'modified'], description: 'Modified status', required: false })
  @IsOptional()
  @IsEnum(['stock', 'modified'], {
    message: 'Modified status must be stock or modified'
  })
  modified?: string;
}

export class CarResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: '2022 BMW M4 Competition' })
  title: string;

  @ApiProperty({ example: 'BMW', enum: CarMake })
  make: string;

  @ApiProperty({ example: 'M4', enum: CarModel })
  model: string;

  @ApiProperty({ example: 2022 })
  year: number;

  @ApiProperty({ example: 55000 })
  currentPrice: number;

  @ApiProperty({ example: 50000 })
  startingPrice: number;

  @ApiProperty({ example: ['https://example.com/car1.jpg'] })
  photos: string[];

  @ApiProperty({ example: '2025-01-01T10:00:00Z' })
  startTime: string;

  @ApiProperty({ example: '2025-01-08T10:00:00Z' })
  endTime: string;

  @ApiProperty({ example: 12 })
  totalBids: number;

  @ApiProperty({ example: 'coupe' })
  bodyType: string;

  @ApiProperty({ example: 15000 })
  mileage: number;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1', description: 'Seller ID' })
  sellerId: string;
}

export class FilterOptionsResponseDto {
  @ApiProperty({ example: ['BMW', 'Mercedes', 'Toyota'] })
  makes: string[];

  @ApiProperty({ example: ['M4', 'C-Class', 'Corolla'] })
  models: string[];

  @ApiProperty({ example: [2024, 2023, 2022] })
  years: number[];
}
