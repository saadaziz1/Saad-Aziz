const Order = require('../models/order.model');

const orderRepository = {
  async createOrder(payload) {
    return await Order.create(payload);
  },

  async getOrdersByUser(userId, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments({ userId });
    
    return { orders, total };
  },

  async getAllOrders(filters = {}, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(filters)
      .populate('userId', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(filters);
    
    return { orders, total };
  },

  async findById(id) {
    return await Order.findById(id)
      .populate('userId', 'name email')
      .populate('items.productId');
  },

  async updateById(id, payload) {
    return await Order.findByIdAndUpdate(id, payload, { new: true });
  }
};

module.exports = orderRepository;