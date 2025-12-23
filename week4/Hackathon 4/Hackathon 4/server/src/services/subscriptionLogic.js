const User = require('../models/User');
const Plan = require('../models/Plan');
const Card = require('../models/Card');
const { encrypt } = require('../utils/encrypt');

const checkSubscriptionStatus = async (userId) => {
  try {
    const user = await User.findById(userId).populate('subscription.planId');
    
    if (!user.subscription.isActive) {
      return { isActive: false, message: 'No active subscription' };
    }

    const currentDate = new Date();
    const endDate = new Date(user.subscription.endDate);

    if (currentDate > endDate) {
      user.subscription.isActive = false;
      await user.save();
      return { isActive: false, message: 'Subscription expired' };
    }

    return { 
      isActive: true, 
      message: 'Subscription active',
      plan: user.subscription.planId,
      remainingDays: getRemainingDays(endDate)
    };
  } catch (error) {
    throw new Error('Error checking subscription status');
  }
};

const activateFreeTrial = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (user.subscription.isActive || user.subscription.isTrial) {
      throw new Error('User already has active subscription or used trial');
    }

    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days trial

    user.subscription = {
      isActive: true,
      isTrial: true,
      startDate: new Date(),
      endDate: trialEndDate
    };

    await user.save();
    return { success: true, message: 'Free trial activated', endDate: trialEndDate };
  } catch (error) {
    throw error;
  }
};

const subscribeToPlan = async (userId, planId, cardDetails) => {
  try {
    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);
    
    if (!plan || !plan.isActive) {
      throw new Error('Invalid or inactive plan');
    }

    // Store encrypted card details
    const encryptedCard = new Card({
      userId,
      cardNumber: encrypt(cardDetails.cardNumber),
      expiryDate: encrypt(cardDetails.expiryDate),
      cvv: encrypt(cardDetails.cvv),
      cardHolderName: cardDetails.cardHolderName
    });
    await encryptedCard.save();

    // Activate subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    user.subscription = {
      planId,
      isActive: true,
      isTrial: false,
      startDate,
      endDate
    };

    await user.save();
    return { 
      success: true, 
      message: 'Subscription activated successfully',
      plan: plan.name,
      endDate 
    };
  } catch (error) {
    throw error;
  }
};

const getRemainingDays = (endDate) => {
  const currentDate = new Date();
  const end = new Date(endDate);
  const timeDiff = end.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff > 0 ? daysDiff : 0;
};

const canAccessPremiumContent = async (userId) => {
  try {
    const status = await checkSubscriptionStatus(userId);
    return status.isActive;
  } catch (error) {
    return false;
  }
};

module.exports = { 
  checkSubscriptionStatus, 
  activateFreeTrial,
  subscribeToPlan,
  getRemainingDays, 
  canAccessPremiumContent 
};