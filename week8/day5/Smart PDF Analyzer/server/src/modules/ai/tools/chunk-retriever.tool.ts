import { tool } from '@openai/agents';
import { z } from 'zod';

export const chunkRetrieverTool = tool({
    name: 'chunk_retriever',
    description: 'Retrieves relevant sections or chunks of text from the PDF based on a query.',
    parameters: z.object({
        docId: z.string().describe('The database ID of the PDF document'),
        query: z.string().describe('The search query or keywords to look for'),
    }),
    execute: async ({ docId, query }, { context }: any) => {
        const documentsService = (context as any).documentsService;
        const doc = await documentsService.findById(docId);

        // Enhanced retrieval: split by paragraphs and sentences
        const paragraphs = doc.content.split('\n\n').filter(p => p.trim().length > 0);
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

        // Score each paragraph based on keyword matches
        const scored = paragraphs.map(para => {
            const paraLower = para.toLowerCase();
            let score = 0;

            // Exact phrase match gets highest score
            if (paraLower.includes(queryLower)) {
                score += 10;
            }

            // Individual word matches
            queryWords.forEach(word => {
                if (paraLower.includes(word)) {
                    score += 1;
                }
            });

            return { chunk: para, score };
        });

        // Sort by relevance and return top results
        const relevant = scored
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        return {
            chunks: relevant.map(r => r.chunk),
            totalFound: relevant.length,
            query: query
        };
    },
});
