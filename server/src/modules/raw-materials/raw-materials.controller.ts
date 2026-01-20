import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RawMaterialService } from './raw-materials.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';

// guards assumed to exist
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';


@ApiTags('Raw Materials')
@ApiBearerAuth()
@Controller('raw-materials')
@UseGuards(JwtAuthGuard)
export class RawMaterialController {
  constructor(private readonly service: RawMaterialService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new raw material' })
  @ApiResponse({ status: 201, description: 'Raw material created successfully' })
  @ApiResponse({ status: 400, description: 'Raw material already exists' })
  create(@Body() dto: CreateRawMaterialDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all raw materials' })
  @ApiResponse({ status: 200, description: 'Return all raw materials' })
  findAll() {
    return this.service.findAll();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get raw materials with low stock' })
  @ApiResponse({ status: 200, description: 'Return low stock raw materials' })
  lowStock() {
    return this.service.lowStock();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a raw material by ID' })
  @ApiResponse({ status: 200, description: 'Return the raw material' })
  @ApiResponse({ status: 404, description: 'Raw material not found' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a raw material' })
  @ApiResponse({ status: 200, description: 'Raw material updated successfully' })
  @ApiResponse({ status: 404, description: 'Raw material not found' })
  update(@Param('id') id: string, @Body() dto: UpdateRawMaterialDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Update stock quantity' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  @ApiResponse({ status: 404, description: 'Raw material not found' })
  updateStock(
    @Param('id') id: string,
    @Body() dto: UpdateStockDto,
  ) {
    return this.service.updateStock(id, dto.adjustment);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a raw material' })
  @ApiResponse({ status: 200, description: 'Raw material deleted successfully' })
  @ApiResponse({ status: 404, description: 'Raw material not found' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
