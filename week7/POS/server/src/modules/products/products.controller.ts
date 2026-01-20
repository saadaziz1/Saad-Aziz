import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import { memoryStorage } from 'multer';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid data or raw material not found' })
    create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFile() image: Express.Multer.File
    ) {
        return this.productsService.create(createProductDto, image);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiQuery({ name: 'category', required: false })
    @ApiResponse({ status: 200, description: 'Return all products' })
    findAll(@Query('category') category?: string) {
        return this.productsService.findAll({ category });
    }

    @Get('by-material/:materialId')
    @ApiOperation({ summary: 'Get products by raw material ID' })
    @ApiResponse({ status: 200, description: 'Return products using the material' })
    findByMaterial(@Param('materialId') materialId: string) {
        return this.productsService.findByRawMaterial(materialId);
    }

    @Patch('deactivate-by-material/:materialId')
    @ApiOperation({ summary: 'Deactivate products by raw material ID' })
    @ApiResponse({ status: 200, description: 'Products deactivated successfully' })
    deactivateByMaterial(@Param('materialId') materialId: string) {
        return this.productsService.deactivateByRawMaterial(materialId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a product by ID' })
    @ApiResponse({ status: 200, description: 'Return the product' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update a product' })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFile() image?: Express.Multer.File
    ) {
        return this.productsService.update(id, updateProductDto, image);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
