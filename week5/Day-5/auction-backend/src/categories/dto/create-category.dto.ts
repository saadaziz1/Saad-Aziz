import { IsString, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Sports Cars', description: 'Name of the category' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://example.com/icon.png', description: 'Icon URL', required: false })
  @IsOptional()
  @IsUrl()
  icon?: string;
}
