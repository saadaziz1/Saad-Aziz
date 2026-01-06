import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+1', description: 'Country code', required: false })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiProperty({ example: '1234567890', description: 'Mobile number', required: false })
  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @ApiProperty({ example: 'American', description: 'Nationality', required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ example: 'Passport', description: 'ID Type', required: false })
  @IsOptional()
  @IsString()
  idType?: string;

  @ApiProperty({ example: 'A1234567', description: 'ID Number', required: false })
  @IsOptional()
  @IsString()
  idNumber?: string;

  @ApiProperty({ example: 'password123', description: 'New password', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: '123 Main St', description: 'Address line 1', required: false })
  @IsOptional()
  @IsString()
  address1?: string;

  @ApiProperty({ example: 'Apt 4B', description: 'Address line 2', required: false })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({ example: 'New York', description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: '10001', description: 'PO Box', required: false })
  @IsOptional()
  @IsString()
  poBox?: string;

  @ApiProperty({ example: 'USA', description: 'Country', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: '1234567', description: 'Landline number', required: false })
  @IsOptional()
  @IsString()
  landline?: string;

  @ApiProperty({ example: 'Individual', description: 'Traffic type', required: false })
  @IsOptional()
  @IsString()
  trafficType?: string;

  @ApiProperty({ example: 'TF123456', description: 'Traffic file number', required: false })
  @IsOptional()
  @IsString()
  trafficFileNumber?: string;

  @ApiProperty({ example: 'ABC-1234', description: 'Plate number', required: false })
  @IsOptional()
  @IsString()
  plateNumber?: string;

  @ApiProperty({ example: 'New York', description: 'Issue city', required: false })
  @IsOptional()
  @IsString()
  issueCity?: string;

  @ApiProperty({ example: 'DL12345678', description: 'Driver license number', required: false })
  @IsOptional()
  @IsString()
  driverLicenseNumber?: string;

  @ApiProperty({ example: 'PC123', description: 'Plate code', required: false })
  @IsOptional()
  @IsString()
  plateCode?: string;

  @ApiProperty({ example: 'NY', description: 'Plate state', required: false })
  @IsOptional()
  @IsString()
  plateState?: string;
}

export class UserResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiPropertyOptional({ example: '+1' })
  countryCode?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  mobileNumber?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  profilePicture?: string;

  @ApiPropertyOptional({ example: 'Individual' })
  trafficType?: string;

  @ApiPropertyOptional({ example: 'TF123456' })
  trafficFileNumber?: string;

  @ApiPropertyOptional({ example: 'DL12345678' })
  driverLicenseNumber?: string;
}
