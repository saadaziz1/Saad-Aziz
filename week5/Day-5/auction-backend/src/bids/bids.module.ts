import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schemas/bid.schema';
import { Car, CarSchema } from '../cars/schemas/car.schema';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { BiddingModule } from '../bidding/bidding.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: Car.name, schema: CarSchema },
    ]),
    BiddingModule,
  ],
  providers: [BidsService],
  controllers: [BidsController],
  exports: [BidsService],
})
export class BidsModule {}
