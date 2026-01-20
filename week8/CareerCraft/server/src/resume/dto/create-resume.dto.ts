import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateResumeDto {
  @IsString() fullName: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() summary?: string;

  @IsOptional() @IsArray() education?: Array<{
    school?: string;
    degree?: string;
    startYear?: string;
    endYear?: string;
    description?: string;
  }>;

  @IsOptional() @IsArray() experience?: Array<{
    company?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;

  @IsOptional() @IsArray() skills?: string[];

  @IsOptional() @IsArray() projects?: Array<{
    name?: string;
    url?: string;
    description?: string;
  }>;

  @IsOptional() @IsArray() certifications?: string[];

  @IsOptional() @IsArray() languages?: string[];

  @IsOptional() @IsString() templateId?: string;
}
