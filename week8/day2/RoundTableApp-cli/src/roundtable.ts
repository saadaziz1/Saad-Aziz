import { Runner } from "@openai/agents";
import { agent1, agent2, agent3, agent4, consensusAgent } from "./agents.js";

const runner = new Runner({ tracingDisabled: true });

/**
 * Runs a simple, sequential round table discussion.
 * Agents are called one by one to provide their perspective.
 */
export async function runRoundtable(question: string): Promise<string> {
  console.log("\n🚀 Starting Simple Round Table (Sequential Flow)...\n");

  const agents = [agent1, agent2, agent3, agent4, consensusAgent];
  let discussionHistory = `Initial Question: ${question}\n\n`;
  let lastOutput = "";

  try {
    for (const [index, agent] of agents.entries()) {
      console.log(`\n🤖Expert${index + 1}: ${agent.name} is thinking...`);

      // result.finalOutput should contain the text response for these agents
      const result = await runner.run(agent, discussionHistory);
      const content = result.finalOutput;

      if (content && typeof content === "string") {


        discussionHistory += `--- Discussion by ${agent.name} ---\n${content}\n\n`;
        lastOutput = content;
      } else {
        console.log(`\n⚠️ ${agent.name} did not provide a text response.`);
      }
    }

    return lastOutput || "Error: No final response was generated during the discussion.";
  } catch (error: any) {
    console.error("\n❌ Error in discussion:", error.message || error);
    throw error;
  }
}
