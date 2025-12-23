export class SubscriptionController {
  constructor(subscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  activateFreeTrial = async (req, res) => {
    const subscription = await this.subscriptionService.activateFreeTrial(req.user, req.body.cardDetails);
    res.status(201).json({ success: true, data: subscription });
  };

  activatePaidPlan = async (req, res) => {
    const subscription = await this.subscriptionService.activatePaidPlan(req.user, req.body);
    res.status(201).json({ success: true, data: subscription });
  };

  checkAccess = async (req, res, next) => {
    const subscription = await this.subscriptionService.checkAccess(req.user);
    res.status(200).json({ success: true, data: subscription });
  };

  createSubscription = async (req, res) => {
    const subscription = await this.subscriptionService.activatePaidPlan(req.user, req.body);
    res.status(201).json({ success: true, data: subscription });
  };

  getMySubscription = async (req, res) => {
    const subscription = await this.subscriptionService.getUserSubscription(req.user);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "No subscription found" });
    }
    res.json({ success: true, data: subscription });
  };

  cancelSubscription = async (req, res) => {
    const subscription = await this.subscriptionService.subscriptionRepository.findByUser(req.user.id);
    if (!subscription || subscription.status !== "ACTIVE") {
      return res.status(404).json({ success: false, message: "No active subscription found" });
    }
    await this.subscriptionService.subscriptionRepository.updateByUser(req.user.id, { status: "EXPIRED" });
    res.json({ success: true, message: "Subscription cancelled" });
  };
}
