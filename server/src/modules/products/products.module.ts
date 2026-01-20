import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schema/product.schema';
import { RawMaterial, RawMaterialSchema } from '../raw-materials/schema/raw-material.schema';

import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: RawMaterial.name, schema: RawMaterialSchema },
        ]),
        CloudinaryModule,
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule { }
