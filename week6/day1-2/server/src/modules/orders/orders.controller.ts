import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {

  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch('bulk-status')
  bulkUpdateStatus(
    @Body() body: { orderIds: string[]; status: string },
  ) {
    return this.ordersService.bulkUpdateStatus(body.orderIds, body.status);
  }

  /**
   * Admin only: Update order status
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto.status as any);
  }

  /**
   * Place an order using cart with checkout data
   */
  @Post()
  placeOrder(@Req() req, @Body() checkoutData?: any) {
    return this.ordersService.placeOrder(req.user.userId, checkoutData);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.ordersService.getOrderById(id, req.user.userId);
  }

  /**
   * Get logged-in user's orders
   */
  @Get()
  getOrders(@Req() req) {
    console.log('OrdersController.getOrders - User ID:', req.user.userId);
    return this.ordersService.getUserOrders(req.user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('user/:userId')
  getOrdersForUser(@Param('userId') userId: string) {
    return this.ordersService.getOrdersByUserId(userId);
  }
}
