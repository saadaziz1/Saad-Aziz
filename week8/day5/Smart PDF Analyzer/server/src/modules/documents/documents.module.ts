import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PDFDocument, PDFDocumentSchema } from './schemas/document.schema';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PDFDocument.name, schema: PDFDocumentSchema }]),
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService],
    exports: [DocumentsService],
})
export class DocumentsModule { }
