import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<any> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'assignments',
                    resource_type: 'auto',
                    type: 'upload',
                    access_mode: 'public',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteFile(fileUrl: string): Promise<any> {
        const publicId = fileUrl.split('/').pop()?.split('.')[0];
        if (!publicId) return;

        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(`assignments/${publicId}`, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }

    async makeFilePublic(fileUrl: string): Promise<any> {
        // Extract public_id from the URL
        const urlParts = fileUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1) return;

        // Get everything after 'upload/' and before the file extension
        const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
        const publicId = pathAfterUpload.split('.')[0];

        return new Promise((resolve, reject) => {
            cloudinary.uploader.explicit(publicId, {
                type: 'upload',
                access_mode: 'public',
                resource_type: 'auto'
            }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }
}
