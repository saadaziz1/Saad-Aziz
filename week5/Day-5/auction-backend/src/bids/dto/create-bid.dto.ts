import { IsNotEmpty, IsNumber, IsMongoId, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBidDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1', description: 'ID of the auction' })
  @IsNotEmpty({ message: 'Auction ID is required' })
  @IsMongoId({ message: 'Invalid auction ID format' })
  auctionId: Types.ObjectId;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d2', description: 'ID of the bidder' })
  @IsNotEmpty({ message: 'Bidder ID is required' })
  @IsMongoId({ message: 'Invalid bidder ID format' })
  bidderId: Types.ObjectId;

  @ApiProperty({ example: 10500, description: 'Bid amount' })
  @IsNotEmpty({ message: 'Bid amount is required' })
  @IsNumber({}, { message: 'Bid amount must be a number' })
  @Min(1, { message: 'Bid amount must be greater than 0' })
  @Transform(({ value }) => parseFloat(value))
  amount: number;
}

export class BidResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  auctionId: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d2' })
  bidderId: string;

  @ApiProperty({ example: 10500 })
  amount: number;

  @ApiProperty({ example: '2025-01-01T12:00:00Z' })
  placedAt: string;
}