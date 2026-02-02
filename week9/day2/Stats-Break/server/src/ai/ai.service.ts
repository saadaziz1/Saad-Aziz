import { Injectable, Inject, Logger, forwardRef } from '@nestjs/common';
import OpenAI from 'openai';
import { PlayersService } from '../players/players.service';
import { MemoryService } from '../memory/memory.service';
import { AgentRunner } from './runner/agent.runner';
import { createRouterAgent } from './agents/router.agent';
import { createStatsAgent } from './agents/stats.agent';
import { summaryAgent } from './agents/summary.agent';
import { titleAgent } from './agents/title.agent';
import { relevancyAgent } from './agents/relevancy.agent';
import { InputGuardrailTripwireTriggered } from '@openai/agents';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);

    constructor(
        @Inject('MODEL_PROVIDER') private readonly modelProvider: any,
        @Inject('OPENAI_CLIENT') private readonly openai: OpenAI,
        private readonly playersService: PlayersService,
        @Inject(forwardRef(() => MemoryService))
        private readonly memoryService: MemoryService,
    ) { }

    async handleQuery(userId: string, conversationId: string, query: string) {
        this.logger.log(`Processing query for user ${userId} in conv ${conversationId}: ${query}`);

        const contextText = await this.memoryService.getContext(conversationId);
        const metadata = await this.playersService.getMetadata();
        const statsAgent = createStatsAgent(this.playersService, metadata);
        const routerAgent = createRouterAgent(statsAgent, summaryAgent, this);

        const executionContext: any = {
            userId,
            conversationId,
            playersService: this.playersService,
            memoryService: this.memoryService,
            previousContext: contextText,
            lastToolResult: null
        };

        try {
            const result = await AgentRunner.run(
                routerAgent,
                query,
                executionContext,
                this.modelProvider
            );

            const answer = result.finalOutput || 'I apologize, but I couldn\'t process that request.';

            // 📊 Structured Data Extraction (Tables)
            let payload: any = { type: 'text', text: answer };
            const data = executionContext.lastToolResult;
            this.logger.debug(`[AiService] Captured Tool Result: ${data ? (Array.isArray(data) ? `Array(${data.length})` : 'Object') : 'null'}`);

            if (Array.isArray(data) && data.length > 0) {
                const columns = Object.keys(data[0]).filter(k => k !== '_id' && k !== '__v' && k !== 'metadata' && k !== 'id');
                payload = {
                    type: 'table',
                    text: answer,
                    columns,
                    rows: data.map(row => columns.map(col => row[col]))
                };
            }

            // Update Memory with the full payload
            await this.memoryService.addMessage(conversationId, 'user', query);
            await this.memoryService.addMessage(conversationId, 'assistant', answer, payload);

            return {
                ...payload,
                conversationId,
                agentPath: result.history
                    .filter((h: any) => h.event === 'agent_start')
                    .map((h: any) => h.name),
                usage: result.usage
            };
        } catch (error) {
            if (error instanceof InputGuardrailTripwireTriggered) {
                this.logger.warn(`Guardrail tripped for query: ${query}`);
                const refusal = "I'm sorry, but I'm specialized only in cricket statistics and history. I can't assist with that particular request.";

                await this.memoryService.addMessage(conversationId, 'user', query);
                await this.memoryService.addMessage(conversationId, 'assistant', refusal);

                return {
                    type: 'text',
                    text: refusal,
                    conversationId,
                    agentPath: ['Guardrail'],
                    usage: null
                };
            }
            this.logger.error(`Error in AiService: ${error.message}`, error.stack);
            throw error;
        }
    }

    async generateTitle(firstMessage: string): Promise<string> {
        const result = await AgentRunner.run(titleAgent, firstMessage, {}, this.modelProvider);
        return (result.finalOutput || 'New Conversation').replace(/"/g, '').trim();
    }

    async summarize(text: string): Promise<string> {
        const result = await AgentRunner.run(summaryAgent, `Summarize this: ${text}`, {}, this.modelProvider);
        return result.finalOutput || '';
    }

    async checkRelevancy(query: string): Promise<boolean> {
        const result = await AgentRunner.run(relevancyAgent, query, {}, this.modelProvider);
        return (result.finalOutput || '').toUpperCase().includes('YES');
    }
}
