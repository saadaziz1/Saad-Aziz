import { ResearchStateType } from "../workflow.state";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const createCrossCheckerNode = (llm: BaseChatModel) => {
    return async (state: ResearchStateType) => {
        const { summaries } = state;
        console.log(`[Node: CrossChecker (LLM)] Checking ${summaries.length} summaries`);

        if (summaries.length < 2) {
            return { contradictions: [], steps: { checker: { count: 0, timestamp: new Date() } } };
        }

        const summariesText = summaries.map(s => `Title: ${s.title}\nSummary: ${s.summary}`).join("\n\n---\n\n");

        const prompt = `
      You are a Research Integrity Auditor. 
      Compare the following summaries and identify technical discrepancies, conflicting data points, or fundamental disagreements between sources.
      
      Summaries:
      ${summariesText}
      
      Requirements:
      1. Analyze the texts for conflicting claims about:
         - Performance metrics or scale.
         - Versions and compatibility.
         - Architectural decisions.
      2. For each conflict, identify the EXCATE statement or close paraphrase that creates the contradiction.
      3. Return ONLY a JSON array of objects with this structure:
         {
           "type": "Metric" | "Version" | "Architecture" | "Discrepancy",
           "message": "A summary of the central conflict",
           "conflictingStatements": [
             { "source": "Title 1", "statement": "The specific claim made in Source 1" },
             { "source": "Title 2", "statement": "The specific claim made in Source 2" }
           ],
           "severity": "low" | "medium" | "high"
         }
      4. If no contradictions exist, return an empty array [].
    `;

        const response = await llm.invoke([
            new SystemMessage("You are a precise technical auditor looking for fine-grained contradictions in research material."),
            new HumanMessage(prompt)
        ]);

        let contradictions: string[] = [];
        try {
            const content = response.content.toString().replace(/```json|```/g, "").trim();
            contradictions = JSON.parse(content);
        } catch (e) {
            console.warn("Failed to parse LLM contradictions");
            contradictions = [];
        }

        return {
            contradictions,
            steps: { checker: { count: contradictions.length, timestamp: new Date() } }
        };
    };
};
