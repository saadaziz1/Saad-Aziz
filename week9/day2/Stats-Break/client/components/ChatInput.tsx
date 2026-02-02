"use client";
import { Send, Sparkles, Loader } from "lucide-react";

interface ChatInputProps {
  question: string;
  setQuestion: (q: string) => void;
  send: () => void;
  isLoading: boolean;
}

export default function ChatInput({ question, setQuestion, send, isLoading }: ChatInputProps) {
  const charCount = question.length;
  const maxChars = 1000;
  const isNearLimit = charCount > maxChars * 0.8;

  return (
    <div className="relative">
      <div className="panel-header !bg-cyan-500 ml-4">INPUT TERMINAL</div>
      <div className="pixel-box border-cyan-400 !bg-panel p-6 shadow-[0_0_25px_rgba(45,226,230,0.1)]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) send();
              }}
              className="pixel-input"
              placeholder="INPUT COMMAND >"
              disabled={isLoading}
              maxLength={maxChars}
            />

            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] pixel-font ${isNearLimit ? 'text-pink-500 glow-text-magenta' : 'text-cyan-900'
              }`}>
              [{charCount}/{maxChars}]
            </div>
          </div>

          <button
            onClick={send}
            disabled={isLoading || !question.trim()}
            className="pixel-btn px-10 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>SYNCING...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>UPLINK</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-cyan-900/30 pt-4">
          <div className="flex items-center gap-4 text-[8px] pixel-font text-purple-400 uppercase">
            <span className="flex items-center gap-1">
              [ENTER] DISPATCH
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-cyan-500 animate-pulse"></div>
              CHANNEL ENCRYPTED {">"} AES 256
            </span>
          </div>

          <div className="text-[8px] pixel-font text-purple-400 uppercase">
            {charCount > 0 && `PAYLOAD SIZE ${charCount * 8} BITS`}
          </div>
        </div>
      </div>
    </div>
  );
}
