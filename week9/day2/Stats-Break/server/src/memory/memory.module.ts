import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemoryService } from './memory.service';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { AiModule } from '../ai/ai.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
        forwardRef(() => AiModule),
    ],
    providers: [MemoryService],
    exports: [MemoryService],
})
export class MemoryModule { }
