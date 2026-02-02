"use client";
import { useState, useEffect, useRef } from "react";
import { useAskQuestionMutation, useGetConversationQuery } from "../services/chatApi";
import { Message } from "../types/types";
import { toast } from "react-hot-toast";

export const useChat = (initialConversationId: string | null) => {
    const [conversationId, setConversationId] = useState<string | null>(initialConversationId);
    const [history, setHistory] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [askQuestion, { isLoading }] = useAskQuestionMutation();
    const { data: currentConversation } = useGetConversationQuery(
        conversationId!,
        { skip: !conversationId }
    );

    useEffect(() => {
        if (currentConversation?.messages) {
            setHistory(
                currentConversation.messages.map((m: any) => ({
                    role: m.role,
                    payload: m.payload || { type: "text", text: m.content || "" }
                }))
            );
        }
    }, [currentConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const sendMessage = async (question: string) => {
        if (!question.trim() || isLoading) return;
        const q = question.trim();

        setHistory((h) => [...h, { role: "user", payload: { type: "text", text: q } }]);

        try {
            const data = await askQuestion({
                question: q,
                conversationId: conversationId ?? undefined
            }).unwrap();

            if (!conversationId && data.conversationId) {
                setConversationId(data.conversationId);
            }

            setHistory((h) => [...h, { role: "assistant", payload: data }]);
        } catch (err: any) {
            console.error(err);
            const message = err.data?.message || "COMMUNICATION FAILURE: RE-ESTABLISHING LINK...";
            toast.error(message.toUpperCase());
            setHistory((h) => [
                ...h,
                {
                    role: "assistant",
                    payload: {
                        type: "text",
                        text: "Error contacting backend. Please try again.",
                    },
                },
            ]);
        }
    };

    const clearChat = () => {
        setConversationId(null);
        setHistory([]);
    };

    return {
        conversationId,
        setConversationId,
        history,
        sendMessage,
        clearChat,
        isLoading,
        messagesEndRef,
    };
};
