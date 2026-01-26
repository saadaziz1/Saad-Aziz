import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { PDFDocument } from './schemas/document.schema';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class DocumentsService {
    private readonly logger = new Logger(DocumentsService.name);

    constructor(
        @InjectModel(PDFDocument.name) private documentModel: Model<PDFDocument>,
        private configService: ConfigService,
    ) { }

    private async uploadToCloudinary(file: Express.Multer.File): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    folder: 'pdf_analyzer/uploads',
                    access_mode: 'public',
                },
                (error, result) => {
                    if (error) {
                        this.logger.error(`Cloudinary Upload Failed: ${error.message}`);
                        resolve(null);
                    } else {
                        resolve(result?.secure_url || null);
                    }
                }
            );

            uploadStream.end(file.buffer);
        });
    }

    async processUpload(file: Express.Multer.File): Promise<PDFDocument> {
        // 1. Upload to Cloudinary
        const storageUrl = await this.uploadToCloudinary(file);

        // 2. Parse PDF Text
        const { PDFParse } = await import('pdf-parse');
        const parser = new PDFParse({ data: file.buffer });
        const result = await parser.getText();

        // 3. Save to DB
        const newDoc = new this.documentModel({
            filename: file.originalname,
            content: result.text,
            storageUrl: storageUrl ?? undefined,
        });
        return newDoc.save();
    }

    async findById(id: string): Promise<PDFDocument> {
        const doc = await this.documentModel.findById(id).exec();
        if (!doc) {
            throw new NotFoundException('Document not found');
        }
        return doc as any;
    }

    async update(id: string, update: Partial<PDFDocument>): Promise<PDFDocument> {
        return this.documentModel.findByIdAndUpdate(id, update, { new: true }).exec() as any;
    }
}
