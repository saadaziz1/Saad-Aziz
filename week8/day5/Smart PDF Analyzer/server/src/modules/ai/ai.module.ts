import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { DocumentsModule } from '../documents/documents.module';
import { GroundingGuard } from './guardrails/grounding.guard';
import { HallucinationGuard } from './guardrails/hallucination.guard';

@Module({
    imports: [DocumentsModule],
    controllers: [AiController],
    providers: [
        AiService,
        GroundingGuard,
        HallucinationGuard,
    ],
    exports: [AiService],
})
export class AiModule { }
