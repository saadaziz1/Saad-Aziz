import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchTrace, ResearchTraceSchema } from './schemas/trace.schema';
import { ResearchDocument, ResearchDocumentSchema } from '../documents/schemas/document.schema';
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ResearchTrace.name, schema: ResearchTraceSchema },
            { name: ResearchDocument.name, schema: ResearchDocumentSchema },
        ]),
    ],
    providers: [ResearchService],
    controllers: [ResearchController],
})
export class ResearchModule { }
