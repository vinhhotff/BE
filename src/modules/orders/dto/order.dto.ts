import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../schemas/order.schema';

export class CreateOrderDto {
  // Order will be created from cart, so no additional fields needed
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, description: 'Order status' })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Payment ID from payment gateway' })
  @IsString()
  paymentId: string;

  @ApiProperty({ description: 'Order ID to update' })
  @IsString()
  orderId: string;
}

