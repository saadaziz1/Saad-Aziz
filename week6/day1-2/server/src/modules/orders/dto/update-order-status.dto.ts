import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../../common/enums/order-status.enum';

/**
 * DTO for updating order status
 */
export class UpdateOrderStatusDto {
    @ApiProperty({ enum: OrderStatus, example: OrderStatus.SHIPPED })
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
