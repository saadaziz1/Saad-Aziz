import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mongoConfig from './mongo.config';
import openaiConfig from './openai.config';
import cloudinaryConfig from './cloudinary.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [mongoConfig, openaiConfig, cloudinaryConfig],
        }),
    ],
})
export class AppConfigModule { }
