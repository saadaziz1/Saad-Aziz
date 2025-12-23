const { canAccessPremiumContent } = require('../services/subscriptionLogic');
const { sendError } = require('../utils/response');

const checkPremiumAccess = async (req, res, next) => {
  try {
    const hasAccess = await canAccessPremiumContent(req.user.id);
    
    if (!hasAccess) {
      return sendError(res, 403, 'Premium subscription required to access this content');
    }
    
    next();
  } catch (error) {
    sendError(res, 500, 'Error checking subscription status');
  }
};

module.exports = { checkPremiumAccess };