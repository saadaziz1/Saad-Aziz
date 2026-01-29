import { StateGraph, START, END } from "@langchain/langgraph";
import { ResearchState } from "./workflow.state";
import { createQuestionSplitterNode } from "./nodes/splitter.node";
import { createDocumentFinderNode } from "./nodes/finder.node";
import { rankerNode } from "./nodes/ranker.node";
import { createSummarizerNode } from "./nodes/summarizer.node";
import { createCrossCheckerNode } from "./nodes/checker.node";
import { createFinalAnswerMakerNode } from "./nodes/answerer.node";
import { Model } from "mongoose";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export const buildResearchWorkflow = (documentModel: Model<any>, llm: BaseChatModel) => {
    const workflow = new StateGraph(ResearchState)
        .addNode("splitter", createQuestionSplitterNode(llm))
        .addNode("finder", createDocumentFinderNode(documentModel, llm))
        .addNode("ranker", rankerNode)
        .addNode("summarizer", createSummarizerNode(llm))
        .addNode("checker", createCrossCheckerNode(llm))
        .addNode("answerer", createFinalAnswerMakerNode(llm))
        .addEdge(START, "splitter")
        .addEdge("splitter", "finder")
        .addEdge("finder", "ranker")
        .addEdge("ranker", "summarizer")
        .addEdge("summarizer", "checker")
        .addEdge("checker", "answerer")
        .addEdge("answerer", END);

    return workflow.compile();
};
