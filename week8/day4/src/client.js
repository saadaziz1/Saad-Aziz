"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelProvider = exports.openai = void 0;
var openai_1 = require("openai");
var agents_openai_1 = require("@openai/agents-openai");
var agents_1 = require("@openai/agents");
require("dotenv/config");
var openRouterApiKey = process.env.OPENROUTER_API_KEY;
if (!openRouterApiKey) {
    throw new Error("OPENROUTER_API_KEY is missing in .env");
}
/**
 * OpenRouter Client Configuration
 */
var DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
exports.openai = new openai_1.default({
    apiKey: openRouterApiKey,
    baseURL: process.env.OPENAI_BASE_URL || DEFAULT_OPENROUTER_BASE_URL,
    defaultHeaders: {}
});
// Configure SDK natively for Gemini/Third-party providers
(0, agents_1.setDefaultOpenAIClient)(exports.openai);
(0, agents_1.setOpenAIAPI)("chat_completions");
/**
 * Tracing Configuration
 * - Enabled using OPENAI_API_KEY from environment.
 * - Non-OpenAI providers (like Gemini) need tracing enabled explicitly
 *   when a valid OpenAI key is present for the tracing exporter.
 */
(0, agents_1.setTracingDisabled)(false);
/**
 * Standard Model Provider using the Gemini-configured OpenAI Client
 */
exports.modelProvider = new agents_openai_1.OpenAIProvider({
    openAIClient: exports.openai,
});
// Set as default model provider for the SDK
(0, agents_1.setDefaultModelProvider)(exports.modelProvider);
console.log("[Client] OpenRouter Client Initialized (Multi-Model Support Enabled)");
