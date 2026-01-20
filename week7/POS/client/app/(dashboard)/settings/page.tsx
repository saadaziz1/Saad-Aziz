"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGetProductsQuery } from "@/libreduxservices/productApi";
import { useGetRawMaterialsQuery } from "@/libreduxservices/rawMaterialApi";
import { useGetCategoriesQuery } from "@/libreduxservices/categoryApi";
import { SettingsNav } from "@/components/organisms/SettingsNav";
import { ProductManagement } from "@/components/organisms/ProductManagement";
import { RawMaterialManagement } from "@/components/organisms/RawMaterialManagement";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("Products Management");
    const [activeCategory, setActiveCategory] = useState("");

    const { data: categories } = useGetCategoriesQuery();

    // Set initial category when categories load
    useEffect(() => {
        if (categories && categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0].name);
        }
    }, [categories, activeCategory]);

    const { data: products, isLoading: loadingProducts } = useGetProductsQuery(
        activeTab === "Products Management" && activeCategory ? { category: activeCategory } : {}
    );
    const { data: rawMaterials, isLoading: loadingMaterials } = useGetRawMaterialsQuery(
        {}, { skip: activeTab !== "Raw Materials" }
    );

    return (
        <div className="flex flex-col h-full lg:flex-row gap-6 overflow-y-auto lg:overflow-hidden max-w-[1400px] mx-auto w-full px-4 lg:px-6 pb-24 lg:pb-0 no-scrollbar">
            <h1 className="text-2xl font-semibold shrink-0 lg:hidden">Settings</h1>

            <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0 h-auto lg:h-full overflow-visible lg:overflow-hidden">
                <div className="shrink-0 w-full lg:w-[300px]">
                    <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                <div className="flex-1 flex flex-col h-auto lg:h-full overflow-visible lg:overflow-hidden min-w-0">
                    <div className="hidden lg:block mb-6 shrink-0">
                        <h1 className="text-2xl font-semibold">Settings</h1>
                    </div>

                    <Card className="flex-1 bg-[#1F1D2B] border-none p-6 flex flex-col h-auto lg:h-full rounded-xl overflow-visible lg:overflow-hidden shrink-0">
                        <div className="flex-1 overflow-visible lg:overflow-y-auto no-scrollbar">
                            {activeTab === "Products Management" && (
                                <ProductManagement
                                    products={products || []}
                                    isLoading={loadingProducts}
                                    activeCategory={activeCategory}
                                    onCategoryChange={setActiveCategory}
                                />
                            )}

                            {activeTab === "Raw Materials" && (
                                <RawMaterialManagement
                                    materials={rawMaterials || []}
                                    isLoading={loadingMaterials}
                                />
                            )}

                            {!["Products Management", "Raw Materials"].includes(activeTab) && (
                                <div className="flex flex-col items-center justify-center h-64 lg:h-full text-gray-500">
                                    <SlidersHorizontal className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-lg">{activeTab} settings coming soon</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
