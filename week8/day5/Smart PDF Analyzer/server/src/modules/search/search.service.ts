import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
    async semanticSearch(content: string, query: string) {
        // This is where real vector search would go.
        // For now, we use a simple scoring based on keyword overlap.
        const chunks = content.split('\n\n');
        const queryTerms = query.toLowerCase().split(/\s+/);

        const results = chunks.map(chunk => {
            const chunkLower = chunk.toLowerCase();
            const score = queryTerms.filter(term => chunkLower.includes(term)).length;
            return { chunk, score };
        });

        return results
            .filter(r => r.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(r => r.chunk);
    }
}
