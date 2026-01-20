import { IsEnum, IsNotEmpty, IsNumber, IsOptional, MaxLength, Min, Max, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RawMaterialUnit } from '../schema/raw-material.schema';

export class CreateRawMaterialDto {
    @ApiProperty({ example: 'Flour', description: 'Name of the raw material' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(25)
    name: string;

    @ApiProperty({ enum: RawMaterialUnit, example: 'g', description: 'Unit of measurement' })
    @IsEnum(RawMaterialUnit)
    unit: RawMaterialUnit;

    @ApiProperty({ example: 1000, description: 'Current stock quantity', minimum: 0 })
    @IsNumber()
    @Min(0)
    @Max(9999999)
    stockQty: number;

    @ApiProperty({ example: 100, description: 'Minimum stock level for alerts', required: false, minimum: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(9999999)
    minAlertQty?: number;
}
