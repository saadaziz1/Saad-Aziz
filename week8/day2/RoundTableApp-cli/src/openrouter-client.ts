import OpenAI from "openai";
import { OpenAIChatCompletionsModel } from "@openai/agents-openai";
import { setDefaultModelProvider, setTracingDisabled } from "@openai/agents-core";
import "dotenv/config";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing in .env");
}

/**
 * OpenRouter Client Configuration
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://github.com/openai/openai-agents-js",
    "X-Title": "Roundtable Discussion",
  }
});

/**
 * Custom Model subclass to intercept and fix Model name mapping for OpenRouter.
 * Implements a robust 404 fallback mechanism.
 */
class OpenRouterCompatibleModel extends OpenAIChatCompletionsModel {
  private readonly requestedModel: string;
  private readonly fallbackModel = "openrouter/auto";

  constructor(client: any, model: string) {
    super(client, model);
    this.requestedModel = model;
  }

  /**
   * Overrides getResponse to implement a 404 (Not Found) fallback.
   * If the specific free model endpoint is down, it retries with 'openrouter/auto'.
   */
  async getResponse(request: any): Promise<any> {
    const safeRequest = {
      ...request,
      modelSettings: {
        ...request.modelSettings,
        maxTokens: request.modelSettings?.maxTokens || 1000
      }
    };
    try {
      return await super.getResponse(safeRequest);
    } catch (error: any) {
      if (error.status === 404 && this.requestedModel !== this.fallbackModel) {
        console.warn(`\n⚠️ Model "${this.requestedModel}" is offline. Falling back to "${this.fallbackModel}"...`);
        const fallbackInstance = new OpenAIChatCompletionsModel(openai as any, this.fallbackModel);
        const retryRequest = { ...safeRequest, model: this.fallbackModel };
        return await fallbackInstance.getResponse(retryRequest);
      }
      throw error;
    }
  }

  /**
   * Overrides getStreamedResponse to implement a 404 (Not Found) fallback.
   */
  async *getStreamedResponse(request: any): AsyncIterable<any> {
    const safeRequest = {
      ...request,
      modelSettings: {
        ...request.modelSettings,
        maxTokens: request.modelSettings?.maxTokens || 1000
      }
    };
    try {
      yield* super.getStreamedResponse(safeRequest);
    } catch (error: any) {
      if (error.status === 404 && this.requestedModel !== this.fallbackModel) {
        console.warn(`\n⚠️ Model "${this.requestedModel}" is offline. Falling back to "${this.fallbackModel}" (streaming)...`);
        const fallbackInstance = new OpenAIChatCompletionsModel(openai as any, this.fallbackModel);
        const retryRequest = { ...safeRequest, model: this.fallbackModel };
        yield* fallbackInstance.getStreamedResponse(retryRequest);
      } else {
        throw error;
      }
    }
  }
}

/**
 * Force @openai/agents to use the standard "Chat Completions" API 
 */
const modelProvider = {
  getModel: (modelName?: string) => {
    const name = modelName || "openrouter/auto";
    return new OpenRouterCompatibleModel(openai, name);
  }
};

// Set the custom provider as default
setDefaultModelProvider(modelProvider as any);

// Disable tracing globally
setTracingDisabled(true);
