import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../../hooks/useCart';

export const Cart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { data, isLoading } = useCart();
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();

  // Transform cart data
  const cartItems = useMemo(() => {
    if (!data?.cart?.items) return [];
    
    return data.cart.items.map((item) => {
      const product = item.productId;
      // Find variant by matching _id or variantId
      const variant = product?.variants?.find(v => 
        v._id?.toString() === item.variantId.toString() || 
        v.variantId?.toString() === item.variantId.toString()
      );
      
      return {
        id: item._id,
        itemId: item._id,
        name: product?.name || 'Product',
        variant: variant?.name || 'Default',
        price: item.priceAtAddTime,
        quantity: item.quantity,
        image: product?.featuredImage || '/LayoutImages/collection.jpg',
      };
    });
  }, [data]);

  const updateQuantity = async (itemId, change) => {
    const item = cartItems.find(i => i.itemId === itemId);
    if (!item) return;
    
    const newQuantity = Math.max(0, item.quantity + change);
    if (newQuantity === 0) {
      await removeItemMutation.mutateAsync(itemId);
    } else {
      await updateItemMutation.mutateAsync({ itemId, quantity: newQuantity });
    }
  };

  const removeItem = async (itemId) => {
    await removeItemMutation.mutateAsync(itemId);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = 3.95;
  const total = subtotal + delivery;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="absolute right-0 top-0  w-[480px] bg-background shadow-lg">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-foreground">My Bag</h2>
            <button onClick={onClose} className="text-gray-500 dark:text-foreground hover:text-gray-700">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto text-[#282828] dark:text-foreground">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-foreground">Loading cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-foreground">Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-200">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-light" >
                      {item.name} - {item.variant}
                    </h3>
                    <button 
                      onClick={() => removeItem(item.itemId)}
                      className="text-xs text-gray-500 dark:text-foreground hover:text-red-500 mt-1"
                      disabled={removeItemMutation.isPending}
                    >
                      REMOVE
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.itemId, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                        disabled={updateItemMutation.isPending}
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.itemId, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                        disabled={updateItemMutation.isPending}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm font-medium" >
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4 pb-4 border-b border-gray-300">
              <span>Delivery</span>
              <span>€{delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-medium mb-6" >
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="w-full py-3 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              style={{backgroundColor: '#282828'}}
            >
              PURCHASE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};