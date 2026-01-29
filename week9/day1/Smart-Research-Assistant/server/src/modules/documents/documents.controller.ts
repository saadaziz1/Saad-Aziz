import { Controller, Post, UploadedFile, UseInterceptors, Get, Param, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { CreateDocumentDto } from './dto/create-document.dto';


@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }


    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Body() body: UploadDocumentDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
                    new FileTypeValidator({ fileType: 'application/pdf' }),
                ],
            }),
        ) file: Express.Multer.File,
    ) {
        const doc = await this.documentsService.processUpload(file, body.topic, body.filename);
        return { id: doc._id, filename: doc.title, topic: doc.topic, status: doc.status };
    }

    @Get()
    async getDocuments() {
        return this.documentsService.findAll();
    }

    @Post('manual')
    async createManual(@Body() body: CreateDocumentDto) {
        return this.documentsService.createManual(body);
    }

    @Get(':id')
    async getDocument(@Param('id') id: string) {
        return this.documentsService.findById(id);
    }
}
