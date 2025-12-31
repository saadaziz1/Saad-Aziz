import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @ApiExcludeEndpoint()
  @Post()
  @ApiOperation({ summary: 'Create a new payment/delivery record' })
  @ApiResponse({ status: 201, description: 'Payment record created successfully' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @ApiExcludeEndpoint()
  @Get()
  @ApiOperation({ summary: 'Get all payment records' })
  @ApiResponse({ status: 200, description: 'Return list of all payments' })
  findAll() {
    return this.paymentsService.findAll();
  }
}
