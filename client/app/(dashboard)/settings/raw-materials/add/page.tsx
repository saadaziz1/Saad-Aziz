"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateRawMaterialMutation } from "@/libreduxservices/rawMaterialApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AddRawMaterialPage() {
    const router = useRouter();
    const [createRawMaterial, { isLoading }] = useCreateRawMaterialMutation();

    const [name, setName] = useState("");
    const [unit, setUnit] = useState("g");
    const [stockQty, setStockQty] = useState("");
    const [minAlertQty, setMinAlertQty] = useState("");

    const units = [
        { label: "Gram (g)", value: "g" },
        { label: "Milliliter (ml)", value: "ml" },
        { label: "Pieces (pcs)", value: "pcs" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createRawMaterial({
                name,
                unit,
                stockQty: Number(stockQty),
                minAlertQty: Number(minAlertQty),
            }).unwrap();
            toast.success("Material added successfully");
            router.push("/settings");
        } catch (error: any) {
            console.error("Failed to create raw material:", error);
            toast.error(error?.data?.message || "Failed to add material");
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto h-full pb-10">
            <div className="flex items-center gap-4">
                <Link href="/settings">
                    <Button variant="outline" size="icon" className="border-gray-700 bg-[#1F1D2B] text-white">
                        <ArrowLeft size={18} />
                    </Button>
                </Link>
                <h1 className="text-2xl font-semibold">Add New Raw Material</h1>
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
                            <Label>Initial Stock Qty</Label>
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
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Add Material"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
