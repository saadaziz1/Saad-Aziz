import { IsString, IsEnum, IsNumber, Min, IsOptional, MaxLength, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RawMaterialUnit } from '../schema/raw-material.schema';

export class UpdateRawMaterialDto {
    @ApiProperty({ example: 'Flour', description: 'Name of the raw material', required: false })
    @IsString()
    @IsOptional()
    @MaxLength(25)
    name?: string;

    @ApiProperty({ enum: RawMaterialUnit, example: 'g', description: 'Unit of measurement', required: false })
    @IsEnum(RawMaterialUnit)
    @IsOptional()
    unit?: RawMaterialUnit;

    @ApiProperty({ example: 1000, description: 'Current stock quantity', required: false, minimum: 0 })
    @IsNumber()
    @Min(0)
    @Max(9999999)
    @IsOptional()
    stockQty?: number;

    @ApiProperty({ example: 100, description: 'Minimum stock level for alerts', required: false, minimum: 0 })
    @IsNumber()
    @Min(0)
    @Max(9999999)
    @IsOptional()
    minAlertQty?: number;
}
