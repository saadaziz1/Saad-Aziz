/**
 * Domain Relevancy Guardrail
 * Ensures the user query is related to cricket, sports, or the current conversation about cricket.
 */
export const createDomainGuard = (aiService: any) => ({
    name: 'domain_relevancy_guard',
    execute: async ({ input }: any) => {
        const query = typeof input === 'string' ? input : JSON.stringify(input);

        // We call the AI service to perform a semantic check
        const isRelevant = await aiService.checkRelevancy(query);

        return {
            tripwireTriggered: !isRelevant,
            outputInfo: isRelevant ? 'Query is relevant' : 'Query rejected: Out of domain'
        };
    }
});
