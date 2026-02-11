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
let aiInstance: { openai: OpenAI; modelProvider: OpenAIProvider } | null = null;

const getAiConfig = () => {
    if (aiInstance) return aiInstance;

    const apiKey = process.env.OPENROUTER_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';

    if (!apiKey) {
        console.warn('[AI Client] Warning: OPENROUTER_API_KEY is missing. AI features will not work.');
    }

    console.log(`[AI Client] Initializing with BaseURL: ${baseUrl}`);
    console.log(`[AI Client] API Key prefix: ${apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING'}`);

    const openaiInstance = new OpenAI({
        apiKey: apiKey || 'dummy-key',
        baseURL: baseUrl,
        defaultHeaders: {
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'AI Assignment Checker',
        },
    });

    // Configure SDK natively
    setDefaultOpenAIClient(openaiInstance as any);
    setOpenAIAPI('chat_completions');

    // Disable tracing to avoid sending data to OpenAI's tracing endpoint
    setTracingDisabled(false);

    // Standard Model Provider
    const modelProviderInstance = new OpenAIProvider({
        openAIClient: openaiInstance as any,
    });

    // Set as default model provider for the SDK
    setDefaultModelProvider(modelProviderInstance);

    aiInstance = { openai: openaiInstance, modelProvider: modelProviderInstance };
    return aiInstance;
};

export const getOpenAI = () => {
    const { openai } = getAiConfig();
    return openai;
};

export const getModelProvider = () => {
    const { modelProvider } = getAiConfig();
    return modelProvider;
};
