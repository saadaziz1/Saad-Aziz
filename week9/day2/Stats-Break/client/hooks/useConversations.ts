"use client";
import { useState } from "react";
import { useListConversationsQuery } from "../services/chatApi";
import { useSelector } from "react-redux";

export const useConversations = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const auth = useSelector((state: any) => state.auth);

    const { data: conversations, isLoading } = useListConversationsQuery(20, {
        skip: !auth.user,
    });

    const filteredConversations =
        conversations?.filter((c: any) =>
            (c.title || c.firstMessage || "Untitled")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        ) || [];

    return {
        conversations: filteredConversations,
        searchTerm,
        setSearchTerm,
        isLoading
    };
};
