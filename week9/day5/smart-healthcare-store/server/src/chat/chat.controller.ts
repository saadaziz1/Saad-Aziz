import { Body, Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

    // Speech-to-text (transcribe audio file)
    @Post('speech-to-text')
    @UseInterceptors(FileInterceptor('audio'))
    async speechToText(@UploadedFile() file: any) {
        return this.chatService.transcribeAudio(file);
    }
}
