import { ApiError } from "../../shared/errors/ApiError.js";
import bcrypt from "bcryptjs";

export class SubscriptionService {
  constructor(subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async activateFreeTrial(user, cardDetails) {
    const existing = await this.subscriptionRepository.findByUser(user.id);
    if (existing) throw new ApiError(400, "User already has a subscription");

    if (!cardDetails) throw new ApiError(400, "Card details required for free trial");

    const encryptedCard = {
      cardNumber: await bcrypt.hash(cardDetails.cardNumber, 10),
      expiryMonth: parseInt(cardDetails.expiryDate.split('/')[0]),
      expiryYear: parseInt('20' + cardDetails.expiryDate.split('/')[1]),
      cvv: await bcrypt.hash(cardDetails.cvv, 10)
    };

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const subscription = await this.subscriptionRepository.create({
      user: user.id,
      plan: "FREE_TRIAL",
      cardDetails: encryptedCard,
      status: "ACTIVE",
      startDate: new Date(),
      endDate
    });

    return subscription;
  }

  async activatePaidPlan(user, planData) {
    const existing = await this.subscriptionRepository.findByUser(user.id);
    
    const encryptedCard = {
      cardNumber: await bcrypt.hash(planData.cardDetails.cardNumber, 10),
      expiryMonth: parseInt(planData.cardDetails.expiryDate.split('/')[0]),
      expiryYear: parseInt('20' + planData.cardDetails.expiryDate.split('/')[1]),
      cvv: await bcrypt.hash(planData.cardDetails.cvv, 10)
    };

    const endDate = new Date();
    if (planData.period === 'year') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const planName = planData.planId.toUpperCase();

    if (existing) {
      return await this.subscriptionRepository.updateByUser(user.id, {
        plan: planName,
        cardDetails: encryptedCard,
        status: "ACTIVE",
        startDate: new Date(),
        endDate
      });
    }

    return await this.subscriptionRepository.create({
      user: user.id,
      plan: planName,
      cardDetails: encryptedCard,
      status: "ACTIVE",
      startDate: new Date(),
      endDate
    });
  }

  async checkAccess(user) {
    const subscription = await this.subscriptionRepository.findByUser(user.id);
    if (!subscription || subscription.status !== "ACTIVE") {
      throw new ApiError(403, "Subscription required to access this content");
    }

    const now = new Date();
    if (subscription.endDate && subscription.endDate < now) {
      await this.subscriptionRepository.updateByUser(user.id, { status: "EXPIRED" });
      throw new ApiError(403, "Subscription expired");
    }

    return subscription;
  }

  async getUserSubscription(user) {
    return await this.subscriptionRepository.findByUser(user.id);
  }
}
