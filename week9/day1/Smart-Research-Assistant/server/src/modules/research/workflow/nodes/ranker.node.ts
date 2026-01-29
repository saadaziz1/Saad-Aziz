import { ResearchStateType } from "../workflow.state";
import * as stringSimilarity from "string-similarity";

export const rankerNode = async (state: ResearchStateType) => {
    const { query, documents } = state;
    console.log(`[Node: Ranker] Ranking ${documents.length} documents`);

    const ranked = documents.map(doc => {
        // 1. Text Similarity Score
        const similarity = stringSimilarity.compareTwoStrings(
            query.toLowerCase(),
            doc.content.toLowerCase()
        );

        // 2. Keyword Match Score
        const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 3);
        let matchCount = 0;
        keywords.forEach(k => {
            if (doc.content.toLowerCase().includes(k)) matchCount++;
        });
        const keywordScore = matchCount / (keywords.length || 1);

        // Combine scores
        const score = (similarity * 0.7) + (keywordScore * 0.3);

        return { ...doc, score };
    });

    // Sort by score descending
    const sorted = ranked.sort((a, b) => b.score - a.score);

    return {
        rankedDocs: sorted,
        steps: { ranker: { topScore: sorted[0]?.score || 0, timestamp: new Date() } }
    };
};
