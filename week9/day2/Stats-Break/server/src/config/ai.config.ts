import OpenAI from "openai";
import { OpenAIProvider } from "@openai/agents-openai";
import {
    setTracingDisabled,
    setDefaultOpenAIClient,
    setOpenAIAPI,
    setDefaultModelProvider
} from "@openai/agents";

/**
 * AI Client Configuration
 * Using OpenAI SDK to connect to OpenRouter (Gemini / Other models)
 */

const getAiConfig = () => {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1";

    if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY or GEMINI_API_KEY is missing in .env");
    }

    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: baseUrl,
        defaultHeaders: {
            "HTTP-Referer": "https://stats-break.ai",
            "X-Title": "Stats Break",
        }
    });

    // Configure SDK natively
    setDefaultOpenAIClient(openai as any);
    setOpenAIAPI("chat_completions");

    // Tracing configuration
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
