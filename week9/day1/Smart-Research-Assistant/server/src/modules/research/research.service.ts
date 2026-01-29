import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { ResearchTrace } from './schemas/trace.schema';
import { ResearchDocument } from '../documents/schemas/document.schema';
import { buildResearchWorkflow } from './workflow/workflow.engine';

@Injectable()
export class ResearchService {
    private readonly logger = new Logger(ResearchService.name);

    constructor(
        @InjectModel(ResearchTrace.name) private traceModel: Model<ResearchTrace>,
        @InjectModel(ResearchDocument.name) private documentModel: Model<ResearchDocument>,
        private configService: ConfigService,
    ) { }

    async runResearch(query: string) {
        this.logger.log(`Initiating research for: "${query}"`);

        const apiKey = this.configService.get<string>('llm.apiKey');
        const model = this.configService.get<string>('llm.model');
        const baseUrl = this.configService.get<string>('llm.baseUrl');
        const maxTokens = this.configService.get<number>('llm.maxTokens');

        if (!apiKey) {
            throw new Error('OPENROUTER_API_KEY is not configured');
        }

        const llm = new ChatOpenAI({
            apiKey: apiKey,
            modelName: model,
            temperature: 0,
            configuration: {
                baseURL: baseUrl,
                defaultHeaders: { "X-Title": "Smart Research Assistant" }
            },
            maxRetries: 10,
            maxTokens: maxTokens
        });

        const workflow = buildResearchWorkflow(this.documentModel as any, llm);

        // Execute the LangGraph workflow
        const result = await workflow.invoke({ query });

        // Persist the trace to MongoDB
        const trace = new this.traceModel({
            query,
            subQueries: result.subQueries,
            documents: result.documents,
            rankedDocs: result.rankedDocs,
            summaries: result.summaries,
            contradictions: result.contradictions,
            finalAnswer: result.finalAnswer,
            steps: result.steps,
        });

        const savedTrace = await trace.save();

        return {
            id: savedTrace._id,
            finalAnswer: result.finalAnswer,
            contradictions: result.contradictions,
            trace: result.steps,
        };
    }

    async getTrace(id: string) {
        const trace = await this.traceModel.findById(id).exec();
        if (!trace) {
            throw new NotFoundException(`Trace with ID ${id} not found`);
        }
        return trace;
    }
}
