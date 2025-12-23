import { ApiError } from "../../shared/errors/ApiError.js";
import bcrypt from "bcryptjs";

export class UserService {
  constructor(userRepo, subscriptionService) {
    this.userRepo = userRepo;
    this.subscriptionService = subscriptionService;
  }

  async createUser(data) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new ApiError(400, "Email already exists");

    data.password = await bcrypt.hash(data.password, 10);
    return this.userRepo.create(data);
  }

  async toggleBlockUser(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    return this.userRepo.toggleBlock(userId);
  }

  async toggleRoleUser(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    const newRole = user.role === 'SUPER_ADMIN' ? 'USER' : 'SUPER_ADMIN';
    return this.userRepo.updateById(userId, { role: newRole });
  }

  async listUsers() {
    const users = await this.userRepo.findAll();
    const usersWithSubscriptions = await Promise.all(users.map(async user => {
      const subscription = await this.subscriptionService.subscriptionRepository.findByUser(user._id);
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt,
        subscription: subscription || null
      };
    }));
    return usersWithSubscriptions;
  }

  async getUserById(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    const subscription = await this.subscriptionService.subscriptionRepository.findByUser(user._id);
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      subscription: subscription || null
    };
  }

  async updateUser(userId, updateData) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    return this.userRepo.updateById(userId, updateData);
  }
}
