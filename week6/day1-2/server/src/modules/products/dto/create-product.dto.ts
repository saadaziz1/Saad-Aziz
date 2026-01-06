import { IsString, IsNumber, IsBoolean, IsArray, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory, ProductSize, DressStyle, ProductColor, ProductType, PurchaseType } from '../../../common/enums/product-attributes.enum';
import { Transform } from 'class-transformer';

/**
 * DTO for product creation
 */
export class CreateProductDto {

    @ApiProperty({ example: 'Summer T-Shirt' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Comfortable cotton t-shirt for summer' })
    @IsString()
    description: string;

    @ApiProperty({ example: 29.99 })
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 500 })
    @IsOptional()
    @Transform(({ value }) => value !== undefined ? parseInt(value, 10) : 0)
    @IsNumber()
    @Min(0)
    pointsPrice?: number;

    @ApiProperty({ example: 100 })
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ enum: ProductCategory, example: ProductCategory.MENS_CLOTHING })
    @IsEnum(ProductCategory)
    category: ProductCategory;

    @ApiProperty({ enum: ProductColor, isArray: true, example: [ProductColor.BLACK, ProductColor.WHITE] })
    @IsOptional()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    @IsArray()
    @IsEnum(ProductColor, { each: true })
    colors: ProductColor[];

    @ApiProperty({ enum: ProductSize, isArray: true, example: [ProductSize.M, ProductSize.L] })
    @IsOptional()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    @IsArray()
    @IsEnum(ProductSize, { each: true })
    sizes: ProductSize[];

    @ApiProperty({ enum: DressStyle, example: DressStyle.CASUAL })
    @IsEnum(DressStyle)
    dressStyle: DressStyle;

    @ApiProperty({ enum: ProductType, example: ProductType.TSHIRTS })
    @IsEnum(ProductType)
    type: ProductType;

    @ApiProperty({ enum: PurchaseType, example: PurchaseType.MONEY_ONLY })
    @IsOptional()
    @IsEnum(PurchaseType)
    purchaseType?: PurchaseType;

    @ApiProperty({ example: 'Adidas' })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiProperty({ example: '#234952' })
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiProperty({ example: ['Casual', 'Linen'], isArray: true })
    @IsOptional()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiProperty({ example: 0 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    discountPercentage?: number;

    @ApiProperty({ example: 100 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    totalStock?: number;

    @ApiProperty({ example: true })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isOnSale?: boolean;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, description: 'Product images (max 3)' })
    @IsOptional()
    images?: any[];
}
