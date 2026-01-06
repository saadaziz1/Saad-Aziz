import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFiles, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CarsService } from './cars.service';
import { CreateCarDto, CarResponseDto, FilterOptionsResponseDto } from './dto/create-car.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ErrorResponseDto } from '../auth/dto/auth.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Types } from 'mongoose';

@ApiTags('Cars')
@UseGuards(JwtAuthGuard)
@Controller('cars')
export class CarsController {
  constructor(
    private readonly carsService: CarsService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('photos', 6))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new car for auction', description: 'Upload car details and up to 6 photos' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photos: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Max 6 photos',
        },
        title: { type: 'string', example: '2022 BMW M4' },
        description: { type: 'string', example: 'Well maintained car' },
        make: { type: 'string', example: 'BMW' },
        model: { type: 'string', example: '3 Series' },
        year: { type: 'number', example: 2022 },
        bodyType: { type: 'string', example: 'coupe' },
        category: { type: 'string', example: 'Sports' },
        startingPrice: { type: 'number', example: 50000 },
        startTime: { type: 'string', format: 'date-time', example: '2025-01-01T10:00:00Z' },
        endTime: { type: 'string', format: 'date-time', example: '2025-01-02T10:00:00Z' },
        vin: { type: 'string', example: '1A2B3C4D5E6F7G8H9' },
        mileage: { type: 'number', example: 15000 },
        engineSize: { type: 'string', example: '8' },
        paint: { type: 'string', example: 'Original Paint' },
        gccSpecs: { type: 'string', example: 'yes' },
        accidentHistory: { type: 'string', example: 'no' },
        serviceHistory: { type: 'string', example: 'yes' },
        modified: { type: 'string', example: 'stock' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Car created successfully' })
  async create(
    @Body() createCarDto: CreateCarDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ) {
    let photoUrls: string[] = [];

    if (files && files.length > 0) {
      if (files.length > 6) {
        throw new Error('Maximum 6 photos allowed');
      }
      photoUrls = await this.cloudinaryService.uploadMultipleImages(files);
    }

    return this.carsService.create({
      ...createCarDto,
      sellerId: new Types.ObjectId(req.user.userId),
      photos: photoUrls,
    });
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all cars with optional filters' })
  @ApiQuery({ name: 'make', required: false, example: 'BMW' })
  @ApiQuery({ name: 'model', required: false, example: 'M4' })
  @ApiQuery({ name: 'year', required: false, example: '2022' })
  @ApiQuery({ name: 'minPrice', required: false, example: '10000' })
  @ApiQuery({ name: 'maxPrice', required: false, example: '100000' })
  @ApiResponse({
    status: 200,
    description: 'Return filtered list of cars',
    type: [CarResponseDto]
  })
  findAll(
    @Query('make') make?: string,
    @Query('model') model?: string,
    @Query('year') year?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.carsService.findAll({ make, model, year, minPrice, maxPrice });
  }

  @Public()
  @Get('filters/options')
  @ApiOperation({ summary: 'Get available filter options (makes, models, etc.)' })
  @ApiResponse({
    status: 200,
    description: 'Return filter options',
    type: FilterOptionsResponseDto
  })
  getFilterOptions() {
    return this.carsService.getFilterOptions();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get car by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return car details',
    type: CarResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Car not found',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 404,
        message: 'Car with ID 507f1f77bcf86cd799439011 not found',
        error: 'Not Found'
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }
}
