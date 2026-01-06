import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional, IsEnum, IsMongoId } from 'class-validator';
import { ProductColor, ProductSize } from '../../../common/enums/product-attributes.enum';

/**
 * Update cart item payload
 */
export class UpdateCartDto {
    @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
    @IsString()
    productId: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({ enum: ProductColor, required: false, example: ProductColor.BLACK })
    @IsOptional()
    @IsEnum(ProductColor)
    selectedColor?: ProductColor;

    @ApiProperty({ enum: ProductSize, required: false, example: ProductSize.M })
    @IsOptional()
    @IsEnum(ProductSize)
    selectedSize?: ProductSize;

    @ApiProperty({ required: false })
    @IsOptional()
    payWithPoints?: boolean;
}
