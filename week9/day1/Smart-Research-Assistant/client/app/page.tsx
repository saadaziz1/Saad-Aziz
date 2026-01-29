"use client";

import React, { useRef } from "react";
import { ResearchInput } from "@/components/ResearchInput";
import { WorkflowTrace } from "@/components/WorkflowTrace";
import { FinalAnswer } from "@/components/FinalAnswer";
import { ContradictionAlert } from "@/components/ContradictionAlert";
import { AlertCircle, Database } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useResearch } from "@/hooks/useResearch";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isUploading,
    error: uploadError,
    uploadFile
  } = useFileUpload();

  const {
    isSearching,
    finalAnswer,
    steps,
    contradictions,
    error: researchError,
    runResearch
  } = useResearch();

  const handleUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const error = uploadError || researchError;

  return (
    <AppLayout
      onUploadClick={() => fileInputRef.current?.click()}
      isUploading={isUploading}
    >
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleUploadChange}
        accept=".pdf"
      />

      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-white lg:text-6xl">
          Knowledge <span className="text-zinc-600">Engine.</span>
        </h1>
      </header>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-red-400">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Research Input Section */}
      <section className="flex flex-col gap-8">
        <ResearchInput onSearch={runResearch} isLoading={isSearching} />
      </section>

      {/* Results Area */}
      <section className="flex flex-col gap-12 w-full">
        {(isSearching || finalAnswer) && (
          <WorkflowTrace steps={steps} contradictions={contradictions} />
        )}

        {finalAnswer && (
          <div className="flex flex-col gap-8 w-full max-w-4xl">
            <ContradictionAlert
              contradictions={contradictions}
            />
            <FinalAnswer content={finalAnswer} />
          </div>
        )}
      </section>

      {!isSearching && !finalAnswer && (
        <div className="mt-20 flex flex-col items-center gap-4 text-center opacity-20">
          <Database size={48} strokeWidth={1} />
          <p className="max-w-xs text-sm font-medium leading-relaxed tracking-wide">
            Upload your research material to begin the automated analysis sequence.
          </p>
        </div>
      )}
    </AppLayout>
  );
}
