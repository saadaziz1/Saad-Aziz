import { Controller, Get, Param } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private products: ProductsService) { }

  @Get()
  getProducts() {
    return this.products.getProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.products.findById(id);
  }
}
