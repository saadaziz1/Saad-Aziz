import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export interface Step {
    id: string;
    name: string;
    status: "pending" | "running" | "completed";
    data?: any;
}

const INITIAL_STEPS: Step[] = [
    { id: "splitter", name: "Deconstruct", status: "pending" },
    { id: "finder", name: "Retrieve", status: "pending" },
    { id: "ranker", name: "Rank", status: "pending" },
    { id: "summarizer", name: "Synthesize", status: "pending" },
    { id: "checker", name: "Audit", status: "pending" },
    { id: "answerer", name: "Report", status: "pending" },
];

export const useResearch = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [finalAnswer, setFinalAnswer] = useState<string | null>(null);
    const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
    const [contradictions, setContradictions] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const updateStepStatus = (id: string, status: "pending" | "running" | "completed", data?: any) => {
        setSteps(prev => prev.map(s => s.id === id ? { ...s, status, data } : s));
    };

    const simulateProgress = async (trace: any) => {
        const stepIds = ["splitter", "finder", "ranker", "summarizer", "checker", "answerer"];
        for (const id of stepIds) {
            updateStepStatus(id, "running");
            await new Promise(resolve => setTimeout(resolve, 800)); // Visual pacing
            updateStepStatus(id, "completed", trace[id]);
        }
    };

    const runResearch = async (query: string) => {
        setIsSearching(true);
        setFinalAnswer(null);
        setError(null);
        setContradictions([]);
        setSteps(INITIAL_STEPS.map(s => ({ ...s, status: "pending" })));

        try {
            updateStepStatus("splitter", "running");

            const res = await fetch(`${API_URL}/research/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            if (!res.ok) throw new Error("Research session failed.");

            const data = await res.json();

            if (data.error) {
                setError(data.error);
                setIsSearching(false);
                return;
            }

            setContradictions(data.contradictions || []);
            await simulateProgress(data.trace);
            setFinalAnswer(data.finalAnswer);
        } catch (err: any) {
            setError(err.message || "An error occurred during research");
        } finally {
            setIsSearching(false);
        }
    };

    return {
        isSearching,
        finalAnswer,
        steps,
        contradictions,
        error,
        runResearch
    };
};
