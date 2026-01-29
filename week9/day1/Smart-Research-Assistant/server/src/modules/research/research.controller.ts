import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ResearchService } from './research.service';

@Controller('research')
export class ResearchController {
    constructor(private readonly researchService: ResearchService) { }

    @Post('ask')
    async ask(@Body('query') query: string) {
        if (!query) return { error: "Query is required" };
        try {
            return await this.researchService.runResearch(query);
        } catch (error: any) {
            if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
                return {
                    error: "The AI is currently under high demand (rate limited). Please wait a few seconds and try again.",
                    isRateLimit: true
                };
            }
            throw error;
        }
    }

    @Get('trace/:id')
    async getTrace(@Param('id') id: string) {
        return this.researchService.getTrace(id);
    }
}
