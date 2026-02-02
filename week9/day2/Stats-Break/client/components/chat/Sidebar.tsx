"use client";
import React from "react";
import { MessageCircle, Plus, Search, Archive, X } from "lucide-react";
import ConversationItem from "./ConversationItem";
import { useConversations } from "../../hooks/useConversations";

interface SidebarProps {
    isOpen: boolean;
    isMobile: boolean;
    onClose: () => void;
    onNewChat: () => void;
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
}

export default function Sidebar({
    isOpen,
    isMobile,
    onClose,
    onNewChat,
    activeConversationId,
    onSelectConversation,
}: SidebarProps) {
    const { conversations, searchTerm, setSearchTerm } = useConversations();

    const sidebarContent = (
        <aside
            className={`flex flex-col bg-panel border-r-4 border-cyan-900 h-full transition-all duration-300 ease-in-out ${isMobile
                ? `fixed inset-y-0 left-0 z-[110] ${isOpen ? "translate-x-0" : "-translate-x-full"} w-72 !bg-[#0b021d]`
                : `${isOpen ? "w-80" : "w-0"} overflow-hidden`
                }`}
        >
            <div className="p-6 border-b-2 border-cyan-900/50">
                <div className="flex items-center justify-between mb-2">
                    <div className="panel-header !bg-cyan-600">SYSTEM LOGS</div>
                </div>

                <div className="flex items-center justify-between mb-4 mt-2">
                    <h2 className="text-[10px] pixel-font text-cyan-400 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        DATA STREAMS
                    </h2>
                    <button
                        onClick={() => {
                            onNewChat();
                            if (isMobile) onClose();
                        }}
                        className="pixel-btn !p-2 !shadow-sm hover:!bg-cyan-500"
                        title="Initialize New Link"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-cyan-800" />
                    <input
                        type="text"
                        placeholder="FILTER NODES..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pixel-input !py-2 !pl-10 !text-[8px] w-full"
                        maxLength={50}
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {conversations.length === 0 ? (
                    <div className="text-center py-12 text-purple-900/50">
                        <Archive className="w-10 h-10 mx-auto mb-4 opacity-20" />
                        <p className="text-[10px] pixel-font">STORAGE VOID</p>
                    </div>
                ) : (
                    conversations.map((c: any) => (
                        <ConversationItem
                            key={c._id}
                            id={c._id}
                            title={c.title || c.firstMessage || "UNTITLED MOD"}
                            createdAt={c.createdAt}
                            updatedAt={c.updatedAt}
                            isActive={c._id === activeConversationId}
                            onClick={() => {
                                onSelectConversation(c._id);
                                if (isMobile) onClose();
                            }}
                        />
                    ))
                )}
            </div>
        </aside>
    );

    return (
        <>
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}
            {sidebarContent}
        </>
    );
}
