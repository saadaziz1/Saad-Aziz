import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ResearchDocument } from "./schemas/document.schema";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import { v2 as Cloudinary } from 'cloudinary'
import pdf from 'pdf-parse';

@Injectable()
export class DocumentsService {
    private readonly logger = new Logger(DocumentsService.name)

    constructor(
        @InjectModel(ResearchDocument.name) private documentModel: Model<ResearchDocument>,
        private configService: ConfigService
    ) { }

    private async uploadToCloudinary(file: Express.Multer.File): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const uploadStream = Cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    format: 'pdf',
                    folder: 'documents',
                    access_mode: 'public',
                },
                (error, result) => {
                    if (error) {
                        this.logger.error(`Failed to upload document: ${error.message}`)
                        resolve(null)
                    } else {
                        resolve(result?.secure_url || null)
                    }
                }

            )

            uploadStream.end(file.buffer)
        })
    }

    async processUpload(file: Express.Multer.File, topic: string, title?: string): Promise<ResearchDocument> {
        const finalTitle = title || file.originalname;
        this.logger.log(`Starting ingestion for: ${finalTitle} (Topic: ${topic})`)

        try {
            // Stage 1: Storage
            const storageUrl = await this.uploadToCloudinary(file)

            // Stage 2: Parsing
            const { text, wordCount } = await this.parsePDF(file.buffer)

            // Stage 3: Persistence
            const doc = await this.saveDocument({
                title: finalTitle,
                topic,
                content: text,
                storageUrl: storageUrl || undefined,
                wordCount,
                status: text ? 'ready' : 'failed'
            })

            this.logger.log(`Ingestion complete: ${doc.title} [${doc.status}]`)
            return doc
        } catch (error) {
            this.logger.error(`Ingestion failed for ${finalTitle}: ${error.message}`)
            throw error
        }
    }

    private async parsePDF(buffer: Buffer): Promise<{ text: string; wordCount: number }> {
        try {
            const data = await pdf(buffer);

            const text = data.text || ""
            const wordCount = text.split(/\s+/).filter(w => w.length > 0).length

            return { text, wordCount }
        } catch (error) {
            this.logger.error(`PDF parsing failed: ${error.message}`)
            return { text: "", wordCount: 0 }
        }
    }

    private async saveDocument(data: Partial<ResearchDocument>): Promise<ResearchDocument> {
        const newDoc = new this.documentModel(data)
        return newDoc.save()
    }


    async findById(id: string): Promise<ResearchDocument> {
        const doc = await this.documentModel.findById(id).exec()
        if (!doc) {
            throw new NotFoundException(`Document not found`)
        }
        return doc as any
    }

    async update(id: string, update: Partial<ResearchDocument>): Promise<ResearchDocument> {
        const doc = await this.documentModel.findByIdAndUpdate(id, update, { new: true }).exec()
        if (!doc) {
            throw new NotFoundException(`Document not found`)
        }
        return doc as any
    }

    async createManual(data: { title: string; topic: string; content: string }): Promise<ResearchDocument> {
        const wordCount = data.content.split(/\s+/).filter(w => w.length > 0).length;

        const doc = await this.saveDocument({
            ...data,
            wordCount,
            status: 'ready'
        });

        this.logger.log(`Manual document created: ${doc.title}`);
        return doc;
    }

    async findAll(): Promise<ResearchDocument[]> {
        return this.documentModel.find().sort({ createdAt: -1 }).exec()
    }

}