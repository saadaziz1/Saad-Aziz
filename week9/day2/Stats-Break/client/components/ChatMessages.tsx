"use client";
import React from "react";
import { Bot } from "lucide-react";
import { Message } from "@/types/types";
import ChatMessage from "./chat/ChatMessage";
import DataTable from "./chat/DataTable";
import EmptyChatState from "./chat/EmptyChatState";

export interface ChatMessagesProps {
  history: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  formatCellValue: (value: unknown) => string;
}

export default function ChatMessages({
  history,
  isLoading,
  messagesEndRef,
  formatCellValue,
}: ChatMessagesProps) {
  return (
    <div className="relative flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-10">
        {history.length === 0 ? (
          <EmptyChatState />
        ) : (
          history.map((m, i) => {
            const payload = m.payload;

            if (typeof payload === "string") {
              return (
                <ChatMessage
                  key={i}
                  role={m.role as "user" | "assistant"}
                  text={payload}
                />
              );
            }

            if (payload.type === "text") {
              return (
                <ChatMessage
                  key={i}
                  role={m.role as "user" | "assistant"}
                  text={payload.text || ""}
                />
              );
            }
            if (payload.type === "table") {
              return (
                <div key={i} className="flex justify-start mb-6 w-full">
                  <DataTable
                    payload={payload as any}
                    formatValue={formatCellValue}
                  />
                </div>
              );
            }
            return null;
          })
        )}

        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="flex flex-col">
              <div className="panel-header !bg-magenta-600 ml-4">PROCESSING</div>
              <div className="pixel-box pixel-box-magenta p-4 relative animate-pulse">
                <div className="flex items-center gap-4">
                  <Bot className="w-4 h-4 text-pink-500" />
                  <span className="text-[10px] pixel-font text-pink-400">
                    FETCHING DATA CORES...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
