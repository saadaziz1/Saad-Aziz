import { Agent } from '@openai/agents';

type ProductSearchTool = ReturnType<typeof import('../tools/product-search.tool').createProductSearchTool>;

export const createProductRecommendationAgent = (productSearchTool?: ProductSearchTool) => {
    const tools = productSearchTool ? [productSearchTool] : [];

    return new Agent({
        name: 'ProductRecommendationAgent',
        instructions: `You are a helpful healthcare product recommendation assistant.

Your job is to:
1. Understand what health concern or product the user is looking for.
2. Use the search_products tool to find relevant products.
3. Recommend products and explain WHY they might help.

Guidelines:
- ALWAYS use the search_products tool to find real products. Do NOT make up products.
- Be friendly and helpful.
- If products are found, explain briefly why each is relevant.
- Do not give medical advice. Suggest consulting a doctor if needed.`,
        tools,
        model: process.env.AI_MODEL || 'google/gemini-2.0-flash-lite-preview-02-05:free',
        modelSettings: {
            maxTokens: parseInt(process.env.AI_MAX_TOKENS || '800', 10),
        },
    });
};
