import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import product from '../images/Product.jpg';

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [itemsTotal, setItemsTotal] = useState(0);
  const [marginDiscount, setMarginDiscount] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('hsnsb, 794949');
  const [deliveryName, setDeliveryName] = useState('Nannznznznznznnn');

  const MINIMUM_ORDER_AMOUNT = 2000;
  const SHIPPING_CHARGE = 0; // Free delivery

  // Load cart items from localStorage
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    setCartCount(cart.length);
    calculateTotals(cart);
  };

  const calculateTotals = (items) => {
    // Calculate items total (without discount)
    const itemsSubtotal = items.reduce((sum, item) => {
      return sum + (item.totalQuantity * item.unit_price);
    }, 0);
    setItemsTotal(itemsSubtotal);

    // Calculate actual total (with bulk pricing)
    const actualTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(actualTotal);

    // Calculate margin discount (difference between unit price total and bulk price total)
    const discount = itemsSubtotal - actualTotal;
    setMarginDiscount(discount);
  };

  // Update item quantity for a specific tier
  const updateItemQuantity = (itemId, tierIndex, newQty) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantities = [...item.quantities];
        newQuantities[tierIndex] = Math.max(0, newQty);
        
        // Recalculate totals
        const newTotalQuantity = newQuantities.reduce((sum, qty, idx) => {
          if (item.bulk_pricing && item.bulk_pricing[idx]) {
            return sum + (qty * item.bulk_pricing[idx].minQty);
          }
          return sum;
        }, 0);

        const newTotalPrice = newQuantities.reduce((sum, qty, idx) => {
          if (item.bulk_pricing && item.bulk_pricing[idx]) {
            const packQty = item.bulk_pricing[idx].minQty;
            const pricePerPack = item.bulk_pricing[idx].price * packQty;
            return sum + (qty * pricePerPack);
          }
          return sum;
        }, 0);

        // If all quantities are 0, remove the item
        const hasQuantity = newQuantities.some(q => q > 0);
        if (!hasQuantity) {
          return null;
        }

        return {
          ...item,
          quantities: newQuantities,
          totalQuantity: newTotalQuantity,
          totalPrice: newTotalPrice
        };
      }
      return item;
    }).filter(item => item !== null);

    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotals(updatedCart);
    
    // Dispatch event to update cart count in Dashboard
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotals(updatedCart);
    
    // Dispatch event to update cart count in Dashboard
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Get total quantity across all items and tiers
  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.totalQuantity, 0);
  };

  // Check if order meets minimum amount
  const canProceedToCheckout = () => {
    return totalAmount >= MINIMUM_ORDER_AMOUNT;
  };

  const handleCheckout = () => {
    if (canProceedToCheckout()) {
      // Proceed to checkout
      alert('Proceeding to checkout...');
      // Add your checkout logic here
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white text-gray-900 p-4 z-50 shadow-md">
        <div className="container mx-auto flex items-center gap-4 px-2">
          <button 
            onClick={() => navigate('/Dashboard')}
            className="text-2xl"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-2xl font-bold">Cart</h1>
        </div>
      </header>

      <div className="pt-20 px-4 pb-32">
        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="flex flex-col items-center justify-center py-20">
            <i className="fas fa-shopping-cart text-gray-300 text-8xl mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate('/Dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Delivery Information */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-600">Delivering to {deliveryAddress}</p>
                  <p className="text-lg font-semibold">{deliveryName}</p>
                </div>
                <button className="text-purple-600">
                  <i className="fas fa-pen text-xl"></i>
                </button>
              </div>
              <p className="text-sm font-medium">Delivering in 2-3 days</p>
            </div>

            {/* Items Section */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="text-xl font-bold mb-4">{cartItems.length} Items</h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => {
                  // Find the tier with quantity > 0
                  const activeTierIndex = item.quantities.findIndex(q => q > 0);
                  const activeTier = item.bulk_pricing?.[activeTierIndex];
                  const quantity = item.quantities[activeTierIndex] || 0;
                  
                  // Calculate displayed prices
                  const displayedOriginalPrice = item.unit_price * item.totalQuantity;
                  const displayedDiscountedPrice = item.totalPrice;

                  return (
                    <div key={item.id} className="flex gap-3 pb-4 border-b last:border-b-0">
                      {/* Product Image */}
                      <div className="relative w-32 h-32 bg-white rounded-lg flex-shrink-0 border">
                        <img
                          src={product}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />
                        {activeTier && (
                          <div className="absolute bottom-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            {activeTier.minQty}g
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-base line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-xl font-bold">
                            ₹{displayedDiscountedPrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{displayedOriginalPrice.toFixed(0)}
                          </span>
                        </div>

                        {/* Quantity Controls and Delete */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-yellow-400 rounded-lg px-2 py-1.5">
                            <button
                              onClick={() => updateItemQuantity(item.id, activeTierIndex, quantity - 1)}
                              className="px-2 text-xl font-bold"
                            >
                              −
                            </button>
                            <span className="mx-3 font-bold min-w-[25px] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateItemQuantity(item.id, activeTierIndex, quantity + 1)}
                              className="px-2 text-xl font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 p-2"
                          >
                            <i className="fas fa-trash text-lg"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between text-base">
                <span>Items Total ({cartItems.length} items)</span>
                <span className="font-medium">₹{itemsTotal.toFixed(0)}</span>
              </div>
              
              <div className="flex justify-between text-base text-green-600">
                <span>Margin Discount</span>
                <span className="font-medium">-₹{marginDiscount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-base">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free Delivery</span>
              </div>
              
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Minimum Order Warning */}
            {!canProceedToCheckout() && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-3 flex items-center gap-2">
                <i className="fas fa-info-circle text-red-600"></i>
                <span className="text-red-600 text-sm">
                  The minimum amount must be ₹{MINIMUM_ORDER_AMOUNT} to order
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Checkout Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg p-4 z-40">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{itemsTotal.toFixed(0)}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={!canProceedToCheckout()}
              className={`px-8 py-3 rounded-lg font-semibold text-base ${
                canProceedToCheckout()
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;