import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class SignupDto {
    @IsString()
    @IsNotEmpty({ message: 'First name is required' })
    @MinLength(2, { message: 'First name is too short' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Last name is required' })
    @MinLength(2, { message: 'Last name is too short' })
    lastName: string;

    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;

    @IsString()
    @IsNotEmpty()
    role: string;
}

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
