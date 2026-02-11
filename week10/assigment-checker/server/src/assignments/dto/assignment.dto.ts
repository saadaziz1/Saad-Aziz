import { IsString, IsNumber, IsNotEmpty, Min, MaxLength, MinLength, IsDate, IsEnum, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssignmentDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    @MinLength(5, { message: 'Title must be at least 5 characters' })
    @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
    title: string;

    @IsNumber()
    @Min(100, { message: 'Minimum 100 words required' })
    targetWordCount: number;

    @Type(() => Date)
    @IsDate({ message: 'Invalid deadline date' })
    deadline: Date;

    @IsString()
    @IsNotEmpty({ message: 'Instructions are required' })
    @MinLength(20, { message: 'Please provide more detailed instructions (min 20 chars)' })
    @MaxLength(2000, { message: 'Instructions cannot exceed 2000 characters' })
    instructions: string;

    @IsEnum(['strict', 'loose'], { message: 'Marking mode must be either strict or loose' })
    markingMode: 'strict' | 'loose';

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    focusAreas: string[];

    @IsOptional()
    @IsBoolean()
    autoEvaluation?: boolean;
}

export class UpdateAssignmentDto {
    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(100)
    title?: string;

    @IsOptional()
    @IsNumber()
    @Min(100)
    targetWordCount?: number;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    deadline?: Date;

    @IsOptional()
    @IsString()
    @MinLength(20)
    @MaxLength(2000)
    instructions?: string;

    @IsOptional()
    @IsEnum(['strict', 'loose'])
    markingMode?: 'strict' | 'loose';

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    focusAreas?: string[];

    @IsOptional()
    @IsBoolean()
    autoEvaluation?: boolean;
}
