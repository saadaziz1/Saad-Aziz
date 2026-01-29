import { registerAs } from '@nestjs/config';

export default registerAs('llm', () => ({
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free',
    baseUrl: 'https://openrouter.ai/api/v1',
    maxTokens: parseInt(process.env.OPENROUTER_MAX_TOKENS || '1000', 10),
}));
