import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { OrchestratorService } from './orchestrator.service';
import { AiModule } from '../ai/ai.module';
import { PlayersModule } from '../players/players.module';
import { MemoryModule } from '../memory/memory.module';
import { AiService } from '../ai/ai.service';

@Module({
    imports: [AiModule, MemoryModule, PlayersModule],
    controllers: [ChatController],
    providers: [OrchestratorService, AiService],
})
export class ChatModule { }
