import { Controller, Get, Param } from '@nestjs/common';
import { HygraphService } from './hygraph.service';

@Controller('hygraph')
export class HygraphController {
  constructor(private readonly hygraphService: HygraphService) { }

  @Get('products')
  async getProducts() {
    return this.hygraphService.getProducts();
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return this.hygraphService.getProductById(id);
  }
}
