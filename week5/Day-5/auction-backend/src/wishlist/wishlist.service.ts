import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { Types } from 'mongoose';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
  ) {}

  async addToWishlist(userId: string, carId: string) {
    let wishlist = await this.wishlistModel.findOne({ userId: new Types.ObjectId(userId) });
    
    if (!wishlist) {
      wishlist = new this.wishlistModel({ userId: new Types.ObjectId(userId), carIds: [] });
    }
    
    const carObjectId = new Types.ObjectId(carId);
    if (!wishlist.carIds.includes(carObjectId)) {
      wishlist.carIds.push(carObjectId);
      await wishlist.save();
    }
    
    return wishlist;
  }

  async removeFromWishlist(userId: string, carId: string) {
    const wishlist = await this.wishlistModel.findOne({ userId: new Types.ObjectId(userId) });
    
    if (wishlist) {
      wishlist.carIds = wishlist.carIds.filter(id => !id.equals(new Types.ObjectId(carId)));
      await wishlist.save();
    }
    
    return wishlist;
  }

  async getUserWishlist(userId: string) {
    return this.wishlistModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('carIds')
      .exec();
  }

  create(wishlist: Partial<Wishlist>) {
    const newWishlist = new this.wishlistModel(wishlist);
    return newWishlist.save();
  }

  findAll() {
    return this.wishlistModel
      .find()
      .populate('userId')
      .populate('carIds')
      .exec();
  }
}
