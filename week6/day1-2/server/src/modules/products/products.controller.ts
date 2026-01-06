import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Products')
@Controller('products')
export class ProductsController {

  constructor(private readonly productService: ProductService) { }

  /**
   * Public: get all products with advanced filtering
   */
  @Get()
  findAll(@Query() query: FilterProductsDto) {
    return this.productService.findAll(query);
  }

  /**
   * Public: get product details
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  /**
   * Admin only: create product with images
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 3))
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.create(dto, files);
  }

  /**
   * Admin only: update product
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 3))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    console.log('Update Product DTO:', dto);
    console.log('Update Product Files:', files ? files.length : 0);
    return this.productService.update(id, dto, files);
  }

  /**
   * Admin only: delete product
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  /**
   * Admin only: Update sale status
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/sale-status')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isOnSale: { type: 'boolean', example: true },
        discountPercentage: { type: 'number', example: 20 },
      },
    },
  })
  updateSaleStatus(
    @Param('id') id: string,
    @Body('isOnSale') isOnSale: boolean,
    @Body('discountPercentage') discountPercentage: number,
  ) {
    return this.productService.updateSaleStatus(id, isOnSale, discountPercentage);
  }
}
