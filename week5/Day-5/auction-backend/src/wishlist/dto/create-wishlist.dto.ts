import { IsMongoId, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1', description: 'ID of the user' })
  @IsMongoId()
  userId: Types.ObjectId;

  @ApiProperty({ type: [String], example: ['65f1a2b3c4d5e6f7a8b9c0d2'], description: 'List of car IDs in wishlist' })
  @IsArray()
  @IsMongoId({ each: true })
  carIds: Types.ObjectId[];
}
