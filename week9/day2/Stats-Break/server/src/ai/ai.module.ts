import { Module, Global, forwardRef } from '@nestjs/common';
import { openai, modelProvider } from '../config/ai.config';
import { AiService } from './ai.service';
import { PlayersModule } from '../players/players.module';
import { MemoryModule } from '../memory/memory.module';

@Global()
@Module({
    imports: [
        forwardRef(() => PlayersModule),
        forwardRef(() => MemoryModule),
    ],
    providers: [
        AiService,
        {
            provide: 'OPENAI_CLIENT',
            useValue: openai,
        },
        {
            provide: 'MODEL_PROVIDER',
            useValue: modelProvider,
        },
    ],
    exports: [AiService, 'OPENAI_CLIENT', 'MODEL_PROVIDER'],
})
export class AiModule { }
