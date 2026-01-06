import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNumber, Min } from 'class-validator';

/**
 * DTO for placing an order
 */
export class CreateOrderDto {

    @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1', description: 'ID of the product to order' })
    @IsMongoId()
    productId: string;

    @ApiProperty({ example: 1, description: 'Quantity of the product' })
    @IsNumber()
    @Min(1)
    quantity: number;

    /**
     * Determines whether user wants to pay using points
     */
    @ApiProperty({ example: false, description: 'True if paying with loyalty points' })
    @IsBoolean()
    usePoints: boolean;
}
