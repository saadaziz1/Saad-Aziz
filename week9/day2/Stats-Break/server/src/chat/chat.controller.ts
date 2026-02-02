import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { MemoryService } from '../memory/memory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(
        private readonly orchestrator: OrchestratorService,
        private readonly memory: MemoryService,
    ) { }

    @Post('ask')
    async askQuestion(
        @Req() req: any,
        @Body() body: { question: string; conversationId?: string },
    ) {
        return this.orchestrator.handleUserRequest(req.user.sub, body.question, body.conversationId);
    }

    @Get('conversations')
    async getConversations(@Req() req: any) {
        return this.memory.listConversations(req.user.sub);
    }

    @Get('history/:conversationId')
    async getHistory(@Req() req: any, @Param('conversationId') conversationId: string) {
        return this.memory.getConversation(req.user.sub, conversationId);
    }
}
