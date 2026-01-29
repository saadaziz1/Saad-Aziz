import { Annotation } from "@langchain/langgraph";

export const ResearchState = Annotation.Root({
    query: Annotation<string>(),
    subQueries: Annotation<string[]>({
        reducer: (x, y) => y ?? x,
        default: () => [],
    }),
    documents: Annotation<any[]>({
        reducer: (x, y) => [...x, ...y],
        default: () => [],
    }),
    rankedDocs: Annotation<any[]>({
        reducer: (x, y) => y ?? x,
        default: () => [],
    }),
    summaries: Annotation<any[]>({
        reducer: (x, y) => y ?? x,
        default: () => [],
    }),
    contradictions: Annotation<string[]>({
        reducer: (x, y) => [...x, ...y],
        default: () => [],
    }),
    finalAnswer: Annotation<string>(),
    steps: Annotation<Record<string, any>>({
        reducer: (x, y) => ({ ...x, ...y }),
        default: () => ({}),
    }),
});

export type ResearchStateType = typeof ResearchState.State;
