"use client";

import React from 'react';
import { KnowledgeBaseForm } from '@/components/KnowledgeBaseForm';
import { AppLayout } from '@/components/layout/AppLayout';
import { BrainCircuit } from 'lucide-react';

export default function KnowledgeBasePage() {
    return (
        <AppLayout>
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight text-white lg:text-6xl">
                    Knowledge <span className="text-zinc-600">Repository.</span>
                </h1>
            </header>

            <div className="relative group/panel">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-4xl blur-xl opacity-0  transition-opacity" />
                <KnowledgeBaseForm />
            </div>

            <div className="mt-12 flex flex-col items-center gap-4 text-center opacity-20">
                <BrainCircuit size={48} strokeWidth={1} />
                <p className="max-w-xs text-sm font-medium leading-relaxed tracking-wide">
                    Feed the intelligent engine with structured data to enhance semantic retrieval accuracy.
                </p>
            </div>
        </AppLayout>
    );
}
