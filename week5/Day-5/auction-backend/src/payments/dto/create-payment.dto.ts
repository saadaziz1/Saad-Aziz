import {
  IsMongoId,
  IsNumber,
  IsEnum,
  IsDate,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1', description: 'ID of the auction' })
  @IsMongoId()
  auctionId: Types.ObjectId;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d2', description: 'ID of the buyer' })
  @IsMongoId()
  buyerId: Types.ObjectId;

  @ApiProperty({ example: 55000, description: 'Amount paid' })
  @IsNumber()
  amountPaid: number;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'inTransit', 'delivered', 'completed'],
    description: 'Payment/Delivery status',
    required: false
  })
  @IsEnum(['pending', 'inTransit', 'delivered', 'completed'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: '2025-01-01T10:00:00Z', description: 'Date of payment', required: false })
  @IsDate()
  @IsOptional()
  paymentDate?: Date;

  @ApiProperty({
    example: [{ status: 'inTransit', updatedAt: '2025-01-02T10:00:00Z' }],
    description: 'Delivery updates history',
    required: false
  })
  @IsArray()
  @IsOptional()
  deliveryUpdates?: { status: string; updatedAt: Date }[];

  @ApiProperty({ example: 'txn_123456789', description: 'Transaction ID', required: false })
  @IsString()
  @IsOptional()
  transactionID?: string;
}
