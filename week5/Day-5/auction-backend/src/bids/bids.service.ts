import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid, BidDocument } from './schemas/bid.schema';
import { Car, CarDocument } from '../cars/schemas/car.schema';
import { BiddingGateway } from '../bidding/bidding.gateway';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private biddingGateway: BiddingGateway,
  ) { }

  async create(bid: Partial<Bid>) {
    console.log('🔥 BidsService: Creating bid:', bid);

    if (!bid.auctionId) {
      throw new BadRequestException('Auction ID is required');
    }

    const car = await this.carModel.findById(bid.auctionId);
    if (!car) {
      throw new NotFoundException('Auction/Car not found');
    }

    if (String(car.sellerId) === String(bid.bidderId)) {
      throw new BadRequestException('You cannot bid on your own auction');
    }

    const newBid = new this.bidModel(bid);
    const savedBid = await newBid.save();

    console.log('✅ BidsService: Bid saved:', savedBid);

    // Update the car's currentPrice and add bid to bids array
    const updatedCar = await this.carModel.findByIdAndUpdate(
      bid.auctionId,
      {
        $set: { currentPrice: bid.amount },
        $push: { bids: savedBid._id }
      },
      { new: true }
    );

    console.log('🚗 BidsService: Car updated:', updatedCar);

    // Get total bid count for this auction
    const totalBids = await this.bidModel.countDocuments({ auctionId: bid.auctionId });

    // Emit real-time bid update
    const socketData = {
      amount: bid.amount,
      bidderId: bid.bidderId,
      auctionId: bid.auctionId.toString(),
      totalBids: totalBids,
      timestamp: new Date()
    };

    console.log('📡 BidsService: Emitting socket event:', socketData);
    this.biddingGateway.emitNewBid(bid.auctionId.toString(), socketData);

    return savedBid;
  }

  findAll() {
    return this.bidModel
      .find()
      .populate('auctionId')
      .populate('bidderId')
      .exec();
  }
}
