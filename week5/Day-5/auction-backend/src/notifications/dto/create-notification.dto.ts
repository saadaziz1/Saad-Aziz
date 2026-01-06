import { IsString, IsMongoId, IsBoolean, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ example: 'auction_started', description: 'Type of notification' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'The auction for BMW M4 has started!', description: 'Notification message' })
  @IsString()
  message: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1', description: 'ID of the recipient user', required: false })
  @IsMongoId()
  @IsOptional()
  userId?: Types.ObjectId;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d2', description: 'ID of the associated auction', required: false })
  @IsMongoId()
  @IsOptional()
  auctionId?: Types.ObjectId;

  @ApiProperty({ example: false, description: 'Read status', required: false })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}

export class NotificationResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'auction_started' })
  type: string;

  @ApiProperty({ example: 'The auction for BMW M4 has started!' })
  message: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  userId: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d2', required: false })
  auctionId?: string;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: '2025-01-01T10:00:00Z' })
  createdAt: string;
}
