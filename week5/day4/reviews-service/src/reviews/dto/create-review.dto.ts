import { IsNotEmpty, IsString, IsNumber, Min, Max, IsArray, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  plainText?: string;

  @IsArray()
  @IsOptional()
  mentions?: string[];

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}