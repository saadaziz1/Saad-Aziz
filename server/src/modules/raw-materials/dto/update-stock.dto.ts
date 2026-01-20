import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockDto {
    @ApiProperty({ example: 50, description: 'Quantity to add (positive) or remove (negative)' })
    @IsNumber()
    adjustment: number;
}
