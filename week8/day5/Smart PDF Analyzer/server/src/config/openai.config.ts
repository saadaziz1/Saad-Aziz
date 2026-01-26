import { registerAs } from '@nestjs/config';
import OpenAI from 'openai';
import { OpenAIProvider } from '@openai/agents-openai';
import { setDefaultOpenAIClient, setOpenAIAPI, setDefaultModelProvider } from '@openai/agents';

export default registerAs('openai', () => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is missing');
    }

    const openai = new OpenAI({
        apiKey,
        baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
    });

    // Configure SDK
    setDefaultOpenAIClient(openai as any);
    setOpenAIAPI('chat_completions');

    const modelProvider = new OpenAIProvider({
        openAIClient: openai as any,
    });

    setDefaultModelProvider(modelProvider);

    return {
        client: openai,
        provider: modelProvider,
        model: process.env.GEMINI_MODEL || 'google/gemini-2.0-flash-exp',
    };
});
