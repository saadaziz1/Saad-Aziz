const User = require('../models/user.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');

const dashboardService = {
  async getAnalytics() {
    const [
      totalUsers,
      totalOrders,
      revenue,
      lowStockProducts,
      topSellingProducts
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Product.aggregate([
        { $unwind: '$variants' },
        { $match: { 'variants.stock': { $lt: 10 } } },
        { $project: { name: 1, 'variants.name': 1, 'variants.stock': 1 } },
        { $limit: 10 }
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { 
          _id: '$items.productId', 
          totalSold: { $sum: '$items.quantity' } 
        }},
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        { $lookup: { 
          from: 'products', 
          localField: '_id', 
          foreignField: '_id', 
          as: 'product' 
        }},
        { $unwind: '$product' },
        { $project: { 
          name: '$product.name', 
          totalSold: 1 
        }}
      ])
    ]);

    return {
      totalUsers,
      totalOrders,
      revenue: revenue[0]?.total || 0,
      lowStockProducts,
      topSellingProducts
    };
  }
};

module.exports = dashboardService;