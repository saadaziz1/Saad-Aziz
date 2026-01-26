import { modelProvider } from "./client.js";
import { Runner } from "@openai/agents";
import { managerAgent } from "./agents/manager.js";

import "dotenv/config";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
    workRelatedGuardrail,
    emptyInputGuardrail,
    lengthGuardrail
} from "./guardrails/index.js";







async function runResearch(query: string) {
    console.log(`\n🚀 [System] Initializing Research Cycle`);
    console.log(`--------------------------------------------------`);

    try {
        // Apply Guardrails
        console.log("[System] Checking guardrails...");
        emptyInputGuardrail.validate(query);
        lengthGuardrail.validate(query, 300); // Strict limit for testing
        workRelatedGuardrail.validate(query);

        // Initialize Runner with explicit modelProvider
        const runner = new Runner({ modelProvider } as any);

        // Listen for events (Tracing/Observability)
        runner.on("agent_start", async (context, agent) => {
            console.log(`\n>>> [Agent Start] ${agent.name}`);

        });

        runner.on("agent_tool_start", async (context, agent, tool, details) => {
            if (details.toolCall.type === "function_call") {
                console.log(`    [Tool Call] ${tool.name} with params:`, details.toolCall.arguments);
            } else {
                console.log(`    [Tool Call] ${tool.name} of type ${details.toolCall.type}`);
            }
        });

        runner.on("agent_handoff", async (context, fromAgent, toAgent) => {
            console.log(`<<< [Handoff] Delegating from ${fromAgent.name} to ${toAgent.name}`);
        });

        // Start the run
        const result = await runner.run(managerAgent, query, { maxTurns: 15 });

        console.log("\n\n✅ [System] Research Cycle Completed.");

        if (result.finalOutput) {
            console.log("\nFinal Report:\n", result.finalOutput);
        } else {
            console.log("\n⚠️ [Warning] No final report generated. Content was empty.");
            // Log the last message type for debugging
            const resAny = result as any;
            if (resAny.messages && resAny.messages.length > 0) {
                const lastMsg = resAny.messages[resAny.messages.length - 1];
                console.log(`[Debug] Last message role: ${lastMsg.role}`);
                console.log(`[Debug] Last message has content: ${!!lastMsg.content}`);
                console.log(`[Debug] Last message has tool calls: ${!!(lastMsg as any).tool_calls}`);
            }
        }

    } catch (error: any) {
        console.error("\n❌ [Error] System Failure:", error.message);
    }
}

async function main() {
    const argQuery = process.argv[2];

    if (argQuery) {
        await runResearch(argQuery);
    } else {
        // Interactive Mode
        const rl = readline.createInterface({ input, output });
        console.log("\n🤖 Welcome to the Multi-Agent Research CLI");
        console.log("Type your research query below (or 'exit' to quit):");

        while (true) {
            const answer = await rl.question("\nQuery > ");

            if (answer.toLowerCase() === "exit" || answer.toLowerCase() === "quit") {
                console.log("Goodbye!");
                break;
            }

            if (answer.trim()) {
                await runResearch(answer);
            }
        }
        rl.close();
    }
}

main();
