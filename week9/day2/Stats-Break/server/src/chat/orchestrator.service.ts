import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { MemoryService } from '../memory/memory.service';

@Injectable()
export class OrchestratorService {
    private readonly logger = new Logger(OrchestratorService.name);

    constructor(
        private readonly ai: AiService,
        private readonly memory: MemoryService,
    ) { }

    async handleUserRequest(userId: string, question: string, conversationId?: string) {
        this.logger.log(`Processing request: "${question}" for user ${userId}`);

        // 1. Session Management
        let convId = conversationId;
        if (!convId) {
            const newConv = await this.memory.createConversation(userId, question);
            convId = (newConv as any)._id.toString();
        }

        // 2. Delegate to the Agentic AI Service
        const agentResult = await this.ai.handleQuery(userId, convId!, question);

        // 3. Return the result to the controller (contains payload, conversationId, usage, agentPath)
        return agentResult;
    }
}
