import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { envConfig } from './config/env.config';
import { DatabaseConfig } from './config/database.config';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    MongooseModule.forRootAsync(DatabaseConfig),
    ReviewsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
