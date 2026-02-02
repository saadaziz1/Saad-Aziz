import { Agent } from '@openai/agents';

export const titleAgent = new Agent({
    name: 'TitleAgent',
    instructions: `
You are a Title Generation Specialist.
Your ONLY job is to generate a concise, catchy 3-word title for a cricket conversation based on the first message provided.
Do NOT include quotes or periods in the title.
Example:
Input: "Who is Virat Kohli?"
Output: Virat Kohli Profile
`,
    model: process.env.AI_MODEL || 'google/gemini-2.0-flash-exp:free',
    modelSettings: {
        maxTokens: 20,
    },
});
