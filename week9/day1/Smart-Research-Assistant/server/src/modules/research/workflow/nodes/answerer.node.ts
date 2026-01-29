import { ResearchStateType } from "../workflow.state";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const createFinalAnswerMakerNode = (llm: BaseChatModel) => {
    return async (state: ResearchStateType) => {
        const { query, summaries, contradictions } = state;
        console.log(`[Node: FinalAnswerMaker (LLM)] Synthesizing answer for: "${query}"`);

        if (summaries.length === 0) {
            return {
                finalAnswer: "I couldn't find any relevant documents to answer your question. Please ensure you've uploaded PDFs related to this topic.",
                steps: { answerer: { success: false, timestamp: new Date() } }
            };
        }

        const researchContext = summaries.map((s, i) => `[[${i + 1}]] Source: ${s.title}\nContent: ${s.summary}`).join("\n\n");
        const contradictionsContext = contradictions.length > 0
            ? contradictions.map((c: any) => `- [${c.type}] ${c.message}\n  ${c.conflictingStatements.map((s: any) => `  * ${s.source}: "${s.statement}"`).join("\n")}`).join("\n\n")
            : "None detected.";

        const prompt = `
      You are a Chief Research Officer synthesizing a final technical intelligence report.
      
      Objective: Provide a definitive answer to: "${query}"
      
      Input Data:
      ${researchContext}
      
      Cross-Analysis Results:
      ${contradictionsContext}
      
      Reporting Requirements:
      1. STRICT SOURCE ADHERENCE: Use ONLY information explicitly found in the provided "Input Data". DO NOT add any outside knowledge, assumptions, or information not present in the sources.
      2. If the provided sources do not contain the answer, explicitly state that the information is not available in the database.
      3. Structure your answer as a professional technical report (Overview, Analysis,Contradictions(contradicting snectences from sources included) Synthesis, Conclusion).
      4. Use in-text citations like [[1]], [[2]] when referencing specific facts from the sources.
      5. Do not just summarize sources; synthesize them into a cohesive narrative.
      6. Explicitly discuss the implications of any detected contradictions.
      7. Include a "References" section at the end mapping the citation numbers to document titles.
      8. Include an "Information Gaps" section if critical data is missing from the provided sources.
    `;

        const response = await llm.invoke([
            new SystemMessage("You are a technical research leader. You produce high-density, cited, and synthesized research reports."),
            new HumanMessage(prompt)
        ]);

        const finalAnswer = response.content.toString();

        return {
            finalAnswer,
            steps: { answerer: { length: finalAnswer.length, timestamp: new Date() } }
        };
    };
};
