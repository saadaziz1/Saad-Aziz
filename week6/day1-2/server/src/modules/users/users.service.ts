import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) { }

  /** Create user (used by Auth module) */
  async createUser(dto: CreateUserDto, hashedPassword: string) {
    return this.userModel.create({
      ...dto,
      password: hashedPassword,
    });
  }

  /** Find user by email */
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  /** Find user by ID */
  async findById(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid User ID');
    }
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
   
    return user;
  }

  /** Update own profile */
  async updateProfile(userId: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(
      userId,
      data,
      { new: true },
    );
  }

  /** Add loyalty points */
  async addLoyaltyPoints(userId: string, points: number) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: points } },
      { new: true },
    );
  }

  /** Deduct loyalty points */
  async deductLoyaltyPoints(userId: string, points: number) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: -points } },
      { new: true },
    );
  }

  /** Admin: get all users */
  async findAll() {
    return this.userModel.find();
  }

  /** Admin: toggle user active status */
  async toggleStatus(userId: string) {
    const user = await this.findById(userId);
    user.isActive = !user.isActive;
    return user.save();
  }

  /** Super Admin: change role */
  async changeRole(userId: string, role: Role) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    );
  }
}
