import Subscription from "./subscription.model.js";

export class SubscriptionRepository {
  create(data) {
    return Subscription.create(data);
  }

  findByUser(userId) {
    return Subscription.findOne({ user: userId });
  }

  updateByUser(userId, update) {
    return Subscription.findOneAndUpdate({ user: userId }, update, { new: true });
  }

  count() {
    return Subscription.countDocuments({ status: 'ACTIVE' });
  }
}
