import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, Min, IsOptional, IsBoolean, MaxLength, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { RecipeItemDto } from './recipe-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Small Tikka Pizza', description: 'Product Name' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(25)
    name: string;

    @ApiProperty({ example: 12.50, description: 'Product Price', minimum: 0 })
    @IsNumber()
    @Min(0)
    @Max(9999999999)
    @Type(() => Number)
    price: number;

    @ApiProperty({ example: 'Category 1', description: 'Product Category' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    category: string;

    @ApiProperty({ example: 'https://...', description: 'Product Image URL', required: false })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiProperty({
        type: 'array',
        items: { type: 'object' },
        description: 'List of raw materials and quantities',
        example: [
            { rawMaterial: '60d0fe4f5311236168a109ca', quantity: 200 },
            { rawMaterial: '60d0fe4f5311236168a109cb', quantity: 50 },
        ]
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try { return JSON.parse(value); } catch (e) { return value; }
        }
        return value;
    })
    @IsArray()
    recipe: any[];

    @ApiProperty({ example: true, description: 'Is product active for sale', required: false, default: true })
    @IsOptional()
    @Transform(({ value }) => {
        return value;
    })
    isActive?: any;
}
