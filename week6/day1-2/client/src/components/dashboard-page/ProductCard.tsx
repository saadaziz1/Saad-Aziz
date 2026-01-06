import { Product, PurchaseType } from '@/types/product.types';
import React from 'react';
import { MoreHorizontal, Package, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUpdateSaleStatusMutation } from '@/api/productsApi';
import { toast } from 'react-hot-toast';
interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const stockPercentage = Math.min((product.stock / (product.totalStock || 1)) * 100, 100);
    const [updateSaleStatus, { isLoading: isUpdating }] = useUpdateSaleStatusMutation();

    // Local state for instant UI feedback
    const [optimisticSaleState, setOptimisticSaleState] = React.useState<boolean | null>(null);

    // Reset optimistic state when product updates from server
    React.useEffect(() => {
        setOptimisticSaleState(null);
    }, [product.isOnSale]);

    // Use optimistic state if available, otherwise use product state
    const currentSaleState = optimisticSaleState !== null ? optimisticSaleState : product.isOnSale;

    const salePrice = currentSaleState
        ? Math.round(product.price * (1 - (product.discountPercentage || product.discount.percentage || 0) / 100))
        : product.price;

    const handleToggleSale = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const newSaleState = !currentSaleState;

        // Immediately update UI
        setOptimisticSaleState(newSaleState);

        try {
            await updateSaleStatus({
                id: product.id.toString(),
                isOnSale: newSaleState,
                discountPercentage: product.discountPercentage || product.discount.percentage || 10
            }).unwrap();

            // Clear optimistic state after successful update
            setOptimisticSaleState(null);
            toast.success(`Sale status updated for ${product.title}`);
        } catch (err) {
            // Revert optimistic state on error
            setOptimisticSaleState(null);
            toast.error("Failed to update sale status");
        }
    };

    return (
        <Link href={`/dashboard/products/${product.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md block cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {product.srcUrl ? (
                            <img src={product.srcUrl} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-gray-900 leading-tight truncate max-w-[120px]">
                            {product.title}
                        </h3>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
                            {product.category || 'General'}
                        </p>
                        <div className="flex flex-col mt-0.5">
                            <div className="flex items-center space-x-2">
                                {product.purchaseType === PurchaseType.POINTS_ONLY ? (
                                    <span className="text-xs font-black text-black italic">{product.pointsPrice} PTS</span>
                                ) : (
                                    <>
                                        {currentSaleState ? (
                                            <>
                                                <span className="text-xs font-black text-red-600 italic">${salePrice}</span>
                                                <span className="text-[10px] font-bold text-gray-300 line-through">${product.price}</span>
                                            </>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-900">${product.price}</span>
                                        )}
                                    </>
                                )}
                            </div>
                            {product.purchaseType === PurchaseType.HYBRID && (
                                <span className="text-[9px] text-black font-bold mt-0.5">or {product.pointsPrice} PTS</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-1">
                        {product.purchaseType === PurchaseType.POINTS_ONLY && (
                            <span className="text-[8px] font-black bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded uppercase">Points</span>
                        )}
                        {product.purchaseType === PurchaseType.HYBRID && (
                            <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase">Hybrid</span>
                        )}
                    </div>
                    <button
                        onClick={handleToggleSale}
                        disabled={isUpdating || product.purchaseType === PurchaseType.POINTS_ONLY}
                        className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                            currentSaleState ? "bg-red-500" : "bg-gray-200",
                            product.purchaseType === PurchaseType.POINTS_ONLY && "opacity-20 cursor-not-allowed"
                        )}
                    >
                        <span
                            className={cn(
                                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                currentSaleState ? "translate-x-4" : "translate-x-0"
                            )}
                        >
                            {isUpdating && <Loader2 className="w-3 h-3 animate-spin text-gray-400 m-0.5" />}
                        </span>
                    </button>
                    <button className="p-1 text-gray-300 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-1">Summary</h4>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                    {product.description || 'No description available for this product yet.'}
                </p>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#6B7280]">
                    <span className="flex items-center">
                        Sales <ChevronRight className="w-3 h-3 ml-1 text-orange-400" />
                    </span>
                    <span className="text-gray-900">{(product.sales || 0).toLocaleString()}</span>
                </div>

                <div>
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#6B7280] mb-1.5">
                        <span>Remaining Products</span>
                        <span className="text-gray-900 font-black">{product.stock}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-400 rounded-full transition-all duration-500"
                            style={{ width: `${stockPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};
