import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Order, OrderSchema } from '../orders/schema/order.schema';
import { Product, ProductSchema } from '../products/schema/product.schema';
import { RawMaterial, RawMaterialSchema } from '../raw-materials/schema/raw-material.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema },
            { name: Product.name, schema: ProductSchema },
            { name: RawMaterial.name, schema: RawMaterialSchema },
        ]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
