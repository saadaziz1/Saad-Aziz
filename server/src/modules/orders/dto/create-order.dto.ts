import { IsNotEmpty, IsNumber, IsArray, ValidateNested, Min, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @ApiProperty({ example: '60d0fe4f5311236168a109ca', description: 'Product ID' })
    @IsMongoId()
    @IsNotEmpty()
    product: string;

    @ApiProperty({ example: 2, description: 'Quantity of product', minimum: 1 })
    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({
        type: [OrderItemDto],
        description: 'List of items in the order',
        example: [
            { product: '60d0fe4f5311236168a109cc', quantity: 2 },
            { product: '60d0fe4f5311236168a109cd', quantity: 1 },
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({ example: 'IN_STORE', enum: ['IN_STORE', 'PICKUP', 'SHIPPING'] })
    @IsNotEmpty()
    type: string;

    @ApiProperty({ example: 'Credit Card' })
    @IsNotEmpty()
    paymentMethod: string;
}
