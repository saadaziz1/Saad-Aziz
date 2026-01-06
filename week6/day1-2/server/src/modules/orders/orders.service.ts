import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { ProductDocument } from '../products/schemas/product.schema';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { Role } from '../../common/enums/role.enum';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { LedgerType } from '../loyalty/schemas/loyalty-ledger.schema';

@Injectable()
export class OrdersService {

  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private productService: ProductService,
    private usersService: UsersService,
    private loyaltyService: LoyaltyService,
  ) { }

  async placeOrder(userId: string, checkoutData?: any) {
    console.log('OrdersService.placeOrder - Starting for user:', userId);

    const user = await this.usersService.findById(userId);
    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
      throw new BadRequestException('Administrators cannot place orders');
    }

    const cart = await this.cartService.getUserCart(userId);
    if (!cart || !cart.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    let totalAmountMoney = 0;
    let totalPointsToSpend = 0;
    const pointsUsedAsDiscount = checkoutData?.usePoints || 0;

    const orderItems: any[] = [];

    for (const item of cart.items) {
      const prodId = (item.productId as any)._id || item.productId;
      const product: ProductDocument = await this.productService.findById(prodId.toString());

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }

      // Determine payment method for this item
      let paidWithPoints = false;
      if (product.purchaseType === 'POINTS_ONLY') {
        paidWithPoints = true;
      } else if (product.purchaseType === 'HYBRID') {
        // For hybrid, we trust the choice made in cart/checkout
        paidWithPoints = item.payWithPoints === true;
      } else {
        paidWithPoints = false; // MONEY_ONLY
      }

      if (paidWithPoints) {
        totalPointsToSpend += (product.pointsPrice || 0) * item.quantity;
      } else {
        const discount = product.isOnSale ? product.price * (product.discountPercentage / 100) : 0;
        totalAmountMoney += (product.price - discount) * item.quantity;
      }

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
        paidWithPoints,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      });

      // Stock is reduced immediately upon placing order (unpaid) to reserve it
      product.stock -= item.quantity;
      product.sales = (product.sales || 0) + item.quantity;
      await product.save();
    }

    // Apply global points discount (1 point = $10)
    const pointsDiscountAmount = Math.min(pointsUsedAsDiscount * 10, totalAmountMoney);
    const finalAmountToPay = Math.max(0, totalAmountMoney - pointsDiscountAmount);

    // Validate point balance
    const totalPointsNeeded = totalPointsToSpend + pointsUsedAsDiscount;
    if (totalPointsNeeded > user.loyaltyPoints) {
      throw new BadRequestException(`Insufficient loyalty points. Have: ${user.loyaltyPoints}, Need: ${totalPointsNeeded}`);
    }

    // Calculate points to be earned (based on final paid amount)
    let pointsToEarn = 0;
    if (finalAmountToPay > 0) {
      if (finalAmountToPay >= 500) pointsToEarn = 30;
      else if (finalAmountToPay >= 200) pointsToEarn = 20;
      else pointsToEarn = 10;
    }

    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      items: orderItems,
      totalAmount: finalAmountToPay,
      pointsUsed: totalPointsNeeded,
      pointsEarned: pointsToEarn,
      status: OrderStatus.PAID,
      shippingAddress: checkoutData ? {
        firstName: checkoutData.firstName,
        email: checkoutData.email,
        address: checkoutData.address,
        city: checkoutData.city,
        postalCode: checkoutData.postalCode,
        phone: checkoutData.phone,
      } : undefined,
    });

    try {
      await this.processPaymentSuccess(order);
    } catch (error) {
      console.error('Failed to process payment success logic:', error);
      // Note: In real app, we might want to rollback or flag for manual review
    }

    await this.cartService.clearCart(userId);
    return order;
  }

  /**
   * Update order status and trigger logic (points, etc.)
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderDocument> {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('Invalid Order ID');
    }
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const previousStatus = order.status;
    if (previousStatus === status) return order;

    // Logic for transitioning to PAID
    if (status === OrderStatus.PAID && previousStatus === OrderStatus.PENDING) {
      await this.processPaymentSuccess(order);
    }
    // Logic for REFUND/CANCEL
    else if (status === OrderStatus.CANCELLED && previousStatus === OrderStatus.PAID) {
      await this.processOrderRefund(order);
    }

    order.status = status;
    return order.save();
  }

  private async processPaymentSuccess(order: OrderDocument) {
    const user = await this.usersService.findById(order.userId.toString());

    // 1. Deduct points spent
    if (order.pointsUsed > 0) {
      await this.loyaltyService.createEntry(
        order.userId,
        LedgerType.SPEND,
        order.pointsUsed,
        `Points spent on order #${order._id}`,
        order._id,
      );
    }

    // 2. Award points earned
    if (order.pointsEarned > 0) {
      await this.loyaltyService.createEntry(
        order.userId,
        LedgerType.EARN,
        order.pointsEarned,
        `Points earned from order #${order._id}`,
        order._id,
      );
    }

    // 3. Update user stats
    user.totalOrders += 1;
    user.totalSpent += order.totalAmount;
    await (user as any).save();
  }

  private async processOrderRefund(order: OrderDocument) {
    // 1. Return spent points
    if (order.pointsUsed > 0) {
      await this.loyaltyService.createEntry(
        order.userId,
        LedgerType.REFUND,
        order.pointsUsed,
        `Points returned from cancelled order #${order._id}`,
        order._id,
      );
    }

    // 2. Reverse earned points
    if (order.pointsEarned > 0) {
      await this.loyaltyService.createEntry(
        order.userId,
        LedgerType.SPEND, // Reversing EARN = SPEND entry with description
        order.pointsEarned,
        `Points reversed for cancelled order #${order._id}`,
        order._id,
      );
    }

    // Update user stats
    const user = await this.usersService.findById(order.userId.toString());
    user.totalOrders = Math.max(0, user.totalOrders - 1);
    user.totalSpent = Math.max(0, user.totalSpent - order.totalAmount);
    await (user as any).save();
  }

  async getAllOrders() {
    return this.orderModel
      .find()
      .populate('items.productId')
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 });
  }

  async getUserOrders(userId: string) {
    // Check if user is admin or super admin
    const user = await this.usersService.findById(userId);
    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
      return this.getAllOrders();
    }

    // Convert string to ObjectId for query
    const userObjectId = new Types.ObjectId(userId);

    const orders = await this.orderModel
      .find({ userId: userObjectId })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    return orders;
  }

  async getOrdersByUserId(targetUserId: string) {
    if (!Types.ObjectId.isValid(targetUserId)) {
      throw new BadRequestException('Invalid User ID');
    }
    return this.orderModel
      .find({ userId: new Types.ObjectId(targetUserId) })
      .populate('items.productId')
      .sort({ createdAt: -1 });
  }
  async getOrderById(orderId: string, userId: string) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('Invalid Order ID');
    }

    const order = await this.orderModel
      .findById(orderId)
      .populate('items.productId')
      .populate('userId', 'name email avatar');

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if user is admin or the owner of the order
    const user = await this.usersService.findById(userId);
    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN && order.userId.toString() !== userId) {
      throw new BadRequestException('Unauthorized access to this order');
    }

    return order;
  }

  async bulkUpdateStatus(orderIds: string[], status: string) {
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      throw new BadRequestException('No order IDs provided');
    }

    const result = await this.orderModel.updateMany(
      { _id: { $in: orderIds.map(id => new Types.ObjectId(id)) } },
      { $set: { status } }
    );

    return result;
  }
}
