import { ResearchStateType } from "../workflow.state";
import { Model } from "mongoose";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const createDocumentFinderNode = (documentModel: Model<any>, llm: BaseChatModel) => {
    return async (state: ResearchStateType) => {
        const { subQueries } = state;
        console.log(`[Node: DocumentFinder (LLM Filter)] Searching for ${subQueries.length} sub-queries`);

        const candidateDocs: any[] = [];
        const usedIds = new Set<string>();
        const STOP_WORDS = new Set(['what', 'where', 'when', 'how', 'who', 'they', 'them', 'their', 'this', 'that', 'with', 'from', 'about', 'research', 'information', 'details', 'technical']);

        // Pass 1: MongoDB Keyword Retrieval
        for (const q of subQueries) {
            const rawKeywords = q.toLowerCase().replace(/[?.,!]/g, "").split(/\s+/);
            const keywords = rawKeywords.filter(k => k.length > 3 && !STOP_WORDS.has(k));

            if (keywords.length === 0) {
                console.log(`[Finder] No valid keywords for sub-query: "${q}"`);
                continue;
            }

            const regexPattern = keywords.join("|");
            console.log(`[Finder] Searching for keywords: [${keywords.join(", ")}] (Pattern: /${regexPattern}/i)`);

            const docs = await documentModel.find({
                $or: [
                    { title: { $regex: regexPattern, $options: "i" } },
                    { content: { $regex: regexPattern, $options: "i" } }
                ]
            }).limit(10).exec();

            console.log(`[Finder] Found ${docs.length} candidates for sub-query: "${q}"`);

            for (const d of docs) {
                if (!usedIds.has(d._id.toString())) {
                    candidateDocs.push(d);
                    usedIds.add(d._id.toString());
                }
            }
        }

        // Fallback Pass: If still no docs, search for the original query words (broadly)
        if (candidateDocs.length === 0) {
            console.log(`[Finder] No docs found via sub-queries. Attempting broad fallback search...`);
            const fallbackKeywords = state.query.toLowerCase().replace(/[?.,!]/g, "").split(/\s+/).filter(k => k.length > 3 && !STOP_WORDS.has(k));
            if (fallbackKeywords.length > 0) {
                const fallbackPattern = fallbackKeywords.join("|");
                const fallbackDocs = await documentModel.find({
                    $or: [
                        { title: { $regex: fallbackPattern, $options: "i" } },
                        { content: { $regex: fallbackPattern, $options: "i" } }
                    ]
                }).limit(5).exec();

                for (const d of fallbackDocs) {
                    if (!usedIds.has(d._id.toString())) {
                        candidateDocs.push(d);
                        usedIds.add(d._id.toString());
                    }
                }
            }
        }

        if (candidateDocs.length === 0) {
            console.log(`[Finder] Zero documents found even after fallback.`);
            return { documents: [] };
        }

        // Pass 2: LLM Relevancy Filtering
        const docContext = candidateDocs.map((d, i) => `[DOC_ID: ${i}]\nTitle: ${d.title}\nSnippet: ${d.content.substring(0, 800)}`).join("\n\n---\n\n");
        const prompt = `
      You are a Technical Document Auditor. 
      The user's original research goal is: "${state.query}"
      
      The research has been broken down into these specific sub-queries:
      ${subQueries.map((q, i) => `${i + 1}. ${q}`).join("\n")}
      
      Review the candidate documents below and identify which ones contain information relevant to the OVERALL research goal or ANY of the sub-queries.
      
      Format your response ONLY as a JSON array of [DOC_ID] integers.
      Example: [0, 2, 5]
      
      Candidate Documents:
      ${docContext}
    `;

        const response = await llm.invoke([
            new SystemMessage("You are a technical document screening agent. You identify relevant research material with high recall."),
            new HumanMessage(prompt)
        ]);

        let filteredDocs: any[] = [];
        try {
            const content = response.content.toString().replace(/```json|```/g, "").trim();
            const indices = JSON.parse(content);

            // If LLM filtered everything, trust the decision.
            // Previously there was a fallback here, but it caused hallucinations by forcing irrelevant docs.
            if (indices.length === 0 && candidateDocs.length > 0) {
                console.log(`[Finder] LLM filtered all docs. Trusting LLM decision (no relevant docs).`);
                filteredDocs = [];
            } else {
                filteredDocs = indices.map(i => ({
                    id: candidateDocs[i]._id,
                    title: candidateDocs[i].title,
                    content: candidateDocs[i].content,
                    topic: candidateDocs[i].topic,
                    storageUrl: candidateDocs[i].storageUrl
                }));
            }
        } catch (e) {
            console.warn("LLM filtering failed or was too aggressive, returning all candidates");
            filteredDocs = candidateDocs.map(d => ({
                id: d._id,
                title: d.title,
                content: d.content,
                topic: d.topic,
                storageUrl: d.storageUrl
            }));
        }

        return {
            documents: filteredDocs,
            steps: { finder: { count: filteredDocs.length, timestamp: new Date() } }
        };
    };
};
