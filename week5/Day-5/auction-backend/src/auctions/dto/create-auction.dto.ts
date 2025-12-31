import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuctionDto {
  @ApiProperty({
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
    description: 'ID of the car being auctioned',
  })
  @IsMongoId()
  @Type(() => Types.ObjectId)
  car: Types.ObjectId;

  @ApiProperty({
    example: '2025-01-01T10:00:00Z',
    description: 'Start time of the auction',
  })
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({
    example: '2025-01-02T10:00:00Z',
    description: 'End time of the auction',
  })
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({
    example: 'upcoming',
    enum: ['upcoming', 'live', 'ended', 'completed'],
    description: 'Current status of the auction',
    required: false,
  })
  @IsEnum(['upcoming', 'live', 'ended', 'completed'])
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: 10000,
    description: 'Current price of the car in the auction',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  currentPrice?: number;

  @ApiProperty({
    example: '65f1a2b3c4d5e6f7a8b9c0d2',
    description: 'ID of the winning bid',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  @Type(() => Types.ObjectId)
  winningBid?: Types.ObjectId;
}
