import { ResearchStateType } from "../workflow.state";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const createSummarizerNode = (llm: BaseChatModel) => {
    return async (state: ResearchStateType) => {
        const { rankedDocs, query } = state;
        const topDocs = rankedDocs.slice(0, 3);
        console.log(`[Node: Summarizer (LLM)] Summarizing top ${topDocs.length} docs`);

        const summaries: any[] = [];
        for (const doc of topDocs) {
            const prompt = `
          Synthesize a high-density technical summary of the following document as it relates to: "${query}"
          
          Document: "${doc.title}"
          Content: ${doc.content.substring(0, 6000)}
          
          Guidelines:
          1. Focus on specific technical claims, metrics, or architectural decisions.
          2. Use clear, concise language (max 4-5 sentences).
          3. Maintain the context of the original source.
        `;

            const response = await llm.invoke([
                new SystemMessage("You are a senior technical analyst providing high-fidelity document summaries."),
                new HumanMessage(prompt)
            ]);

            summaries.push({
                title: doc.title,
                summary: response.content.toString(),
                sourceUrl: doc.storageUrl
            });
        }

        return {
            summaries,
            steps: { summarizer: { count: summaries.length, timestamp: new Date() } }
        };
    };
};
