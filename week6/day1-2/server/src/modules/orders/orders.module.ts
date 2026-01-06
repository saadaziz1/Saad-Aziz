import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';

@Module({
  imports: [
    /**
     * Register Order schema
     */
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
    ]),
    CartModule,
    ProductsModule,
    UsersModule,
    LoyaltyModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
