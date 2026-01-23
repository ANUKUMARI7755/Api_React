import React, { useState, useEffect } from "react";

// Sample cart data
const initialCartData = {
  delivery: {
    location: "hsnsb, 794949",
    name: "Nannznznznznznznn",
    days: "2-3 days"
  },
  items: [
    {
      id: 1,
      name: "Colgate Active Salt Anti...",
      image: "🦷",
      price: 781.56,
      originalPrice: 936,
      quantity: 12,
      unit_price: 65.13,
      purchase_price: 52.27
    }
  ]
};

function CartPage() {
  const [cartData, setCartData] = useState(initialCartData);
  const MIN_ORDER_AMOUNT = 2000;

  // Calculate totals
  const itemsTotal = cartData.items.reduce((sum, item) => sum + item.price, 0);
  
  const marginDiscount = cartData.items.reduce((sum, item) => {
    const margin = (item.unit_price - item.purchase_price) * item.quantity;
    return sum + margin;
  }, 0);

  const finalTotal = itemsTotal - marginDiscount;
  const isMinimumMet = finalTotal >= MIN_ORDER_AMOUNT;
  const amountNeeded = MIN_ORDER_AMOUNT - finalTotal;

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const newPrice = item.unit_price * newQuantity;
          return {
            ...item,
            quantity: newQuantity,
            price: newPrice
          };
        }
        return item;
      })
    }));
  };

  // Remove item
  const removeItem = (itemId) => {
    setCartData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-yellow-100 p-4 flex items-center gap-4 sticky top-0 z-10">
        <button className="text-2xl">←</button>
        <h1 className="text-2xl font-bold">Cart</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Delivery Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Delivering to {cartData.delivery.location}</p>
          <div className="flex justify-between items-center mt-1">
            <p className="font-semibold">{cartData.delivery.name}</p>
            <button className="text-purple-600">✏️</button>
          </div>
          <p className="text-sm font-semibold mt-3">Delivering in {cartData.delivery.days}</p>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-xl font-bold mb-4">{cartData.items.length} Items</h2>
          
          {cartData.items.map(item => (
            <div key={item.id} className="flex gap-3 pb-4">
              {/* Product Image */}
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-6xl">{item.image}</span>
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">{item.name}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">₹{item.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-400 line-through">₹{item.originalPrice}</span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center bg-yellow-400 rounded-lg px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 text-xl font-bold"
                    >
                      −
                    </button>
                    <span className="mx-4 font-bold min-w-[30px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 text-xl font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-2xl"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between text-sm">
            <span>Items Total ({cartData.items.length} items)</span>
            <span className="font-semibold">₹{itemsTotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Margin Discount</span>
            <span className="font-semibold text-green-600">-₹{marginDiscount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span className="font-semibold text-green-600">Free Delivery</span>
          </div>
          
          <div className="border-t pt-3 flex justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold">₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Minimum Order Warning */}
        {!isMinimumMet && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg flex items-center gap-2">
            <span className="text-xl">ⓘ</span>
            <span className="text-sm font-medium">
              The minimum amount must be ₹{MIN_ORDER_AMOUNT} to order
            </span>
          </div>
        )}
      </div>

      {/* Bottom Bar - Checkout Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">₹{finalTotal.toFixed(2)}</span>
              <span className="text-sm text-gray-400 line-through">₹{itemsTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <button
            disabled={!isMinimumMet}
            className={`px-8 py-3 rounded-xl font-semibold ${
              isMinimumMet
                ? "bg-purple-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;