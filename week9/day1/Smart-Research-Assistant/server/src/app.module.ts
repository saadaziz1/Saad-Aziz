import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig from './config/mongo.config';
import cloudinaryConfig from './config/cloudinary.config';
import llmConfig from './config/llm.config';
import { DocumentsModule } from './modules/documents/documents.module';
import { ResearchModule } from './modules/research/research.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig, cloudinaryConfig, llmConfig],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongo.uri'),
      }),
    }),
    DocumentsModule,
    ResearchModule,
  ],
})
export class AppModule { }
