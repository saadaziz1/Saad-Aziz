import { tavily } from "@tavily/core";
import { tool } from "@openai/agents";
import { z } from "zod";
import "dotenv/config";

const tv = tavily({ apiKey: process.env.TAVILY_API_KEY as string });

/**
 * Searches the web for information using Tavily.
 */
export const tavilySearch = tool({
    name: "tavilySearch",
    description: "Search the web for up-to-date information and facts.",
    parameters: z.object({
        query: z.string().describe("The search query to look up."),
    }),
    execute: async ({ query }: { query: string }) => {
        console.log(`\n🔍 [Tavily] Searching for: "${query}"...`);

        try {
            const response = await tv.search(query, {
                searchDepth: "advanced",
                maxResults: 5,
            });

            if (!response.results || response.results.length === 0) {
                return "No findings found for this query.";
            }

            const findings = response.results
                .map((result: any, index: number) => {
                    return `[${index + 1}] Title: ${result.title}\nContent: ${result.content}\nSource: ${result.url}\n`;
                })
                .join("\n---\n");

            return `Key Findings:\n\n${findings}`;
        } catch (error: any) {
            console.error("❌ [Tavily] Error during search:", error.message);
            return `Error performing search: ${error.message}`;
        }
    },
});
