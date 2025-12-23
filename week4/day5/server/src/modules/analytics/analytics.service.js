export class AnalyticsService {
  constructor(userRepo, videoRepo, subscriptionRepo) {
    this.userRepo = userRepo;
    this.videoRepo = videoRepo;
    this.subscriptionRepo = subscriptionRepo;
  }

  async getDashboardStats() {
    const [totalUsers, totalVideos, totalSubscriptions, videosByGenre, usersByRole] = await Promise.all([
      this.userRepo.count(),
      this.videoRepo.count(),
      this.subscriptionRepo.count(),
      this.videoRepo.getGenreStats(),
      this.userRepo.getUsersByRole()
    ]);

    return {
      totalUsers,
      totalVideos,
      totalSubscriptions,
      videosByGenre,
      usersByRole
    };
  }
}