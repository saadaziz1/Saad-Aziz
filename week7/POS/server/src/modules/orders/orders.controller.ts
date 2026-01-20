import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid data or insufficient stock' })
    create(@Body() createOrderDto: CreateOrderDto, @GetUser('userId') userId: string) {
        return this.ordersService.create(createOrderDto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all orders' })
    @ApiResponse({ status: 200, description: 'Return all orders' })
    findAll() {
        return this.ordersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an order by ID' })
    @ApiResponse({ status: 200, description: 'Return the order' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }
}
