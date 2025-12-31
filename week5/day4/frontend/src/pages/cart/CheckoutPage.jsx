import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../../hooks/useCart';
import { usePlaceOrder } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  const placeOrderMutation = usePlaceOrder();
  const { data: productsData } = useProducts({ limit: 3 });

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [step, setStep] = useState(1);

  // Transform cart data
  const cartItems = useMemo(() => {
    if (!cartData?.cart?.items) return [];
    
    return cartData.cart.items.map((item) => {
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
  }, [cartData]);

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

  const handleCheckout = async () => {
    if (step === 1) {
      if (cartItems.length === 0) {
        alert('Your cart is empty');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      // Validate shipping address
      if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
        alert('Please fill in all shipping address fields');
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      try {
        await placeOrderMutation.mutateAsync({
          shippingAddress,
          paymentMethod,
        });
        navigate('/');
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
      }
    }
  };

  // Get popular products
  const popularProducts = useMemo(() => {
    if (!productsData?.products) return [];
    
    return productsData.products.slice(0, 3).map((product) => {
      const firstVariant = product.variants?.[0];
      const price = firstVariant 
        ? (product.basePrice + (firstVariant.priceDiff || 0)).toFixed(2)
        : product.basePrice.toFixed(2);
      
      return {
        id: product._id,
        name: product.name,
        price: `€${price}`,
        weight: firstVariant?.name || '50 g',
        image: product.images?.[0] || '/LayoutImages/collection.jpg',
      };
    });
  }, [productsData]);

  return (
    <div className="min-h-screen bg-background">
      

      {/* Progress Steps */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-500' : 'text-foreground'}`}>
              1. MY BAG
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${step >= 2 ? 'font-medium text-blue-500' : 'text-foreground'}`}>
              2. DELIVERY
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${step >= 3 ? 'font-medium text-blue-500' : 'text-foreground'}`}>
              3. REVIEW & PAYMENT
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center">
        {/* Left Side - Content */}
        <div className="flex-1 px-6 py-6 text-foreground">
          {step === 1 && (
            <>
              <div className="space-y-4">
                {cartLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-foreground">Loading cart...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-foreground">Your cart is empty</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="mt-4 px-6 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50"
                    >
                      Continue Shopping
                    </button>
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
                        <h3 className="text-sm font-light text-[#282828] dark:text-foreground" >
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
                      <div className="text-sm font-medium text-[#282828] dark:text-foreground">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/products')}
                className="mt-6 px-8 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50"
              >
                BACK TO SHOPPING
              </button>
            </>
          )}

          {step === 2 && (
            <div className="max-w-2xl text-[#282828] dark:text-foreground">
              <h2 className="text-2xl font-medium mb-6" >Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" >Street Address *</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                    placeholder="123 Main Street, Apt 4B"
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      placeholder="New York"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" >State *</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      placeholder="NY"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-600"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Zip Code *</label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                      placeholder="10001"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" >Country *</label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                      placeholder="United States"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-600"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-medium mb-6" >Review & Payment</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2" >Shipping Address</h3>
                  <p className="text-sm text-gray-600">
                    {shippingAddress.street}<br />
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                    {shippingAddress.country}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4" >Payment Method</h3>
                  <div className="space-y-2">
                    {['card', 'cash', 'bank_transfer'].map((method) => (
                      <label key={method} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm capitalize">{method.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Order Summary */}
        <div className="w-96 bg-backgound px-6 py-6">
          <div className="bg-background  p-6 rounded">
            <h3 className="text-lg font-medium mb-4">Order summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span>€{delivery.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">Estimated shipping time: 2 days</p>

            <button 
              onClick={handleCheckout}
              disabled={placeOrderMutation.isPending || cartItems.length === 0}
              className="w-full py-3 text-white text-sm font-medium hover:opacity-90 transition-opacity mb-6 disabled:opacity-50"
              style={{backgroundColor: '#282828'}}
            >
              {placeOrderMutation.isPending ? 'Processing...' : step === 1 ? 'PROCEED TO CHECKOUT' : step === 2 ? 'CONTINUE TO PAYMENT' : 'PLACE ORDER'}
            </button>

            {step === 3 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Payment type</h4>
                <div className="flex gap-2">
                  <div className="w-12 h-8 bg-blue-600 rounded text-white text-xs flex items-center justify-center">VISA</div>
                  <div className="w-12 h-8 bg-red-500 rounded text-white text-xs flex items-center justify-center">MC</div>
                  <div className="w-12 h-8 bg-blue-400 rounded text-white text-xs flex items-center justify-center">ME</div>
                  <div className="w-12 h-8 bg-pink-500 rounded text-white text-xs flex items-center justify-center">iD</div>
                  <div className="w-12 h-8 bg-gray-700 rounded text-white text-xs flex items-center justify-center">SE</div>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium mb-3">Delivery and return</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <span>›</span>
                  <span>Order before 12:00 and we will ship the same day</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>›</span>
                  <span>Orders made after Friday 12:00 are processed on Monday.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>›</span>
                  <span>To return your articles, please contact us first.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>›</span>
                  <span>Postal charges for return are not reimbursed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular this season */}
      {step === 1 && popularProducts.length > 0 && (
        <div className="px-6 py-12 bg-d">
          <h2 className="text-2xl font-medium text-center mb-8">Popular this season</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 justify-center items-center mx-auto gap-8 max-w-lg">
            {popularProducts.map((product) => (
              <div key={product.id} className="text-center">
                <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded mb-4"/>
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-foreground">{product.price} / {product.weight}</p>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
};

export default CheckoutPage;
