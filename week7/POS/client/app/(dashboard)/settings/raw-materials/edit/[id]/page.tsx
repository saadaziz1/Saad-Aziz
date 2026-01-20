"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetRawMaterialQuery, useUpdateRawMaterialMutation } from "@/libreduxservices/rawMaterialApi";
import { useLazyGetProductsByRawMaterialQuery, useDeactivateProductsByRawMaterialMutation } from "@/libreduxservices/productApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { UsageWarningDialog } from "@/components/molecules/UsageWarningDialog";

export default function EditRawMaterialPage() {
    const router = useRouter();
    const { id } = useParams();
    const { data: material, isLoading: loadingMaterial } = useGetRawMaterialQuery(id);
    const [updateRawMaterial, { isLoading: isUpdating }] = useUpdateRawMaterialMutation();
    const [checkDependencies] = useLazyGetProductsByRawMaterialQuery();
    const [deactivateProducts] = useDeactivateProductsByRawMaterialMutation();

    const [name, setName] = useState("");
    const [unit, setUnit] = useState("g");
    const [stockQty, setStockQty] = useState("");
    const [minAlertQty, setMinAlertQty] = useState("");
    const [showWarning, setShowWarning] = useState(false);
    const [dependentProducts, setDependentProducts] = useState<any[]>([]);

    const units = [
        { label: "Gram (g)", value: "g" },
        { label: "Milliliter (ml)", value: "ml" },
        { label: "Pieces (pcs)", value: "pcs" },
    ];

    useEffect(() => {
        if (material) {
            setName(material.name);
            setUnit(material.unit);
            setStockQty(material.stockQty.toString());
            setMinAlertQty(material.minAlertQty.toString());
        }
    }, [material]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        try {
            // Check if stock is being set to 0
            if (Number(stockQty) === 0) {
                const products = await checkDependencies(id as string).unwrap();
                if (products && products.length > 0) {
                    setDependentProducts(products);
                    setShowWarning(true);
                    return;
                }
            }

            await updateRawMaterial({
                id,
                data: {
                    name,
                    unit,
                    stockQty: Number(stockQty),
                    minAlertQty: Number(minAlertQty),
                }
            }).unwrap();
            toast.success("Material updated successfully");
            router.push("/settings");
        } catch (error: any) {
            console.error("Failed to update raw material:", error);
            toast.error(error?.data?.message || "Failed to update material");
        }
    };

    const handleConfirmDeactivation = async () => {
        try {
            await deactivateProducts(id as string).unwrap();
            await updateRawMaterial({
                id,
                data: {
                    name,
                    unit,
                    stockQty: 0,
                    minAlertQty: Number(minAlertQty),
                }
            }).unwrap();

            setShowWarning(false);
            toast.success("Products deactivated and stock set to 0");
            router.push("/settings");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to complete operation");
        }
    };

    if (loadingMaterial) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto h-full pb-10">
            <div className="flex items-center gap-4">
                <Link href="/settings">
                    <Button variant="outline" size="icon" className="border-gray-700 bg-[#1F1D2B] text-white">
                        <ArrowLeft size={18} />
                    </Button>
                </Link>
                <h1 className="text-2xl font-semibold">Edit Raw Material</h1>
            </div>

            <Card className="bg-[#1F1D2B] border-none p-8 text-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Material Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Raw Material 1"
                            maxLength={25}
                            className="bg-[#2D303E] border-gray-700 text-white"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Unit of Measure</Label>
                            <Select value={unit} onValueChange={setUnit}>
                                <SelectTrigger className="bg-[#2D303E] border-gray-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1F1D2B] border-gray-700 text-white">
                                    {units.map(u => (
                                        <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Stock Qty</Label>
                            <Input
                                type="number"
                                min="0"
                                max="9999999"
                                value={stockQty}
                                onChange={(e) => setStockQty(e.target.value)}
                                onInput={(e: any) => {
                                    if (e.target.value < 0) e.target.value = 0;
                                    e.target.value = e.target.value.slice(0, 7);
                                }}
                                placeholder="0"
                                className="bg-[#2D303E] border-gray-700 text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Low Stock Alert Threshold</Label>
                        <Input
                            type="number"
                            min="0"
                            max="9999999"
                            value={minAlertQty}
                            onChange={(e) => setMinAlertQty(e.target.value)}
                            onInput={(e: any) => {
                                if (e.target.value < 0) e.target.value = 0;
                                e.target.value = e.target.value.slice(0, 7);
                            }}
                            placeholder="Threshold for notification"
                            className="bg-[#2D303E] border-gray-700 text-white"
                            required
                        />
                        <p className="text-xs text-gray-500">You will be notified when stock falls below this amount.</p>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="bg-transparent border-gray-700 text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
                        >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Update Material"}
                        </Button>
                    </div>
                </form>
            </Card>

            <UsageWarningDialog
                isOpen={showWarning}
                onClose={() => setShowWarning(false)}
                onConfirm={handleConfirmDeactivation}
                products={dependentProducts}
                title="Zero Stock Warning"
                description={`Setting this material to 0 stock will make the following active products unavailable. If you continue, these products will be set to 'Out of Stock' (Deactivated).`}
            />
        </div>
    );
}
