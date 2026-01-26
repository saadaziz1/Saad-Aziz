import { modelProvider } from "./client.js";
import { Agent, Runner } from "@openai/agents";

async function main() {
    // Create a basic agent
    const assistant = new Agent({
        name: "Assistant",
        instructions: "You are a helpful assistant",
        model: process.env.GEMINI_MODEL || "models/gemini-2.5-flash",
        modelSettings: {
            maxTokens: 50
        }
    });
    // Run the agent using Runner with explicit modelProvider
    const runner = new Runner({ modelProvider } as any);


    const result = await runner.run(assistant, "Hello, who are you?");

    // Print the final output
    console.log("Final Output:", result.finalOutput);
}

main().catch(console.error);
