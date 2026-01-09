import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
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
import { CheckoutDto } from './dto/checkout.dto';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class OrdersService {

  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private productService: ProductService,
    private usersService: UsersService,
    private loyaltyService: LoyaltyService,
    @Inject(forwardRef(() => PaymentsService))
    private paymentsService: PaymentsService,
  ) { }

  async placeOrder(userId: string, checkoutData: CheckoutDto) {
    console.log('OrdersService.placeOrder - Starting for user:', userId);

    const user = await this.usersService.findById(userId);
    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException('Admins and Super Admins are not allowed to place orders');
    }

    // Idempotency check for Stripe payments
    if (checkoutData.paymentIntentId) {
      const existingOrder = await this.orderModel.findOne({
        'paymentInfo.stripePaymentIntentId': checkoutData.paymentIntentId
      });
      if (existingOrder) {
        console.log(`Order for PaymentIntent ${checkoutData.paymentIntentId} already exists. Returning existing order.`);
        return existingOrder;
      }
    }

    const cart = await this.cartService.getUserCart(userId);
    if (!cart || !cart.items.length) {
      console.error(`OrdersService.placeOrder - Cart is empty for user ${userId}`);
      throw new BadRequestException('Cart is empty');
    }

    let totalAmountMoney = 0;
    let totalPointsToSpend = 0;
    const pointsUsedAsDiscount = checkoutData?.usePoints || 0;

    const orderItems: any[] = [];

    for (const item of cart.items) {
      if (!item.productId) {
        console.warn(`Product missing for item in cart. Skipping...`);
        continue;
      }
      const prodId = (item.productId as any)._id || item.productId;
      const product: ProductDocument = await this.productService.findById(prodId.toString());

      if (product.stock < item.quantity) {
        console.error(`OrdersService.placeOrder - Insufficient stock for ${product.name}. Stock: ${product.stock}, Requested: ${item.quantity}`);
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
      console.error(`OrdersService.placeOrder - Insufficient loyalty points. Have: ${user.loyaltyPoints}, Need: ${totalPointsNeeded}`);
      throw new BadRequestException(`Insufficient loyalty points. Have: ${user.loyaltyPoints}, Need: ${totalPointsNeeded}`);
    }

    // Determine initial status
    let initialStatus = OrderStatus.PENDING;

    // Check Stripe status directly to handle race condition (Webhook firing before Order creation)
    if (checkoutData.paymentIntentId) {
      try {
        const intent = await this.paymentsService.getPaymentIntent(checkoutData.paymentIntentId);
        if (intent.status === 'succeeded') {
          console.log(`PaymentIntent ${checkoutData.paymentIntentId} is already succeeded. Marking order as PAID.`);
          initialStatus = OrderStatus.PAID;
        }
      } catch (err) {
        console.error('Failed to verify payment intent status:', err);
      }
    } else if (checkoutData.paymentMethod === 'points' && finalAmountToPay === 0) {
      initialStatus = OrderStatus.PAID;
    }
    // NOTE: If paying with card, status is PENDING until webhook (or above check).

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
      status: initialStatus,
      shippingAddress: checkoutData ? {
        firstName: checkoutData.firstName,
        email: checkoutData.email,
        address: checkoutData.address,
        city: checkoutData.city,
        postalCode: checkoutData.postalCode,
        phone: checkoutData.phone,
      } : undefined,
      paymentInfo: checkoutData ? {
        method: checkoutData.paymentMethod || 'card',
        cardHolderName: checkoutData.cardHolderName,
        cardNumber: checkoutData.cardNumber ? `**** **** **** ${checkoutData.cardNumber.slice(-4)}` : undefined, // Masking
        expiryDate: checkoutData.expiryDate,
        stripePaymentIntentId: checkoutData.paymentIntentId,
      } : undefined,
    });

    // If already PAID (Points only), trigger success logic immediately
    if (initialStatus === OrderStatus.PAID) {
      try {
        await this.processPaymentSuccess(order);
      } catch (error) {
        console.error('Failed to process payment success logic:', error);
      }
    }

    await this.cartService.clearCart(userId);
    return order;
  }

  /**
   * Update order status via Webhook
   */
  async updateStatusByPaymentIntent(intentId: string, status: OrderStatus): Promise<void> {
    const order = await this.orderModel.findOne({ 'paymentInfo.stripePaymentIntentId': intentId });
    if (!order) {
      console.warn(`Order not found for PaymentIntent: ${intentId}`);
      return;
    }

    console.log(`Updating order ${order._id} status to ${status} via webhook`);

    if (order.status === status) return;

    if (status === OrderStatus.PAID && order.status !== OrderStatus.PAID) {
      await this.processPaymentSuccess(order);
      order.status = OrderStatus.PAID;
      await order.save();
    } else if (status === OrderStatus.CANCELLED) {
      // If it was somehow PAID before, we might need refund? Unlikely for webhook sequence unless dispute.
      // Usually this happens if payment failed.
      order.status = status; // Just update status
      await order.save();
    }
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
    console.log(`Processing refund for order ${order._id}`);

    // 1. Stripe Refund
    if (order.paymentInfo?.method === 'card' && order.paymentInfo?.stripePaymentIntentId) {
      try {
        console.log('Refunding Stripe Payment:', order.paymentInfo.stripePaymentIntentId);
        await this.paymentsService.refundPayment(order.paymentInfo.stripePaymentIntentId);
      } catch (error) {
        console.error('Stripe Refund Failed:', error);
        // We continue to revert points/internal state even if Stripe fails? 
        // Or throw? Admin should know.
        throw new InternalServerErrorException('Stripe Refund Failed: ' + error.message);
      }
    }

    // 2. Return spent points
    if (order.pointsUsed > 0) {
      await this.loyaltyService.createEntry(
        order.userId,
        LedgerType.REFUND,
        order.pointsUsed,
        `Points returned from cancelled order #${order._id}`,
        order._id,
      );
    }

    // 3. Reverse earned points
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
