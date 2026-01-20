import { IsString, IsNotEmpty, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    name: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
