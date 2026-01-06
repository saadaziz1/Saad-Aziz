import {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartMutation,
    useRemoveFromCartMutation
} from '@/api/cartApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

export const useCart = () => {
    const { isAuthenticated } = useAuthStore();
    const { localCart, addItem: addLocal, removeItem: removeLocal, updateQuantity: updateLocal } = useCartStore();

    const { data: remoteCart, isLoading, error } = useGetCartQuery(undefined, {
        skip: !isAuthenticated,
    });

    const [addItemApi, { isLoading: isAdding }] = useAddToCartMutation();
    const [updateItemApi, { isLoading: isUpdating }] = useUpdateCartMutation();
    const [removeItemApi, { isLoading: isRemoving }] = useRemoveFromCartMutation();

    const addItem = async (item: {
        productId: string;
        quantity: number;
        selectedColor?: string;
        selectedSize?: string;
        title?: string;
        price?: number;
        srcUrl?: string;
        discount?: any;
        payWithPoints?: boolean;
        isPointsOnly?: boolean;
        isHybrid?: boolean;
        pointsPrice?: number;
    }) => {
        if (isAuthenticated) {
            const { productId, quantity, selectedColor, selectedSize, payWithPoints } = item;
            return addItemApi({ productId, quantity, selectedColor, selectedSize, payWithPoints }).unwrap();
        } else {
            addLocal({
                productId: item.productId,
                quantity: item.quantity,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize,
                title: item.title || 'Product',
                price: item.price || 0,
                srcUrl: item.srcUrl,
                discount: item.discount,
                payWithPoints: item.payWithPoints || false,
            });
        }
    };

    const updateQuantity = async (productId: string, quantity: number, selectedColor?: string, selectedSize?: string, payWithPoints?: boolean) => {
        if (isAuthenticated) {
            return updateItemApi({ productId, quantity, selectedColor, selectedSize, payWithPoints }).unwrap();
        } else {
            // Local cart update for points? We might need to update local store too, 
            // but for now let's assume authenticated for points features as per previous context about points requiring auth.
            // If local, we just update quantity for now or extend store.
            // Given the requirement is mostly about "checkout" where user is likely auth'd or will be.
            updateLocal(productId, quantity, selectedColor, selectedSize);
        }
    };

    const removeItem = async (productId: string, color?: string, size?: string) => {
        if (isAuthenticated) {
            return removeItemApi({ productId, color, size }).unwrap();
        } else {
            removeLocal(productId, color, size);
        }
    };

    return {
        cart: isAuthenticated ? remoteCart : localCart,
        items: isAuthenticated ? (remoteCart?.items || []) : localCart.items,
        isLoading: isAuthenticated ? isLoading : false,
        error: isAuthenticated ? error : null,
        addItem,
        updateQuantity,
        removeItem,
        isAdding,
        isUpdating,
        isRemoving,
    };
};

