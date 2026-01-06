import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiExcludeEndpoint } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User, UserDocument } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { UserResponseDto, UpdateUserDto } from './dto/update-user.dto';
import { ErrorResponseDto } from '../auth/dto/auth.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @ApiExcludeEndpoint()
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users', type: [User] })
  async getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return user data',
    type: UserResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 404,
        message: 'User with id 507f1f77bcf86cd799439011 not found',
        error: 'Not Found'
      }
    }
  })
  async getById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  @ApiExcludeEndpoint()
  @Post()
  async create(@Body() body: Partial<User>): Promise<User> {
    return this.usersService.create(body);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('profileImage', { storage: multer.memoryStorage() }))
  @ApiOperation({ summary: 'Update user profile', description: 'Updates user details and optionally uploads a profile image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileImage: { type: 'string', format: 'binary', description: 'User profile picture' },
        username: { type: 'string', example: 'john_doe' },
        fullName: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        mobileNumber: { type: 'string', example: '1234567890' },
        countryCode: { type: 'string', example: '+1' },
        password: { type: 'string', example: 'newpassword123' },
        nationality: { type: 'string', example: 'American' },
        idType: { type: 'string', example: 'Passport' },
        idNumber: { type: 'string', example: 'A1234567' },
        address1: { type: 'string', example: '123 Main St' },
        address2: { type: 'string', example: 'Apt 4B' },
        city: { type: 'string', example: 'New York' },
        poBox: { type: 'string', example: '10001' },
        country: { type: 'string', example: 'USA' },
        landline: { type: 'string', example: '1234567' },
        trafficType: { type: 'string', example: 'Individual' },
        trafficFileNumber: { type: 'string', example: 'TF123456' },
        plateNumber: { type: 'string', example: 'ABC-1234' },
        issueCity: { type: 'string', example: 'New York' },
        driverLicenseNumber: { type: 'string', example: 'DL12345678' },
        plateCode: { type: 'string', example: 'PC123' },
        plateState: { type: 'string', example: 'NY' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found'
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Email or mobile number already in use',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already in use',
        error: 'Conflict'
      }
    }
  })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<User> {
    console.log(`[UsersController] PUT /users/${id} received`);
    console.log(`[UsersController] Body:`, body);
    console.log(`[UsersController] File:`, file ? { filename: file.originalname, size: file.size } : null);

    // Prevent duplicate email
    if (body.email) {
      const existing = await this.usersService.findByEmail(body.email);
      if (existing && (existing as UserDocument).id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    // Prevent duplicate mobile number if provided
    if (body.mobileNumber) {
      const existingPhone = await this.usersService.findByMobile(body.mobileNumber);
      if (existingPhone && (existingPhone as UserDocument).id !== id) {
        throw new ConflictException('Mobile number already in use');
      }
    }

    const updateData: any = {};

    // Only update fields that are explicitly provided in the DTO
    if (body.fullName !== undefined) updateData.fullName = body.fullName;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.countryCode !== undefined) updateData.countryCode = body.countryCode;
    if (body.mobileNumber !== undefined) updateData.mobileNumber = body.mobileNumber;
    if (body.username !== undefined) updateData.username = body.username;
    if (body.nationality !== undefined) updateData.nationality = body.nationality;
    if (body.idType !== undefined) updateData.idType = body.idType;
    if (body.idNumber !== undefined) updateData.idNumber = body.idNumber;
    if (body.address1 !== undefined) updateData.address1 = body.address1;
    if (body.address2 !== undefined) updateData.address2 = body.address2;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.poBox !== undefined) updateData.poBox = body.poBox;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.landline !== undefined) updateData.landline = body.landline;
    if (body.trafficType !== undefined) updateData.trafficType = body.trafficType;
    if (body.trafficFileNumber !== undefined) updateData.trafficFileNumber = body.trafficFileNumber;
    if (body.plateNumber !== undefined) updateData.plateNumber = body.plateNumber;
    if (body.issueCity !== undefined) updateData.issueCity = body.issueCity;
    if (body.driverLicenseNumber !== undefined) updateData.driverLicenseNumber = body.driverLicenseNumber;
    if (body.plateCode !== undefined) updateData.plateCode = body.plateCode;
    if (body.plateState !== undefined) updateData.plateState = body.plateState;

    console.log(`[UsersController] UpdateData object:`, updateData);

    // Handle password hashing
    if (body.password) {
      updateData.passwordHash = await bcrypt.hash(body.password, 10);
      console.log(`[UsersController] Password hashed and added to updateData`);
    }

    // Handle file upload (upload directly to Cloudinary from memory buffer)
    if (file) {
      const url = await this.cloudinaryService.uploadImage(file);
      updateData.profilePicture = url;
      console.log(`[UsersController] File uploaded to Cloudinary:`, url);
    }

    const updated = await this.usersService.update(id, updateData);
    console.log(`[UsersController] Update result:`, updated);
    if (!updated) throw new NotFoundException(`User with id ${id} not found`);
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.usersService.delete(id);
    if (!deleted) throw new NotFoundException(`User with id ${id} not found`);
    return { message: `User with id ${id} deleted successfully` };
  }
}
