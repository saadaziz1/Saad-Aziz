import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { NotificationModule } from './notification/notification.module';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { CommentService } from './comment/comment.service';
import { NotificationService } from './notification/notification.service';
import { UserService } from './user/user.service';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/comment-system'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    AuthModule,
    UserModule,
    CommentModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppGateway, CommentService, NotificationService, UserService],
})
export class AppModule {}
