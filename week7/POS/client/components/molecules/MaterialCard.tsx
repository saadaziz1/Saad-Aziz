import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { useDeleteRawMaterialMutation } from '@/libreduxservices/rawMaterialApi';
import { useLazyGetProductsByRawMaterialQuery, useDeactivateProductsByRawMaterialMutation } from '@/libreduxservices/productApi';
import { toast } from 'sonner';
import { UsageWarningDialog } from './UsageWarningDialog';

interface MaterialCardProps {
    material: any;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
    const [deleteRawMaterial, { isLoading: isDeleting }] = useDeleteRawMaterialMutation();
    const [checkDependencies] = useLazyGetProductsByRawMaterialQuery();
    const [deactivateProducts, { isLoading: isDeactivating }] = useDeactivateProductsByRawMaterialMutation();
    const [showWarning, setShowWarning] = React.useState(false);
    const [dependentProducts, setDependentProducts] = React.useState<any[]>([]);

    const handleDelete = async () => {
        try {
            // Check for active products using this material
            const products = await checkDependencies(material._id).unwrap();
            setDependentProducts(products || []);
            setShowWarning(true);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to check dependencies");
        }
    };

    const handleConfirmDeactivation = async () => {
        try {
            // First deactivate all dependent products if any actually exist
            if (dependentProducts.length > 0) {
                await deactivateProducts(material._id).unwrap();
            }

            // Then delete the material
            await deleteRawMaterial(material._id).unwrap();

            setShowWarning(false);
            toast.success(dependentProducts.length > 0 ? "Products deactivated and material deleted" : "Material deleted successfully");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to complete operation");
        }
    };

    return (
        <Card className="bg-[#1F1D2B]/40 backdrop-blur-xl border border-white/5 p-5 text-white hover:bg-[#1F1D2B]/60 transition-all duration-300 relative group overflow-hidden shadow-xl hover:shadow-primary/5 hover:translate-y-[-2px] h-[240px] flex flex-col justify-between">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

            <div className="relative z-10">
                <div className="mb-2">
                    <div className="min-w-0 pr-4">
                        <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors line-clamp-1 break-all" title={material.name}>
                            {material.name}
                        </h3>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0" />
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium truncate max-w-[80px]" title={material.unit}>
                                Unit: {material.unit}
                            </p>
                        </div>
                        <div className="flex gap-1 shrink-0">

                            <Link href={`/settings/raw-materials/edit/${material._id}`}>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 h-8 w-8 rounded-full transition-all">
                                    <Edit2 size={14} />
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-gray-400 hover:text-red-400 hover:bg-red-400/5 h-8 w-8 rounded-full transition-all"
                            >
                                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </Button>
                        </div>
                    </div>
                </div>



                <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Current Stock</p>
                        <div className="shrink-0">
                            {material.stockQty <= material.minAlertQty ? (
                                <span className="flex items-center gap-1 text-[8px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] whitespace-nowrap">
                                    <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                                    LOW
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-[8px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                    OK
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="min-w-0 w-full overflow-hidden">
                        <div className="flex items-baseline gap-2">
                            <span className={cn(
                                "text-xl font-black tabular-nums tracking-tighter truncate leading-none py-1 block w-full",
                                material.stockQty === 0 ? "text-gray-600" :
                                    material.stockQty <= material.minAlertQty ? "text-red-500" :
                                        material.stockQty <= material.minAlertQty * 2 ? "text-amber-500" : "text-white"
                            )} title={material.stockQty.toString()}>
                                {material.stockQty}
                            </span>
                            <span className="text-xs font-bold text-gray-500 shrink-0 uppercase tracking-widest leading-none">
                                {material.unit}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 space-y-3">
                {/* Stock Level Bar */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full transition-all duration-1000 ease-out rounded-full",
                            material.stockQty <= material.minAlertQty ? "bg-red-500" :
                                material.stockQty <= material.minAlertQty * 2 ? "bg-amber-500" : "bg-emerald-500"
                        )}
                        style={{
                            width: `${Math.min(100, (material.stockQty / (material.minAlertQty * 5 || 1)) * 100)}%`,
                            boxShadow: material.stockQty > 0 ? '0 0 10px currentColor' : 'none'
                        }}
                    />
                </div>
                <div className="flex justify-between text-[9px] text-gray-600 font-bold uppercase tracking-widest gap-2">
                    <span className="truncate" title={`Threshold: ${material.minAlertQty}`}>Threshold: {material.minAlertQty}</span>
                    <span className="hidden xs:inline truncate" title={`Safety: ${material.minAlertQty * 2}`}>Safety: {material.minAlertQty * 2}</span>
                </div>
            </div>

            <UsageWarningDialog
                isOpen={showWarning}
                onClose={() => setShowWarning(false)}
                onConfirm={handleConfirmDeactivation}
                products={dependentProducts}
                isLoading={isDeactivating || isDeleting}
                title={dependentProducts.length > 0 ? "Dependency Warning" : "Confirm Deletion"}
                description={dependentProducts.length > 0
                    ? `The material "${material.name}" is used in the following active products. If you continue, these products will be set to 'Out of Stock'.`
                    : `Are you sure you want to delete the material "${material.name}"? This action cannot be undone.`}
                confirmText={dependentProducts.length > 0 ? "Deactivate and Delete" : "Delete Material"}
            />
        </Card >
    );
};
