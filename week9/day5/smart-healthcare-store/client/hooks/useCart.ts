import {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateQuantityMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
} from '../services/cartApi';

export const useCart = () => {
    const { data: cart, isLoading, error } = useGetCartQuery();
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
    const [updateQuantity, { isLoading: isUpdating }] = useUpdateQuantityMutation();
    const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
    const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

    const handleAddToCart = async (productId: string, quantity?: number) => {
        await addToCart({ productId, quantity });
    };

    const handleUpdateQuantity = async (productId: string, quantity: number) => {
        await updateQuantity({ productId, quantity });
    };

    const handleRemoveFromCart = async (productId: string) => {
        await removeFromCart(productId);
    };

    const handleClearCart = async () => {
        await clearCart();
    };

    return {
        cart,
        items: cart?.items || [],
        total: cart?.total || 0,
        itemCount: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        isLoading,
        isAdding,
        isUpdating,
        isRemoving,
        isClearing,
        error,
        addToCart: handleAddToCart,
        updateQuantity: handleUpdateQuantity,
        removeFromCart: handleRemoveFromCart,
        clearCart: handleClearCart,
    };
};
