import React from 'react';
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaterialCard } from "../molecules/MaterialCard";
import Link from "next/link";

interface RawMaterialManagementProps {
    materials: any[];
    isLoading: boolean;
}

export const RawMaterialManagement: React.FC<RawMaterialManagementProps> = ({ materials, isLoading }) => {
    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1F1D2B]/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm mb-8 shrink-0">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-white line-clamp-1">Raw Materials</h2>
                    <p className="text-sm text-gray-400 font-medium line-clamp-1">Manage your inventory and stock levels</p>
                </div>
                <Link href="/settings/raw-materials/add" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-2 px-6 h-11 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Plus size={18} />
                        <span className="font-bold uppercase tracking-wider text-xs">Add New Material</span>
                    </Button>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pr-2 pb-10">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
                        {materials?.map((rm: any, index: number) => (
                            <div
                                key={rm._id}
                                className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <MaterialCard material={rm} />
                            </div>
                        ))}

                        {(!materials || materials.length === 0) && (
                            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-[#1F1D2B]/10 rounded-3xl border border-dashed border-white/5 animate-in fade-in zoom-in-95 duration-700">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-600 shadow-inner">
                                    <Plus size={32} />
                                </div>
                                <p className="text-gray-400 font-semibold text-lg">No raw materials found</p>
                                <p className="text-sm text-gray-600 mt-1 max-w-[250px] text-center">Start by adding your first production material to the system</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
