import { IsOptional, IsEnum, IsNumber, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategory, ProductSize, ProductColor, DressStyle, ProductType } from '../../../common/enums/product-attributes.enum';
import { Transform } from 'class-transformer';

/**
 * DTO for filtering products in the list endpoint
 */
export class FilterProductsDto {
    @ApiPropertyOptional({ enum: ProductCategory })
    @IsOptional()
    @IsEnum(ProductCategory)
    category?: ProductCategory;

    @ApiPropertyOptional({ enum: ProductType })
    @IsOptional()
    @IsEnum(ProductType)
    type?: ProductType;

    @ApiPropertyOptional({ enum: ProductSize })
    @IsOptional()
    @IsEnum(ProductSize)
    size?: ProductSize;

    @ApiPropertyOptional({ enum: ProductColor })
    @IsOptional()
    @IsEnum(ProductColor)
    color?: ProductColor;

    @ApiPropertyOptional({ enum: DressStyle })
    @IsOptional()
    @IsEnum(DressStyle)
    dressStyle?: DressStyle;

    @ApiPropertyOptional({ type: Number, example: 10 })
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    minPrice?: number;

    @ApiPropertyOptional({ type: Number, example: 1000 })
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    maxPrice?: number;

    @ApiPropertyOptional({ example: 'shirt' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ type: Boolean, example: true })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isOnSale?: boolean;

    @ApiPropertyOptional({ type: Number, example: 1 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({ type: Number, example: 10 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ type: String, example: 'price:asc' })
    @IsOptional()
    @IsString()
    sort?: string;
}
