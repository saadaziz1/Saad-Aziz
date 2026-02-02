"use client";
import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import StatsCards from "./StatsCard";
import QuickQuestions from "./QuickResponse";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import Sidebar from "./chat/Sidebar";
import SystemStatus from "./chat/SystemStatus";
import CRTLayout from "./layout/CRTLayout";
import { useChat } from "../hooks/useChat";
import { useSidebar } from "../hooks/useSidebar";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const {
    conversationId,
    setConversationId,
    history,
    sendMessage,
    clearChat,
    isLoading,
    messagesEndRef
  } = useChat(null);

  const { isOpen: isSidebarOpen, toggle: toggleSidebar, close: closeSidebar, isMobile } = useSidebar();

  const handleSend = () => {
    sendMessage(question);
    setQuestion("");
  };

  const formatCellValue = (value: unknown) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "number") {
      return value > 999 ? value.toLocaleString() : value.toString();
    }
    return value.toString();
  };

  return (
    <CRTLayout className="flex h-screen overflow-hidden">
      {/* Sidebar - Handles its own responsive logic */}
      <Sidebar
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        onClose={closeSidebar}
        onNewChat={clearChat}
        activeConversationId={conversationId}
        onSelectConversation={setConversationId}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Toggle Button for Desktop / Menu for Mobile */}
        <button
          onClick={toggleSidebar}
          className={`absolute z-[120] pixel-btn !p-2 !border-2 transition-all duration-300 flex items-center justify-center top-1/2 -translate-y-1/2
            ${isMobile
              ? `bg-panel border-cyan-800 text-cyan-400 !p-1.5 ${isSidebarOpen ? "left-[288px] !border-l-0" : "left-0"}`
              : "left-0 !border-l-0 shadow-[4px_0_15px_rgba(45,226,230,0.2)] bg-panel border-cyan-800 text-cyan-400 hover:!bg-cyan-500 hover:!text-black px-1"
            }`}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        <main className={`flex-1 flex flex-col overflow-y-auto custom-scrollbar transition-opacity duration-300 ${isMobile && isSidebarOpen ? "pointer-events-none opacity-20 select-none blur-[2px]" : ""
          }`}>
          <div className="max-w-6xl mx-auto p-4 lg:p-10 w-full flex flex-col flex-1">
            <ChatHeader />

            <div className="space-y-8 flex-1 flex flex-col">
              <StatsCards />

              {!conversationId && history.length === 0 && (
                <QuickQuestions onSelect={setQuestion} />
              )}

              <div className="flex-1 min-h-[500px] max-h-[500px] flex flex-col">
                <ChatMessages
                  history={history}
                  isLoading={isLoading}
                  messagesEndRef={messagesEndRef}
                  formatCellValue={formatCellValue}
                />
              </div>

              <ChatInput
                question={question}
                setQuestion={setQuestion}
                send={handleSend}
                isLoading={isLoading}
              />
            </div>

            <SystemStatus />
          </div>
        </main>
      </div>
    </CRTLayout>
  );
}
