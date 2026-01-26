import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QueryPdfDto } from './dto/query-pdf.dto';

@ApiTags('ai')
@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('query')
    @ApiOperation({ summary: 'Ask a question about a specific PDF document' })
    async chat(@Body() body: QueryPdfDto) {
        return this.aiService.handleQuery(body.pdfId, body.query);
    }
}
