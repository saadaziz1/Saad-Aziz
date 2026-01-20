"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetProductQuery, useUpdateProductMutation, useDeleteProductMutation } from "@/libreduxservices/productApi";
import { useGetRawMaterialsQuery } from "@/libreduxservices/rawMaterialApi";
import { useGetCategoriesQuery } from "@/libreduxservices/categoryApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const { data: product, isLoading: loadingProduct } = useGetProductQuery(id);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const { data: rawMaterials, isLoading: loadingMaterials } = useGetRawMaterialsQuery({});
    const { data: categories } = useGetCategoriesQuery();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [recipe, setRecipe] = useState<{ rawMaterial: string; quantity: number }[]>([]);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price.toString());
            setImagePreview(product.image);
            setRecipe((product.recipe || []).map((item: any) => {
                const materialId = item.rawMaterial && typeof item.rawMaterial === 'object'
                    ? item.rawMaterial._id
                    : (item.rawMaterial || "");
                return {
                    rawMaterial: materialId,
                    quantity: item.quantity || 0
                };
            }));
            setIsActive(product.isActive !== undefined ? product.isActive : true);

            // Set category only if not already set or if explicitly different
            if (product.category) {
                setCategory(product.category);
            }
        }
    }, [product]);

    // Ensure category is re-synced if categories list loads later
    useEffect(() => {
        if (product?.category && categories && categories.length > 0 && !category) {
            setCategory(product.category);
        }
    }, [product, categories, category]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const addRecipeItem = () => {
        setRecipe([...recipe, { rawMaterial: "", quantity: 0 }]);
    };

    const removeRecipeItem = (index: number) => {
        setRecipe(recipe.filter((_, i) => i !== index));
    };

    const updateRecipeItem = (index: number, field: string, value: string | number) => {
        const newRecipe = [...recipe];
        newRecipe[index] = { ...newRecipe[index], [field]: value };
        setRecipe(newRecipe);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Filter and map recipe items
        const filteredRecipe = recipe
            .filter((item) => item.rawMaterial && item.quantity > 0)
            .map((item) => ({
                rawMaterial: typeof item.rawMaterial === 'object' && item.rawMaterial !== null ? (item.rawMaterial as any)._id : item.rawMaterial,
                quantity: Number(item.quantity)
            }));

        if (recipe.length > 0 && filteredRecipe.length === 0) {
            toast.error("Please select a material and enter a quantity for at least one recipe item.");
            return;
        }


        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("isActive", String(isActive));
        if (image) {
            formData.append("image", image);
        }
        formData.append("recipe", JSON.stringify(filteredRecipe));


        try {
            await updateProduct({ id, formData }).unwrap();
            toast.success("Product updated successfully");
            router.push("/settings");
        } catch (error: any) {
            console.error("Failed to update product:", error);
            const message = error?.data?.message;

            let displayMessage = "Failed to update product";
            if (Array.isArray(message)) {
                const firstError = message[0];
                if (typeof firstError === 'string') {
                    displayMessage = firstError;
                } else if (firstError?.constraints) {
                    displayMessage = Object.values(firstError.constraints)[0] as string;
                }
            } else if (typeof message === 'string') {
                displayMessage = message;
            }

            toast.error(displayMessage);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            return;
        }

        try {
            await deleteProduct(id).unwrap();
            toast.success("Product deleted successfully");
            router.push("/settings");
        } catch (error: any) {
            console.error("Failed to delete product:", error);
            const message = error?.data?.message;
            toast.error(Array.isArray(message) ? message[0] : message || "Failed to delete product");
        }
    };

    if (loadingProduct) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto h-full pb-10">
            <div className="flex items-center gap-4">
                <Link href="/settings">
                    <Button variant="outline" size="icon" className="border-gray-700 bg-[#1F1D2B] text-white">
                        <ArrowLeft size={18} />
                    </Button>
                </Link>
                <h1 className="text-2xl font-semibold">Edit Product</h1>
            </div>

            <Card className="bg-[#1F1D2B] border-none p-8 text-white">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Product Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter product name"
                                    maxLength={25}
                                    className="bg-[#2D303E] border-gray-700 text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Price ($)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="9999999999"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        onInput={(e: any) => {
                                            if (e.target.value < 0) e.target.value = 0;
                                            e.target.value = e.target.value.slice(0, 10);
                                        }}
                                        placeholder="0.00"
                                        className="bg-[#2D303E] border-gray-700 text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="bg-[#2D303E] border-gray-700 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1F1D2B] border-gray-700 text-white">
                                            {categories?.map((cat) => (
                                                <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Product Image</Label>
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-6 bg-[#252836] cursor-pointer hover:border-primary transition-colors group relative overflow-hidden h-[180px]">
                                    {imagePreview ? (
                                        <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-gray-500 group-hover:text-primary mb-2" />
                                            <span className="text-sm text-gray-500">Click to upload image</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={isActive ? "active" : "inactive"} onValueChange={(val) => setIsActive(val === "active")}>
                                    <SelectTrigger className="bg-[#2D303E] border-gray-700 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1F1D2B] border-gray-700 text-white">
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Recipe / Materials */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <Label className="text-lg">Bill of Materials / Components</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addRecipeItem}
                                    className="border-primary text-primary hover:bg-primary hover:text-white gap-2"
                                >
                                    <Plus size={16} /> Add Material
                                </Button>
                            </div>

                            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
                                {recipe.map((item, index) => {
                                    const materialId = item.rawMaterial && typeof item.rawMaterial === 'object'
                                        ? (item.rawMaterial as any)._id
                                        : item.rawMaterial;

                                    const materialExists = rawMaterials?.some((rm: any) => rm._id === materialId);
                                    const isMissing = materialId && !materialExists;

                                    return (
                                        <div key={index} className={cn(
                                            "flex flex-col gap-3 bg-[#252836] p-4 rounded-lg relative group",
                                            isMissing && "border border-red-500/50 bg-red-500/5"
                                        )}>
                                            <div className="flex gap-3 items-end w-full">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-xs text-gray-400">Material</Label>
                                                        {isMissing && (
                                                            <span className="text-[10px] text-red-500 font-medium">Material deleted / not found</span>
                                                        )}
                                                    </div>
                                                    <Select
                                                        value={materialId}
                                                        onValueChange={(val) => updateRecipeItem(index, "rawMaterial", val)}
                                                    >
                                                        <SelectTrigger className={cn(
                                                            "bg-[#1F1D2B] border-gray-700 text-white h-9",
                                                            isMissing && "border-red-500/50"
                                                        )}>
                                                            <SelectValue placeholder="Select material" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#1F1D2B] border-gray-700 text-white">
                                                            {rawMaterials?.map((rm: any) => (
                                                                <SelectItem key={rm._id} value={rm._id}>{rm.name} ({rm.unit})</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-24 space-y-2">
                                                    <Label className="text-xs text-gray-400">Qty</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="9999"
                                                        value={item.quantity}
                                                        onChange={(e) => updateRecipeItem(index, "quantity", Number(e.target.value))}
                                                        onInput={(e: any) => {
                                                            if (e.target.value < 0) e.target.value = 0;
                                                            e.target.value = e.target.value.slice(0, 4);
                                                        }}
                                                        className="bg-[#1F1D2B] border-gray-700 text-white h-9"
                                                        required
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeRecipeItem(index)}
                                                    className="text-red-500 hover:bg-red-500/10 h-9 w-9"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {recipe.length === 0 && (
                                    <div className="text-center py-10 border border-dashed border-gray-700 rounded-lg text-gray-500 text-sm">
                                        No materials added yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between gap-4 pt-4 border-t border-gray-700">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                Delete Product
                            </Button>
                            <div className="flex gap-4">
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
                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Update Product"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
}
