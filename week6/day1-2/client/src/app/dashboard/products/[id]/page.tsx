"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useRouter } from "next/navigation";
import {
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} from "@/api/productsApi";
import { DashboardLayout } from "@/components/dashboard-page/DashboardLayout";
import { ChevronRight, Upload, X, Check, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

import { ProductCategory, ProductSize, DressStyle, ProductColor, ProductType, PurchaseType } from "@/types/product.types";

const schema = yup.object().shape({
    name: yup.string().required("Product name is required"),
    description: yup.string().required("Description is required"),
    category: yup.string().required("Category is required"),
    brand: yup.string(),
    sku: yup.string(),
    stock: yup.number().typeError("Must be a number").min(0).required("Stock is required"),
    totalStock: yup.number().typeError("Must be a number").min(0).required("Total stock is required"),
    price: yup.number().typeError("Must be a number").min(0).required("Regular price is required"),
    pointsPrice: yup.number().typeError("Must be a number").min(0).required("Points price is required"),
    salePrice: yup.number().typeError("Must be a number").min(0),
    purchaseType: yup.string().required("Purchase type is required"),
    isOnSale: yup.boolean(),
    type: yup.string().required("Type is required"),
    dressStyle: yup.string().required("Dress style is required"),
    colors: yup.array().min(1, "At least one color is required"),
    sizes: yup.array().min(1, "At least one size is required"),
    tags: yup.array(),
});

export default function ProductDetailsPage() {
    const { id } = useParams();
    const isNew = id === "new";
    const router = useRouter();

    const { data: product, isLoading: isLoadingProduct } = useGetProductQuery(id as string, {
        skip: isNew,
    });

    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            tags: [],
            price: 0,
            salePrice: 0,
            isOnSale: false,
            purchaseType: PurchaseType.MONEY_ONLY,
            stock: 0,
            totalStock: 0,
            colors: [],
            sizes: [],
            category: ProductCategory.MENS_CLOTHING,
            dressStyle: DressStyle.CASUAL,
            type: ProductType.TSHIRTS,
            brand: "",
            sku: ""
        },
    });

    const tags = watch("tags") || [];
    const selectedColors = watch("colors") || [];
    const selectedSizes = watch("sizes") || [];

    useEffect(() => {
        if (product && !isNew) {
            const dp = product.discountPercentage || 0;
            const salePrice = dp > 0
                ? Math.round(product.price * (1 - dp / 100))
                : product.price;

            reset({
                name: product.name,
                description: product.description,
                category: product.category,
                brand: product.brand,
                sku: product.sku,
                stock: product.stock,
                totalStock: product.totalStock || product.stock + 50,
                price: product.price,
                pointsPrice: product.pointsPrice || 0,
                salePrice: salePrice,
                isOnSale: product.isOnSale || (dp > 0),
                purchaseType: product.purchaseType || ((product as any).isPointsOnly ? PurchaseType.POINTS_ONLY : (product as any).isHybrid ? PurchaseType.HYBRID : PurchaseType.MONEY_ONLY),
                tags: product.tags || [],
                type: product.type || ProductType.TSHIRTS,
                dressStyle: product.dressStyle || DressStyle.CASUAL,
                colors: product.colors || [],
                sizes: product.sizes || [],
            });
            setExistingImages(product.gallery || []);
        }
    }, [product, isNew, reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const totalImages = images.length + existingImages.length + newFiles.length;

            if (totalImages > 3) {
                toast.error("Maximum 3 images allowed");
                return;
            }

            setImages((prev) => [...prev, ...newFiles]);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number, isExisting: boolean) => {
        if (isExisting) {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setImages(prev => prev.filter((_, i) => i !== index));
            setPreviews(prev => prev.filter((_, i) => i !== index));
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setValue("tags", [...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setValue("tags", tags.filter((t: string) => t !== tagToRemove));
    };

    const toggleColor = (color: string) => {
        const current = selectedColors as string[];
        if (current.includes(color)) {
            setValue("colors", current.filter(c => c !== color));
        } else {
            setValue("colors", [...current, color]);
        }
    };

    const toggleSize = (size: string) => {
        const current = selectedSizes as string[];
        if (current.includes(size)) {
            setValue("sizes", current.filter(s => s !== size));
        } else {
            setValue("sizes", [...current, size]);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("category", data.category);
            formData.append("type", data.type);
            formData.append("dressStyle", data.dressStyle);
            formData.append("brand", data.brand || "");
            formData.append("sku", data.sku || "");
            formData.append("stock", data.stock.toString());
            formData.append("totalStock", data.totalStock.toString());
            formData.append("price", data.price.toString());
            formData.append("pointsPrice", (data.pointsPrice || 0).toString());
            formData.append("purchaseType", data.purchaseType);


            let discountPercentage = 0;
            if (data.isOnSale && data.salePrice < data.price) {
                discountPercentage = Math.round((1 - data.salePrice / data.price) * 100);
            }
            formData.append("discountPercentage", discountPercentage.toString());
            formData.append("isOnSale", (data.isOnSale && discountPercentage > 0).toString());

            data.tags.forEach((tag: string) => formData.append("tags", tag));
            data.colors.forEach((color: string) => formData.append("colors", color));
            data.sizes.forEach((size: string) => formData.append("sizes", size));

            images.forEach((file) => formData.append("images", file));

            if (isNew) {
                await createProduct(formData).unwrap();
                toast.success("Product created successfully");

            } else {
                await updateProduct({ id: id as string, formData }).unwrap();
                toast.success("Product updated successfully");
            }
            router.push("/dashboard/products");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to save product");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id as string).unwrap();
                toast.success("Product deleted successfully");
                router.push("/dashboard/products");
            } catch (err: any) {
                toast.error("Failed to delete product");
            }
        }
    };

    if (isLoadingProduct && !isNew) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-10 h-10 animate-spin text-[#003B5C]" />
                </div>
            </DashboardLayout>
        );
    }

    const price = watch("price") || 0;
    const salePriceValue = watch("salePrice") || 0;
    const isOnSale = watch("isOnSale");
    const purchaseType = watch("purchaseType");
    const isPointsOnly = purchaseType === PurchaseType.POINTS_ONLY;
    const isHybrid = purchaseType === PurchaseType.HYBRID;
    const showDiscount = isOnSale && price > 0 && salePriceValue > 0 && salePriceValue < price;
    const discountPercentageValue = showDiscount ? Math.round((1 - salePriceValue / price) * 100) : 0;

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                    <span>Home</span>
                    <ChevronRight className="w-3 h-3 mx-1" />
                    <span>All Products</span>
                    <ChevronRight className="w-3 h-3 mx-1" />
                    <span className="text-gray-600">Product Details</span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="lg:col-span-2 space-y-6 ">
                    <div className=" p-6  space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-bold text-gray-900 uppercase mb-1.5 px-1">Product Name</label>
                                <input
                                    {...register("name")}
                                    className={cn(
                                        "w-full px-4 py-3 rounded-lg border text-sm transition-all focus:ring-1 focus:ring-[#003B5C]",
                                        errors.name ? "border-red-500" : "border-gray-200"
                                    )}
                                    placeholder="Enter product name"
                                />
                                {errors.name && <p className="text-red-500 text-[10px] mt-1">{String((errors.name as any).message)}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-900 uppercase mb-1.5 px-1">Description</label>
                            <textarea
                                {...register("description")}
                                rows={4}
                                className={cn(
                                    "w-full px-4 py-3 rounded-lg border text-sm transition-all focus:ring-1 focus:ring-[#003B5C]",
                                    errors.description ? "border-red-500" : "border-gray-200"
                                )}
                                placeholder="Enter product description"
                            />
                            {errors.description && <p className="text-red-500 text-[10px] mt-1">{String((errors.description as any).message)}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-900 uppercase mb-1.5 px-1">Category</label>
                                <select
                                    {...register("category")}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-[#003B5C] bg-white capitalize"
                                >
                                    {Object.values(ProductCategory).map(cat => (
                                        <option key={cat} value={cat}>{cat.replace(/-/g, ' ')}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-900 uppercase mb-1.5 px-1">Dress Style</label>
                                <select
                                    {...register("dressStyle")}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-[#003B5C] bg-white capitalize"
                                >
                                    {Object.values(DressStyle).map(style => (
                                        <option key={style} value={style}>{style}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-900 uppercase mb-1.5 px-1">Product Type</label>
                                <select
                                    {...register("type")}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-[#003B5C] bg-white capitalize"
                                >
                                    {Object.values(ProductType).map(type => (
                                        <option key={type} value={type}>{type.replace(/-/g, ' ')}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-900 uppercase mb-1.5 px-1">Brand Name</label>
                                <input
                                    {...register("brand")}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-[#003B5C]"
                                    placeholder="e.g. Adidas"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-900 uppercase mb-1.5 px-1">SKU (Auto-Generated)</label>
                                <input
                                    {...register("sku")}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-[#003B5C]"
                                    placeholder="Leave empty to auto-generate"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-900 uppercase mb-1.5 px-1">Stock Quantity</label>
                                <input
                                    type="number"
                                    {...register("stock")}
                                    className={cn(
                                        "w-full px-4 py-3 rounded-lg border text-sm focus:ring-1 focus:ring-[#003B5C]",
                                        errors.stock ? "border-red-500" : "border-gray-200"
                                    )}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-900 uppercase mb-1.5 px-1">Target Total Stock</label>
                                <input
                                    type="number"
                                    {...register("totalStock")}
                                    className={cn(
                                        "w-full px-4 py-3 rounded-lg border text-sm focus:ring-1 focus:ring-[#003B5C]",
                                        errors.totalStock ? "border-red-500" : "border-gray-200"
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end pt-2">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-900 uppercase mb-1.5 px-1">Regular Price ($)</label>
                                <input
                                    type="number"
                                    {...register("price")}
                                    disabled={isPointsOnly}
                                    className={cn(
                                        "w-full px-4 py-3 rounded-lg border text-sm focus:ring-1 focus:ring-[#003B5C]",
                                        errors.price ? "border-red-500" : "border-gray-200",
                                        isPointsOnly && "bg-gray-50 opacity-50"
                                    )}
                                />
                                {errors.price && <p className="text-red-500 text-[10px] mt-1">{String((errors.price as any).message)}</p>}
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-900 uppercase mb-1.5 px-1">Points Price</label>
                                <input
                                    type="number"
                                    {...register("pointsPrice")}
                                    disabled={!isPointsOnly && !isHybrid}
                                    className={cn(
                                        "w-full px-4 py-3 rounded-lg border text-sm focus:ring-1 focus:ring-[#003B5C]",
                                        errors.pointsPrice ? "border-red-500" : "border-gray-200",
                                        (!isPointsOnly && !isHybrid) && "bg-gray-50 opacity-50"
                                    )}
                                    placeholder="e.g. 500"
                                />
                                {errors.pointsPrice && <p className="text-red-500 text-[10px] mt-1">{String((errors.pointsPrice as any).message)}</p>}
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 flex items-center space-x-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        {...register("isOnSale")}
                                        disabled={isPointsOnly}
                                        className="w-4 h-4 rounded border-gray-300 text-[#003B5C] focus:ring-[#003B5C]"
                                    />
                                    <span className="text-[11px] font-bold text-gray-900 uppercase">On Sale</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        {...register("salePrice")}
                                        disabled={!isOnSale || isPointsOnly}
                                        className={cn(
                                            "w-full px-4 py-3 rounded-lg border text-sm transition-all focus:ring-1 focus:ring-[#003B5C]",
                                            (!isOnSale || isPointsOnly) ? "bg-gray-50 border-gray-100 text-gray-400" : "border-gray-200"
                                        )}
                                        placeholder={isOnSale ? "Enter sale price" : "Enable On Sale"}
                                    />
                                </div>
                            </div>
                            {showDiscount && (
                                <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-100 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase">Discount</span>
                                    <span className="text-sm font-black italic">
                                        -{discountPercentageValue}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-violet-50/50 p-6 rounded-2xl border border-violet-100 space-y-4 mt-6">
                        <h3 className="text-xs font-bold text-[#003B5C] uppercase tracking-widest flex items-center">
                            <div className="w-2 h-2 bg-violet-500 rounded-full mr-2" />
                            Payment Strategy & Loyalty
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className={cn(
                                "flex flex-col p-4 border rounded-xl cursor-pointer transition-all",
                                watch("purchaseType") === PurchaseType.MONEY_ONLY ? "bg-white border-[#003B5C] shadow-sm" : "bg-white/50 border-gray-100 opacity-60"
                            )}>
                                <div className="flex justify-between items-start mb-2">
                                    <input
                                        {...register("purchaseType")}
                                        type="radio"
                                        value={PurchaseType.MONEY_ONLY}
                                        className="w-4 h-4 text-[#003B5C]"
                                    />
                                    <div className="text-[9px] font-black uppercase tracking-tighter text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Money Only</div>
                                </div>
                                <span className="text-[11px] font-bold text-gray-900">Regular Sale</span>
                                <span className="text-[9px] text-gray-400 mt-1">Customers pay with dollars only.</span>
                            </label>

                            <label className={cn(
                                "flex flex-col p-4 border rounded-xl cursor-pointer transition-all",
                                watch("purchaseType") === PurchaseType.POINTS_ONLY ? "bg-white border-[#003B5C] shadow-sm" : "bg-white/50 border-gray-100 opacity-60"
                            )}>
                                <div className="flex justify-between items-start mb-2">
                                    <input
                                        {...register("purchaseType")}
                                        type="radio"
                                        value={PurchaseType.POINTS_ONLY}
                                        className="w-4 h-4 text-[#003B5C]"
                                    />
                                    <div className="text-[9px] font-black uppercase tracking-tighter text-violet-600 bg-violet-50 px-2 py-0.5 rounded">Points Only</div>
                                </div>
                                <span className="text-[11px] font-bold text-gray-900">Exclusive Reward</span>
                                <span className="text-[9px] text-gray-400 mt-1">Paid strictly with loyalty points.</span>
                            </label>

                            <label className={cn(
                                "flex flex-col p-4 border rounded-xl cursor-pointer transition-all",
                                watch("purchaseType") === PurchaseType.HYBRID ? "bg-white border-[#003B5C] shadow-sm" : "bg-white/50 border-gray-100 opacity-60"
                            )}>
                                <div className="flex justify-between items-start mb-2">
                                    <input
                                        {...register("purchaseType")}
                                        type="radio"
                                        value={PurchaseType.HYBRID}
                                        className="w-4 h-4 text-[#003B5C]"
                                    />
                                    <div className="text-[9px] font-black uppercase tracking-tighter text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Hybrid</div>
                                </div>
                                <span className="text-[11px] font-bold text-gray-900">Flexible Choice</span>
                                <span className="text-[9px] text-gray-400 mt-1">Money or Points - customer decides.</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-900 uppercase mb-3 px-1">Available Colors</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(ProductColor).map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => toggleColor(color)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all",
                                            (selectedColors as string[]).includes(color)
                                                ? "bg-[#003B5C] text-white border-[#003B5C] shadow-sm"
                                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                            {errors.colors && <p className="text-red-500 text-[10px] mt-1">{String((errors.colors as any).message)}</p>}
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-900 uppercase mb-3 px-1">Available Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(ProductSize).map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(size)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all",
                                            (selectedSizes as string[]).includes(size)
                                                ? "bg-[#003B5C] text-white border-[#003B5C] shadow-sm"
                                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        {size.toUpperCase().replace(/-/g, ' ')}
                                    </button>
                                ))}
                            </div>
                            {errors.sizes && <p className="text-red-500 text-[10px] mt-1">{String((errors.sizes as any).message)}</p>}
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block text-[11px] font-bold text-gray-900 uppercase mb-1.5 px-1">Search Tags</label>
                        <div className="w-full px-4 py-2 rounded-lg border border-gray-200 flex flex-wrap gap-2 items-center min-h-[50px]">
                            {tags.map((tag: string, i: number) => (
                                <span key={i} className="bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag as string)} className="ml-1.5 hover:text-gray-300">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                            <input
                                className="flex-1 min-w-[100px] border-none outline-none text-sm p-1"
                                placeholder="Add tags..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="flex-1 bg-[#1A1A1A] text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center disabled:opacity-50"
                        >
                            {(isCreating || isUpdating) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {isNew ? "Create Product" : "Update Product"}
                        </button>
                        {!isNew && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-8 bg-[#003B5C] text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#002B44] transition-all flex items-center justify-center disabled:opacity-50"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Delete"}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/products")}
                            className="px-8 bg-white text-gray-600 border border-gray-200 py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className=" p-4 ">
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 relative group">
                            {previews.length > 0 ? (
                                <img src={previews[0]} alt="Preview" className="w-full h-full object-cover" />
                            ) : existingImages.length > 0 ? (
                                <img src={existingImages[0]} alt="Existing" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Upload className="w-12 h-12 opacity-20" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-900 uppercase">Product Gallery</h3>

                            <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-[#003B5C] transition-colors cursor-pointer text-center">
                                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                                <Upload className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                                <p className="text-[11px] text-gray-400">Drop your images here, or <span className="text-[#003B5C] font-bold">browse</span></p>
                                <p className="text-[9px] text-gray-200 mt-1">jpeg, png are allowed (max 3 total)</p>
                            </label>

                            <div className="space-y-3">
                                {existingImages.map((img, i) => (
                                    <div key={`existing-${i}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                                        <div className="flex items-center space-x-3 truncate">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-[10px] text-gray-500 truncate">Existing Image {i + 1}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <button type="button" onClick={() => removeImage(i, true)} className="text-gray-300 hover:text-red-500">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {previews.map((preview, i) => (
                                    <div key={`new-${i}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-blue-100">
                                        <div className="flex items-center space-x-3 truncate">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                                <img src={preview} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-[10px] text-gray-500 truncate">{images[i]?.name || "New Image"}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button type="button" onClick={() => removeImage(i, false)} className="text-gray-300 hover:text-red-500">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}
