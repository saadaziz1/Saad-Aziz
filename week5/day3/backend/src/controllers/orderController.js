const asyncHandler = require('express-async-handler');
const orderService = require('../services/orderService');

const orderController = {
  placeOrder: asyncHandler(async (req, res) => {
    const order = await orderService.placeOrder(req.user.id, req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Order placed',
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        status: order.orderStatus
      }
    });
  }),

  getUserOrders: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await orderService.getOrdersForUser(req.user.id, { page, limit });
    res.status(200).json({ success: true, ...result });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json({ success: true, order });
  }),

  getAllOrders: asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const result = await orderService.getAllOrders({ page: Number(page), limit: Number(limit) });
    res.status(200).json({ success: true, ...result });
  })
};

module.exports = orderController;