import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { BulkUpdateStatusDto } from './dto/bulk-update-status.dto';
import { CheckoutDto } from './dto/checkout.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {

  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch('bulk-status')
  @ApiOperation({ summary: 'Bulk update order status (Admin or Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Orders updated successfully.' })
  bulkUpdateStatus(
    @Body() dto: BulkUpdateStatusDto,
  ) {
    return this.ordersService.bulkUpdateStatus(dto.orderIds, dto.status);
  }

  /**
   * Admin only: Update order status
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (Admin or Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully.' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto.status as any);
  }

  /**
   * Place an order using cart with checkout data
   */
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Post()
  @ApiOperation({ summary: 'Place a new order (User only)' })
  @ApiResponse({ status: 201, description: 'Order placed successfully.' })
  @ApiResponse({ status: 403, description: 'Admins and Super Admins cannot place orders.' })
  placeOrder(@Request() req, @Body() checkoutData: CheckoutDto) {
    return this.ordersService.placeOrder(req.user.userId, checkoutData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiResponse({ status: 200, description: 'Order details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({ status: 403, description: 'Unauthorized access to this order.' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.ordersService.getOrderById(id, req.user.userId);
  }

  /**
   * Get logged-in user's orders
   */
  @Get()
  @ApiOperation({
    summary: 'Get current user orders',
    description: 'Retrieves all orders for the logged-in user. If the user is an Admin or Super Admin, it returns all orders in the system.'
  })
  @ApiResponse({ status: 200, description: 'Return list of orders.' })
  getOrders(@Request() req) {
    console.log('OrdersController.getOrders - User ID:', req.user.userId);
    return this.ordersService.getUserOrders(req.user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get orders for a specific user (Admin or Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Return list of user orders.' })
  getOrdersForUser(@Param('userId') userId: string) {
    return this.ordersService.getOrdersByUserId(userId);
  }
}
