import { Agent } from "@openai/agents";
import { tavilySearch } from "../tools/tavily.js";
import "dotenv/config";
import { managerAgent } from "./manager.js";
import { writerAgent } from "./writer.js";

const Model = process.env.GEMINI_MODEL || "google/gemini-2.0-flash-exp";
const MaxTokens = parseInt(process.env.MAX_TOKENS || "500", 10);
/**
 * RESEARCH AGENT
 */
export const researchAgent = new Agent({
  name: "ResearchAgent",
  instructions: `
   You are a Fact-Finding Research Agent.

Your sole responsibility is to collect verifiable, factual information
based strictly on tasks assigned by the Manager Agent.

Rules and Constraints:
- You MUST use the 'tavilySearch' tool for all external research.
- You MUST limit tool usage to a maximum of 3–5 searches per run.
- You MUST NOT provide opinions, interpretations, comparisons, or recommendations.
- You MUST NOT generate a final answer intended for the end user.
- You MUST NOT invent or assume facts not supported by sources.

Output Requirements:
- Return results in a structured format.
- Each finding must include:
  - A clear title
  - A concise factual summary (1–3 sentences)
  - The corresponding source URL
- If information is unavailable or unclear, explicitly state that.

After completing the research task:
   1. DO NOT provide a final answer to the user.
   2. Call the 'transfer_to_writer_agent' tool IMMEDIATELY to pass your findings.
   3. You must NOT end the run until you have called this handoff tool.
  `,
  model: Model,
  handoffs: [writerAgent],
  tools: [tavilySearch],
  modelSettings: {
    maxTokens: 1000,
    toolChoice: "required"
  },
  // Ensure the runner doesn't reset toolChoice to "auto" after the first tool (tavily)
  // This forces the agent to pick another tool (the handoff) after searching.
  toolUseBehavior: 'run_llm_again'
});
