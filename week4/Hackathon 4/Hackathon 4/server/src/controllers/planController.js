const Plan = require('../models/Plan');
const { sendError, sendSuccess } = require('../utils/response');

const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    sendSuccess(res, 'Plans retrieved successfully', plans);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);
    
    if (!plan || !plan.isActive) {
      return sendError(res, 404, 'Plan not found');
    }

    sendSuccess(res, 'Plan retrieved successfully', plan);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

module.exports = { getAllPlans, getPlanById };