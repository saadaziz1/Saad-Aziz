"use client";

import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
  number: string;
  isOpen?: boolean;
}

export function FAQItem({
  question,
  answer,
  number,
  isOpen = false,
}: FAQItemProps) {
  const [expanded, setExpanded] = useState(isOpen);

  return (
    <div className="relative">
      {/* Clickable area */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-6 text-left"
      >
        <div className="flex items-start justify-between">
          
          {/* Left side: number + text */}
          <div className="flex items-start gap-4">
            <span className="shrink-0 rounded-sm bg-[#1F1F1F] px-5 py-4 text-lg 3xl:text-2xl font-medium text-white">
              {number}
            </span>

            <div className="flex flex-col">
              <h3 className="text-lg 3xl:text-2xl font-medium text-white transition-colors hover:text-red-500">
                {question}
              </h3>

              {expanded && (
                <p className="mt-3 text-sm 3xl:text-lg leading-relaxed text-gray-400">
                  {answer}
                </p>
              )}
            </div>
          </div>

          {/* Toggle icon */}
          <span className="text-2xl 3xl:text-4xl leading-none text-white">
            {expanded ? "−" : "+"}
          </span>
        </div>
      </button>

      {/* Gradient bottom border */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full
        bg-gradient-to-r from-transparent via-red-600 to-transparent"
      />
    </div>
  );
}
