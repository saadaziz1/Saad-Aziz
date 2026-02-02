"use client";
import React from "react";
import { BarChart3 } from "lucide-react";

interface DataTableProps {
    payload: {
        text?: string;
        columns: string[];
        rows: any[][];
    };
    formatValue: (val: any) => string;
}

export default function DataTable({ payload, formatValue }: DataTableProps) {
    const filteredColumns = payload.columns.filter(
        (c) => c && c.toLowerCase() !== "_id" && !c.toLowerCase().startsWith("unnamed")
    );

    const columnIndexes = payload.columns
        .map((c, index) =>
            c && c.toLowerCase() !== "_id" && !c.toLowerCase().startsWith("unnamed")
                ? index
                : null
        )
        .filter((i) => i !== null) as number[];

    const filteredRows = payload.rows.map((row) =>
        columnIndexes.map((i) => row[i])
    );

    return (
        <div className="w-full max-w-4xl">
            <div className="panel-header !bg-cyan-500 ml-4">DATA GRID v2.0</div>
            <div className="pixel-box border-cyan-400 !bg-panel p-0 overflow-hidden shadow-[0_0_20px_rgba(45,226,230,0.1)]">
                {payload.text && (
                    <div className="px-4 sm:px-6 py-3 bg-cyan-900/30 border-b-2 border-cyan-800">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-4 h-4 text-cyan-400" />
                            <p className="text-[9px] sm:text-[10px] pixel-font text-cyan-200 glow-text-cyan uppercase">
                                {payload.text}
                            </p>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
                    <table className="min-w-full text-[9px] sm:text-[10px] font-mono">
                        <thead>
                            <tr className="bg-cyan-900/50">
                                {filteredColumns.map((c, index) => (
                                    <th
                                        key={index}
                                        className="px-4 py-3 text-left text-cyan-400 uppercase font-bold tracking-wider border-b-2 border-cyan-800 whitespace-nowrap"
                                    >
                                        {c}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-purple-900/30">
                            {filteredRows.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="hover:bg-cyan-500/10 transition-colors group"
                                >
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="px-4 py-2 text-cyan-100/80 whitespace-nowrap group-hover:text-cyan-300"
                                        >
                                            {formatValue(cell)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-4 py-2 bg-black/40 flex items-center justify-between border-t border-cyan-900/50">
                    <p className="text-[8px] pixel-font text-purple-400">
                        RECORDS FOUND {filteredRows.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyan-500 animate-pulse shadow-[0_0_5px_#2de2e6]"></div>
                        <span className="text-[8px] pixel-font text-cyan-500 opacity-60 hidden sm:inline">
                            VERIFIED DATA BLOCK
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
