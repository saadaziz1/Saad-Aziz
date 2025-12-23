const User = require('../models/User');
const { activateFreeTrial, subscribeToPlan, checkSubscriptionStatus } = require('../services/subscriptionLogic');
const { sendError, sendSuccess } = require('../utils/response');
const { validationResult } = require('express-validator');

const activateFreeTrialController = async (req, res) => {
  try {
    const result = await activateFreeTrial(req.user.id);
    sendSuccess(res, result.message, { endDate: result.endDate });
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const subscribeToPlanController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, errors.array()[0].msg);
    }

    const { planId, cardNumber, expiryDate, cvv, cardHolderName } = req.body;
    const cardDetails = { cardNumber, expiryDate, cvv, cardHolderName };
    
    const result = await subscribeToPlan(req.user.id, planId, cardDetails);
    sendSuccess(res, result.message, { plan: result.plan, endDate: result.endDate });
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

const getSubscriptionStatus = async (req, res) => {
  try {
    const status = await checkSubscriptionStatus(req.user.id);
    sendSuccess(res, 'Subscription status retrieved', status);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

module.exports = { 
  activateFreeTrial: activateFreeTrialController, 
  subscribeToPlan: subscribeToPlanController, 
  getSubscriptionStatus 
};