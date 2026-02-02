import OpenAI from 'openai';
import { OpenAIProvider } from '@openai/agents-openai';
import {
    setTracingDisabled,
    setDefaultOpenAIClient,
    setOpenAIAPI,
    setDefaultModelProvider,
} from '@openai/agents';

/**
 * AI Client Configuration
 * Using OpenAI SDK to connect to OpenRouter (Gemini / Other models)
 */
const getAiConfig = () => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';

    if (!apiKey) {
        console.warn('[AI Client] Warning: OPENROUTER_API_KEY is missing. AI features will not work.');
    }

    const openai = new OpenAI({
        apiKey: apiKey || 'dummy-key',
        baseURL: baseUrl,
        defaultHeaders: {
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Smart Healthcare Store',
        },
    });

    // Configure SDK natively
    setDefaultOpenAIClient(openai as any);
    setOpenAIAPI('chat_completions');

    // Disable tracing to avoid sending data to OpenAI's tracing endpoint
    setTracingDisabled(false);

    // Standard Model Provider
    const modelProvider = new OpenAIProvider({
        openAIClient: openai as any,
    });

    // Set as default model provider for the SDK
    setDefaultModelProvider(modelProvider);

    return { openai, modelProvider };
};

export const { openai, modelProvider } = getAiConfig();
