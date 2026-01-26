import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DocumentsModule } from './modules/documents/documents.module';
import { AiModule } from './modules/ai/ai.module';

import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get('mongo.uri'),
      }),
      inject: [ConfigService],
    }),
    DocumentsModule,
    AiModule,
    SearchModule,
  ],
})
export class AppModule { }
