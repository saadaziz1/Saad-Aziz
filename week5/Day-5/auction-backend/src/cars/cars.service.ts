// cars.service.ts
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { MAKE_MODEL_MAP } from './enums';

@Injectable()
export class CarsService {
  private readonly logger = new Logger(CarsService.name);

  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private readonly notificationsGateway: NotificationsGateway,
  ) { }

  async create(car: Partial<Car>) {
    const carData = {
      ...car,
      currentPrice: car.startingPrice || 0,
    };
    const newCar = new this.carModel(carData);
    if (!MAKE_MODEL_MAP[newCar.make]?.includes(newCar.model)) {
      throw new BadRequestException(
        `Model "${newCar.model}" does not belong to make "${newCar.make}"`
      );
    }
    const savedCar = await newCar.save();

    // 🔔 Confirm notification trigger
    try {
      const title = `${savedCar.year} ${savedCar.make} ${savedCar.model}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await this.notificationsGateway.notifyAllAuctionStart((savedCar as any)._id.toString(), title);
      this.logger.log(`Triggered start notification for auction ${(savedCar as any)._id}`);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      this.logger.error(`Failed to trigger start notification: ${errorMessage}`);
    }

    return savedCar;
  }

  async findAll(filters?: {
    make?: string;
    model?: string;
    year?: string;
    minPrice?: string;
    maxPrice?: string;
  }) {
    await this.updateExpiredAuctions();

    const query: any = {};

    if (filters?.make) query.make = new RegExp(filters.make, 'i');
    if (filters?.model) query.model = new RegExp(filters.model, 'i');
    if (filters?.year) query.year = parseInt(filters.year);

    if (filters?.minPrice || filters?.maxPrice) {
      query.currentPrice = {};
      if (filters.minPrice) query.currentPrice.$gte = parseInt(filters.minPrice);
      if (filters.maxPrice) query.currentPrice.$lte = parseInt(filters.maxPrice);
    }

    return this.carModel.find(query).populate('sellerId').populate('bids').exec();
  }

  async getFilterOptions() {
    const makes = await this.carModel.distinct('make');
    const models = await this.carModel.distinct('model');
    const years = await this.carModel.distinct('year');

    return {
      makes: makes.filter(Boolean),
      models: models.filter(Boolean),
      years: years.filter(Boolean).sort((a, b) => b - a),
    };
  }

  async findOne(id: string) {
    // Update expired auctions before returning
    await this.updateExpiredAuctions();
    return this.carModel
      .findById(id)
      .populate('sellerId')
      .populate('bids')
      .exec();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateExpiredAuctions() {
    const now = new Date();

    // Find auctions that are about to be closed
    const auctionsToClose = await this.carModel.find({
      endTime: { $lte: now },
      isCompleted: false
    });

    if (auctionsToClose.length === 0) return;

    this.logger.log(`Found ${auctionsToClose.length} expired auctions. Closing...`);

    for (const auction of auctionsToClose) {
      auction.isCompleted = true;
      await auction.save();

      // 🔔 Trigger End Notification
      try {
        const title = `${auction.year} ${auction.make} ${auction.model}`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await this.notificationsGateway.notifyAllAuctionEnd((auction as any)._id.toString(), title);
        this.logger.log(`Triggered end notification for auction ${(auction as any)._id}`);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        this.logger.error(`Failed to trigger end notification for ${(auction as any)._id}: ${errorMessage}`);
      }
    }
  }
}