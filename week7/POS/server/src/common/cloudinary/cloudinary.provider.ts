import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: (configService: ConfigService) => {
        return cloudinary.config({
            cloud_name: configService.get('cloudinary.cloud_name'),
            api_key: configService.get('cloudinary.api_key'),
            api_secret: configService.get('cloudinary.api_secret'),
        });
    },
    inject: [ConfigService],
};
