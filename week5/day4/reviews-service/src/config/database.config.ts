import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const DatabaseConfig: MongooseModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const uri = configService.get<string>('mongoUri');

    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    return {
      uri,
    };
  },
};
