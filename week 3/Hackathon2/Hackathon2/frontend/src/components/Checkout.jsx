import { useState } from 'react';

export const Checkout = ({ isOpen, onClose, onBack }) => {
  const [cartItems] = useState([
    {
      id: 1,
      name: "Ceylon Ginger Cinnamon chai tea",
      variant: "50 g",
      price: 3.90,
      quantity: 1,
      image: "/imgs/col1.jpeg"
    }
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = 3.95;
  const total = subtotal + delivery;

  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-lg font-medium">Brand Name</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">TEA COLLECTIONS</span>
            <span className="text-sm text-gray-600">ACCESSORIES</span>
            <span className="text-sm text-gray-600">BLOG</span>
            <span className="text-sm text-gray-600">CONTACT US</span>
          </div>
          <div className="flex items-center gap-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19A4 4 0 0 0 16 15H8A4 4 0 0 0 4 19V21" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <button onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6V20A2 2 0 0 0 5 22H19A2 2 0 0 0 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="3,6 21,6" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 10A4 4 0 0 1 8 10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-black">1. MY BAG</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">2. DELIVERY</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">3. REVIEW & PAYMENT</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Side - Cart Items */}
        <div className="flex-1 px-6 py-6">
          <div className="space-y-4">
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
                  <button className="text-xs text-gray-500 hover:text-red-500 mt-1">
                    REMOVE
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100">
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100">
                    +
                  </button>
                </div>
                <div className="text-sm font-medium" style={{color: '#282828'}}>
                  €{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={onBack}
            className="mt-6 px-8 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50"
          >
            BACK TO SHOPPING
          </button>
        </div>

        {/* Right Side - Order Summary */}
        <div className="w-96 bg-gray-50 px-6 py-6">
          <div className="bg-white p-6 rounded">
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
              className="w-full py-3 text-white text-sm font-medium hover:opacity-90 transition-opacity mb-6"
              style={{backgroundColor: '#282828'}}
            >
              CHECK OUT
            </button>

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
      <div className="px-6 py-12 bg-gray-50">
        <h2 className="text-2xl font-medium text-center mb-8">Popular this season</h2>
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <img src="/imgs/col1.jpeg" alt="Tea" className="w-32 h-32 object-cover rounded mb-4"/>
            <h3 className="text-sm font-medium">Ceylon Ginger Cinnamon chai tea</h3>
            <p className="text-sm text-gray-600">€4.85 / 50 g</p>
          </div>
          <div className="text-center">
            <img src="/imgs/col1.jpeg" alt="Tea" className="w-32 h-32 object-cover rounded mb-4"/>
            <h3 className="text-sm font-medium">Ceylon Ginger Cinnamon chai tea</h3>
            <p className="text-sm text-gray-600">€4.85 / 50 g</p>
          </div>
          <div className="text-center">
            <img src="/imgs/col1.jpeg" alt="Tea" className="w-32 h-32 object-cover rounded mb-4"/>
            <h3 className="text-sm font-medium">Ceylon Ginger Cinnamon chai tea</h3>
            <p className="text-sm text-gray-600">€4.85 / 50 g</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h4 className="font-medium mb-4">COLLECTIONS</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Black teas</div>
              <div>Green teas</div>
              <div>White teas</div>
              <div>Herbal teas</div>
              <div>Matcha</div>
              <div>Chai</div>
              <div>Oolong</div>
              <div>Rooibos</div>
              <div>Teaware</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">LEARN</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>About us</div>
              <div>About our teas</div>
              <div>Tea academy</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">CUSTOMER SERVICE</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Ordering and payment</div>
              <div>Delivery</div>
              <div>Privacy and policy</div>
              <div>Terms & Conditions</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">CONTACT US</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>3 Falahi, Falahi St, Pasdaran Ave, Shiraz, Fars Provience Iran</div>
              <div>Email: amoospur@gmail.com</div>
              <div>Tel: +98 9173038406</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};