const asyncHandler = require('express-async-handler');
const dashboardService = require('../services/dashboardService');

const dashboardController = {
  getAnalytics: asyncHandler(async (req, res) => {
    const analytics = await dashboardService.getAnalytics();
    res.status(200).json({ success: true, analytics });
  })
};

module.exports = dashboardController;