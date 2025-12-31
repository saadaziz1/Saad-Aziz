import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class ReplyReviewDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  plainText?: string;

  @IsArray()
  @IsOptional()
  mentions?: string[];
}