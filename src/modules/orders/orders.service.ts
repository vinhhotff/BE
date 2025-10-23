import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { UpdateOrderStatusDto, ProcessPaymentDto } from './dto/order.dto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
  ) {}

  async createOrder(userId: string): Promise<OrderDocument> {
    const cart = await this.cartService.getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Transform cart items to order items
    const orderItems = cart.items.map((item: any) => ({
      productId: item.productId._id,
      productName: item.productId.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      products: orderItems,
      totalAmount: cart.totalAmount,
      status: OrderStatus.UNPAID,
    });

    // Clear cart after creating order
    await this.cartService.clearCart(userId);

    return order;
  }

  async findAll(userId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(userId: string, orderId: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findOne({
        _id: new Types.ObjectId(orderId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderDocument> {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = updateOrderStatusDto.status;
    await order.save();

    return order;
  }

  async processPayment(
    userId: string,
    processPaymentDto: ProcessPaymentDto,
  ): Promise<OrderDocument> {
    const { orderId, paymentId } = processPaymentDto;

    const order = await this.findOne(userId, orderId);

    if (order.status === OrderStatus.PAID) {
      throw new BadRequestException('Order is already paid');
    }

    order.status = OrderStatus.PAID;
    order.paymentId = paymentId;
    order.paidAt = new Date();

    await order.save();

    return order;
  }

  async cancelOrder(userId: string, orderId: string): Promise<OrderDocument> {
    const order = await this.findOne(userId, orderId);

    if (order.status === OrderStatus.PAID) {
      throw new BadRequestException('Cannot cancel paid order');
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    return order;
  }
}

