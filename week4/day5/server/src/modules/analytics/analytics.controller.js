export class AnalyticsController {
  constructor(analyticsService) {
    this.analyticsService = analyticsService;
  }

  getDashboardStats = async (req, res) => {
    const stats = await this.analyticsService.getDashboardStats();
    res.json({ success: true, data: stats });
  };
}