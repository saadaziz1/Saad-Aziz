import { IsNotEmpty, IsNumber, IsMongoId, Min, IsString, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class RecipeItemDto {
    @ApiProperty({ example: '60d0fe4f5311236168a109ca', description: 'Raw Material ID' })
    @IsString()
    @IsMongoId()
    @IsNotEmpty()
    @Expose()
    rawMaterial: string;

    @ApiProperty({ example: 10, description: 'Quantity required', minimum: 0.01 })
    @IsNumber()
    @Min(0.01)
    @Max(9999)
    @Expose()
    @Type(() => Number)
    quantity: number;
}
