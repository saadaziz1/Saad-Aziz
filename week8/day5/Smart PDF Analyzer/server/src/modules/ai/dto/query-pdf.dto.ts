import { ApiProperty } from '@nestjs/swagger';

export class QueryPdfDto {
    @ApiProperty({ description: 'The ID of the PDF document to query' })
    pdfId: string;

    @ApiProperty({ description: 'The question or query to ask the AI' })
    query: string;
}
