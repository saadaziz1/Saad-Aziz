import { Agent } from '@openai/agents';

export const relevancyAgent = new Agent({
    name: 'RelevancyAgent',
    instructions: `
You are a Relevancy Guardrail. 
Your ONLY job is to determine if a query is related STRICTLY to cricket or the current conversation history about cricket.
If the query is about ANY other sport (football, tennis, etc.), answer 'NO'.
Answer ONLY with 'YES' or 'NO'.
`,
    model: process.env.AI_MODEL || 'google/gemini-2.0-flash-exp:free',
    modelSettings: {
        maxTokens: 5,
    },
});
