import { Controller, Post, UploadedFile, UseInterceptors, Get, Param, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post('upload')
    @ApiOperation({ summary: 'Upload a PDF document' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
                    new FileTypeValidator({ fileType: 'application/pdf' }),
                ],
            }),
        ) file: Express.Multer.File,
    ) {
        const doc = await this.documentsService.processUpload(file);
        return { id: doc._id, filename: doc.filename };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get document by ID' })
    async getDocument(@Param('id') id: string) {
        return this.documentsService.findById(id);
    }
}
