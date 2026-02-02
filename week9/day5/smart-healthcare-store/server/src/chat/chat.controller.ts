import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    // Product recommendations (uses AI + product search)
    @Post('recommend')
    async recommend(@Body('message') message: string) {
        return this.chatService.getProductRecommendations(message);
    }

    // General chat (simple conversation, no product data)
    @Post()
    async chat(@Body('message') message: string) {
        return this.chatService.generalChat(message);
    }
}
