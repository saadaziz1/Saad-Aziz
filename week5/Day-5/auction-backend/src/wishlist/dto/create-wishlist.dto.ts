import { IsMongoId, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { CarResponseDto } from '../../cars/dto/create-car.dto';

export class CreateWishlistDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1', description: 'ID of the user' })
  @IsMongoId()
  userId: Types.ObjectId;

  @ApiProperty({ type: [String], example: ['65f1a2b3c4d5e6f7a8b9c0d2'], description: 'List of car IDs in wishlist' })
  @IsArray()
  @IsMongoId({ each: true })
  carIds: Types.ObjectId[];
}

export class WishlistResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  userId: string;

  @ApiProperty({ type: [CarResponseDto] })
  carIds: CarResponseDto[];
}
