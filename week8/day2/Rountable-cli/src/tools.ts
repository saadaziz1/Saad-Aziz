import { tool } from "@openai/agents";
import { z } from "zod";

/**
 * Ensures text is within a specific word limit.
 */
export const wordLimiter = tool({
    name: "word_limit_tool",
    description: "Enforces a word limit on a given text.",
    parameters: z.object({
        text: z.string().describe("The text to limit"),
        limit: z.number().describe("The maximum number of words allowed"),
    }),
    execute: async ({ text, limit }: { text: string; limit: number }) => {
        const words = text.split(/\s+/);
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(" ") + "... [Word limit reached]";
    },
});

/**
 * Counts the number of claims or statistics mentioned in the text.
 */
export const factCounter = tool({
    name: "factCounterTool",
    description: "Counts potential claims or statistics in a text.",
    parameters: z.object({
        text: z.string().describe("The text to analyze"),
    }),
    execute: async ({ text }: { text: string }) => {
        // Simple heuristic: count numbers, percentages, or entities that look like facts
        const claims = text.match(/\d+(\.\d+)?%?|\b(increased|decreased|growth|rate)\b/gi) || [];
        return JSON.stringify({
            count: claims.length,
            detectedClaims: claims,
        });
    },
});
