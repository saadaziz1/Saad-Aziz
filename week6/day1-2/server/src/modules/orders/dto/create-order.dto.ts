import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNumber, Min } from 'class-validator';

/**
 * DTO for placing an order
 */
export class CreateOrderDto {

    @ApiProperty()
    @IsMongoId()
    productId: string;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    quantity: number;

    /**
     * Determines whether user wants to pay using points
     */
    @ApiProperty()
    @IsBoolean()
    usePoints: boolean;
}
