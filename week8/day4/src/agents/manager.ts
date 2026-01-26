import { Agent } from "@openai/agents";
import "dotenv/config";
import { researchAgent } from "./researcher.js";

const Model = process.env.GEMINI_MODEL || "google/gemini-2.0-flash-exp";
const MaxTokens = parseInt(process.env.MAX_TOKENS || "500", 10);

/**
 * MANAGER AGENT (Orchestrator)
 */
export const managerAgent = new Agent({
  name: "Manager",
  instructions: `
    You are the Manager of a multi-agent system. Your ONLY task is to delegate the initial research request to the ResearchAgent.
    
    Rules:
    1. ALWAYS call the handoff tool to 'ResearchAgent' to begin the process.
    2. Do NOT perform any research or writing yourself.
    3. The pipeline will proceed from ResearchAgent to WriterAgent, who will provide the final output.
  `,
  model: Model,
  handoffs: [researchAgent],
  modelSettings: {
    maxTokens: MaxTokens
  }
});
