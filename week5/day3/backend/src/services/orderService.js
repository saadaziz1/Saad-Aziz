const orderRepository = require('../repositories/orderRepository');
const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository');
const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');

const orderService = {
  async placeOrder(userId, orderPayload) {
    const session = await mongoose.startSession();
    let orderId;
    
    try {
      await session.withTransaction(async () => {
        const cart = await cartRepository.getCartByUserId(userId);
        if (!cart || cart.items.length === 0) {
          throw new ApiError(400, 'Cart is empty');
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of cart.items) {
          const product = await productRepository.findById(item.productId);
          if (!product) throw new ApiError(404, `Product ${item.productId} not found`);

          const variant = product.variants.id(item.variantId);
          if (!variant) throw new ApiError(404, 'Variant not found');
          if (variant.stock < item.quantity) {
            throw new ApiError(400, `Insufficient stock for ${product.name}`);
          }

          variant.stock -= item.quantity;
          await product.save({ session });

          const priceAtOrderTime = product.basePrice + variant.priceDiff;
          totalAmount += priceAtOrderTime * item.quantity;

          orderItems.push({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtOrderTime
          });
        }

        const order = await orderRepository.createOrder({
          userId,
          items: orderItems,
          shippingAddress: orderPayload.shippingAddress,
          paymentMethod: orderPayload.paymentMethod,
          totalAmount
        });

        orderId = order._id;
        await cartRepository.clearCart(userId);
      });

      return await orderRepository.findById(orderId);
    } finally {
      await session.endSession();
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new ApiError(404, 'Order not found');

    return await orderRepository.updateById(orderId, { orderStatus: newStatus });
  },

  async getOrdersForUser(userId, pagination) {
    return await orderRepository.getOrdersByUser(userId, pagination);
  },

  async getAllOrders(pagination) {
    const result = await orderRepository.getAllOrders({}, pagination);
    const totalPages = Math.ceil(result.total / pagination.limit);
    return {
      orders: result.orders,
      totalOrders: result.total,
      totalPages,
      currentPage: pagination.page
    };
  }
};

module.exports = orderService;