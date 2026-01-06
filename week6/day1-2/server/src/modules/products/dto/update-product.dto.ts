import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/**
 * PartialType makes all fields optional
 * Used for update operations
 */
export class UpdateProductDto extends PartialType(CreateProductDto) { }
