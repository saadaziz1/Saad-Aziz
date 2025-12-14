import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Cart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Ceylon Ginger Cinnamon chai tea",
      variant: "50 g",
      price: 3.90,
      quantity: 1,
      image: "/imgs/col1.jpeg"
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = 3.95;
  const total = subtotal + delivery;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-[80vh] w-[480px] bg-white shadow-lg">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium" style={{color: '#282828'}}>My Bag</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-200">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-light" style={{color: '#282828'}}>
                    {item.name} - {item.variant}
                  </h3>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-gray-500 hover:text-red-500 mt-1"
                  >
                    REMOVE
                  </button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm font-medium" style={{color: '#282828'}}>
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
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
            <div className="flex justify-between text-lg font-medium mb-6" style={{color: '#282828'}}>
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