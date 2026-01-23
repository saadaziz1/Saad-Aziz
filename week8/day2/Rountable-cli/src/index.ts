import { modelProvider } from "./client.js";
import { Runner } from "@openai/agents";
import * as readline from "node:readline/promises";
import { moderator } from "./agents.js";
import { workRelatedGuardrail } from "./guardrails.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function main() {
    console.log("\n--- Welcome to the Agentic Roundtable Discussion ---\n");
    console.log("Enter a topic for discussion, or 'exit' to quit.");

    while (true) {
        const topic = await rl.question("\nTopic > ");

        if (topic.toLowerCase() === "exit") {
            break;
        }

        try {
            // Apply Guardrail
            console.log("\n[System] Checking guardrails...");
            workRelatedGuardrail.validate(topic);


            // Initialize Runner with explicit modelProvider
            const runner = new Runner({ modelProvider } as any);
            // Listen for events (Tracing/Observability)
            runner.on("agent_start", async (context, agent) => {
                console.log(`\n>>> [Agent Start] ${agent.name}`);
                // Throttling: Add a delay between turns to avoid 429 errors
                await new Promise(resolve => setTimeout(resolve, 5000));
            });

            runner.on("agent_tool_start", async (context, agent, tool, details) => {
                if (details.toolCall.type === "function_call") {
                    console.log(`    [Tool Call] ${tool.name} with params:`, details.toolCall.arguments);
                } else {
                    console.log(`    [Tool Call] ${tool.name} of type ${details.toolCall.type}`);
                }
                // Throttling: Add a delay for tool calls to avoid 429 errors
                await new Promise(resolve => setTimeout(resolve, 2000));
            });

            runner.on("agent_handoff", async (context, fromAgent, toAgent) => {
                console.log(`<<< [Handoff] Delegating from ${fromAgent.name} to ${toAgent.name}`);
                // Throttling: Add a delay for handoffs to avoid 429 errors
                await new Promise(resolve => setTimeout(resolve, 3000));
            });

            // Start the run with lower maxTurns to prevent infinite loops
            // Note: Token limits are controlled via agent instructions (100 words) and wordLimitTool
            const result = await runner.run(moderator, topic, { maxTurns: 15 });

            console.log("\n--- Discussion Concluded ---");
            console.log("\nFinal Message from Moderator:\n", result.finalOutput);

        } catch (error: any) {
            console.error(`\n[Safety Error] ${error.message}`);
        }
    }

    rl.close();
}

main().catch(console.error);
