import { ResearchStateType } from "../workflow.state";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const createQuestionSplitterNode = (llm: BaseChatModel) => {
    return async (state: ResearchStateType) => {
        const { query } = state;
        console.log(`[Node: QuestionSplitter (LLM)] Processing: "${query}"`);

        const prompt = `
      You are a Strategic Research Planner. 
      Break down the following research request into 3-5 distinct sub-queries that cover the necessary depth of the topic.
      
      Guidelines:
      1. Stay strictly within the domain implied by the user's request. Do not invent technical contexts (like blockchain or AI) unless explicitly mentioned.
      2. For broad questions, break them down into fundamental pillars (e.g., History, Architecture, Key Features, Current Status).
      3. Aim for sub-queries that will trigger precise matches in a technical document database without being overly restrictive.
      4. Format your response ONLY as a JSON array of strings.
      
      Research Request: "${query}"
    `;

        const response = await llm.invoke([
            new SystemMessage("You are a technical research architect specializing in deep-dive analysis."),
            new HumanMessage(prompt)
        ]);

        let subQueries: string[] = [];
        try {
            // Clean the response if it contains markdown blocks
            const content = response.content.toString().replace(/```json|```/g, "").trim();
            subQueries = JSON.parse(content);
        } catch (e) {
            console.warn("Failed to parse LLM subqueries, falling back to basic split");
            subQueries = [query];
        }

        return {
            subQueries,
            steps: { splitter: { subQueries, timestamp: new Date() } }
        };
    };
};
