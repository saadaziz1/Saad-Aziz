import { Agent } from "@openai/agents";
import "./openrouter-client.js";

/**
 * Verified Free Model Slugs for OpenRouter
 */
export const MODELS = {
  GEMMA: "google/gemma-3-27b-it:free",
  CHIMERA: "tngtech/deepseek-r1t2-chimera:free",
  NEMOTRON: "nvidia/nemotron-3-nano-30b-a3b:free",
  GLM: "z-ai/glm-4.5-air:free",
  AUTO: "openrouter/auto"
};

const defaultSettings = {
  maxTokens: 1000,
  temperature: 0.8
};

// --- Expert Agents ---

export const agent1 = new Agent({
  name: "Gemma (Analytical)",
  instructions: "You are an analytical expert. Break down the user's prompt into key technical components and analyze them deeply.",
  model: MODELS.GEMMA,
  modelSettings: defaultSettings
});

export const agent2 = new Agent({
  name: "Chimera (Architect)",
  instructions: "You are a pragmatic architect. Critique the previous analysis and suggest structural improvements.",
  model: MODELS.CHIMERA,
  modelSettings: defaultSettings
});

export const agent3 = new Agent({
  name: "Nemotron (Security/Perf)",
  instructions: "You are a security specialist. Identify risks and performance bottlenecks in the proposed ideas.",
  model: MODELS.NEMOTRON,
  modelSettings: defaultSettings
});

export const agent4 = new Agent({
  name: "GLM (DX Specialist)",
  instructions: "You are a Developer Experience specialist. Suggest simpler workflows and better developer ergonomics.",
  model: MODELS.GLM,
  modelSettings: defaultSettings
});

export const consensusAgent = new Agent({
  name: "Final Judge",
  instructions: "Synthesize all expert opinions into a definitive final response. This concludes the round table.",
  model: MODELS.AUTO,
  modelSettings: { ...defaultSettings, maxTokens: 1500 }
});

// Note: In this simple version, orchestrating the discussion sequence is handled in roundtable.ts
