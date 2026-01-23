import OpenAI from "openai";
import { OpenAIProvider } from "@openai/agents-openai";
import {
    setTracingDisabled,
    setTraceProcessors,
    setDefaultOpenAIClient,
    setOpenAIAPI,
    setDefaultModelProvider
} from "@openai/agents";
import "dotenv/config";

const openRouterApiKey = process.env.OPENROUTER_API_KEY;

if (!openRouterApiKey) {
    throw new Error("OPENROUTER_API_KEY is missing in .env");
}

/**
 * OpenRouter Client Configuration
 */
const DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export const openai = new OpenAI({
    apiKey: openRouterApiKey,
    baseURL: process.env.OPENAI_BASE_URL || DEFAULT_OPENROUTER_BASE_URL,
    defaultHeaders: {}
});

// Configure SDK natively for Gemini/Third-party providers
setDefaultOpenAIClient(openai as any);
setOpenAIAPI("chat_completions");

/**
 * Tracing Configuration
 * - Enabled using OPENAI_API_KEY from environment.
 * - Non-OpenAI providers (like Gemini) need tracing enabled explicitly 
 *   when a valid OpenAI key is present for the tracing exporter.
 */

setTracingDisabled(false);


/**
 * Standard Model Provider using the Gemini-configured OpenAI Client
 */
export const modelProvider = new OpenAIProvider({
    openAIClient: openai as any,
});

// Set as default model provider for the SDK
setDefaultModelProvider(modelProvider);

console.log("[Client] OpenRouter Client Initialized (Multi-Model Support Enabled)");