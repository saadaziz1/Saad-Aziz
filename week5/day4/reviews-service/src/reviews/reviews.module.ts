import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { User, UserSchema } from './schemas/user.schema';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: User.name, schema: UserSchema },
    ]),
    NotificationsModule,
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}