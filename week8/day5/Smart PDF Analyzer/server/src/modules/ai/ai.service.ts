import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentsService } from '../documents/documents.service';
import { AgentRunner } from './runner/agent-runner';
import { GroundingGuard } from './guardrails/grounding.guard';
import { HallucinationGuard } from './guardrails/hallucination.guard';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);

    constructor(
        private readonly documentsService: DocumentsService,
        private readonly groundingGuard: GroundingGuard,
        private readonly hallucinationGuard: HallucinationGuard,
        private readonly configService: ConfigService,
    ) { }

    async handleQuery(pdfId: string, query: string) {
        this.logger.log(`Processing query for PDF ${pdfId}: ${query}`);

        const context = {
            documentsService: this.documentsService,
            pdfId,
        };

        try {
            const modelProvider = this.configService.get('openai.provider');
            const result: any = await AgentRunner.run(query + ` (Document ID: ${pdfId})`, context, modelProvider);

            const answer = result.finalOutput || '';

            // Apply Guardrails
            const doc = await this.documentsService.findById(pdfId);
            this.groundingGuard.validate(answer, doc.content);
            this.hallucinationGuard.validate(answer, doc.content);

            return {
                answer,
                history: result.history,
                agentPath: result.history
                    .filter((h: any) => h.event === 'agent_start')
                    .map((h: any) => h.name),
            };
        } catch (error) {
            this.logger.error(`Error in AiService: ${error.message}`);
            throw error;
        }
    }
}
