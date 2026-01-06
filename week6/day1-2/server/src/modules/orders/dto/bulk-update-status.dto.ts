import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { OrderStatus } from '../../../common/enums/order-status.enum';

export class BulkUpdateStatusDto {
    @ApiProperty({ example: ['65f1a2b3c4d5e6f7a8b9c0d1'], description: 'Array of order IDs' })
    @IsArray()
    @IsString({ each: true })
    orderIds: string[];

    @ApiProperty({ enum: OrderStatus, example: OrderStatus.SHIPPED })
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
