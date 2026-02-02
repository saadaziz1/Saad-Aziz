import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { AiService } from '../ai/ai.service';

@Injectable()
export class MemoryService {
    private readonly logger = new Logger(MemoryService.name);

    constructor(
        @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
        @Inject(forwardRef(() => AiService))
        private readonly ai: AiService,
    ) { }

    async getConversation(userId: string, conversationId: string): Promise<ConversationDocument | null> {
        return this.conversationModel.findOne({ _id: conversationId, userId: new Types.ObjectId(userId) }).exec();
    }

    async createConversation(userId: string, firstMessage: string): Promise<ConversationDocument> {
        const title = await this.ai.generateTitle(firstMessage);
        const conversation = new this.conversationModel({
            userId: new Types.ObjectId(userId),
            title: title,
            messages: []
        });
        return conversation.save();
    }

    async addMessage(
        conversationId: string,
        role: 'user' | 'assistant',
        content: string,
        payload?: any
    ): Promise<void> {
        const conversation = await this.conversationModel.findById(conversationId);
        if (!conversation) return;

        conversation.messages.push({
            role,
            content,
            payload,
            timestamp: new Date()
        });

        // Check if summarization is needed (ex: >= 15 messages)
        if (conversation.messages.length >= 15) {
            this.logger.log(`Automatic summarization triggered for conversation ${conversationId}`);

            const historyText = conversation.messages.map(m => `${m.role}: ${m.content}`).join('\n');
            const summaryInput = conversation.lastSummary
                ? `EXISTING SUMMARY: ${conversation.lastSummary}\n\nNEW MESSAGES to incorporate:\n${historyText}`
                : historyText;

            conversation.lastSummary = await this.ai.summarize(summaryInput);

            // Prune history: Keep only the most recent 3 messages to maintain flow
            conversation.messages = conversation.messages.slice(-3);
        }

        await conversation.save();
    }

    async getContext(conversationId: string): Promise<string> {
        const conv = await this.conversationModel.findById(conversationId);
        if (!conv) return '';

        // Context = Current Summary + Last 5 messages for better continuity
        let context = conv.lastSummary ? `[PREVIOUS SUMMARY]\n${conv.lastSummary}\n\n` : '';
        const recentMessages = conv.messages.slice(-5);

        if (recentMessages.length > 0) {
            context += `[RECENT CONVERSATION HISTORY]\n`;
            context += recentMessages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
        }

        return context;
    }

    async listConversations(userId: string): Promise<ConversationDocument[]> {
        return this.conversationModel.find({ userId: new Types.ObjectId(userId) }).sort({ updatedAt: -1 }).exec();
    }
}
