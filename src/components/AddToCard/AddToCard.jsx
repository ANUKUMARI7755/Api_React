import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AddToCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;
  
  const [showModal, setShowModal] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // State for each bulk pricing tier quantity
  const [quantities, setQuantities] = useState(
    item?.bulk_pricing ? item.bulk_pricing.map(() => 0) : [0]
  );

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load cart count
  React.useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  }, []);

  // Update quantity for specific tier
  const updateQuantity = (index, newQty) => {
    const updated = [...quantities];
    updated[index] = Math.max(0, newQty);
    setQuantities(updated);
  };

  // Calculate total quantity
  const totalQuantity = quantities.reduce((sum, qty, idx) => {
    if (item?.bulk_pricing && item.bulk_pricing[idx]) {
      return sum + (qty * item.bulk_pricing[idx].minQty);
    }
    return sum;
  }, 0);

  // Calculate total price
  const totalPrice = quantities.reduce((sum, qty, idx) => {
    if (item?.bulk_pricing && item.bulk_pricing[idx]) {
      const packQty = item.bulk_pricing[idx].minQty;
      const pricePerPack = item.bulk_pricing[idx].price * packQty;
      return sum + (qty * pricePerPack);
    }
    return sum;
  }, 0);

  // Calculate weighted margin based on selected quantities
  const calculateMargin = () => {
    if (totalPrice === 0) return 0;
    
    let totalCost = 0;
    quantities.forEach((qty, idx) => {
      if (qty > 0 && item?.bulk_pricing && item.bulk_pricing[idx]) {
        const packQty = item.bulk_pricing[idx].minQty;
        totalCost += qty * packQty * item.purchase_price;
      }
    });

    if (totalCost === 0) return 0;
    return (((totalPrice - totalCost) / totalPrice) * 100).toFixed(2);
  };

  // Calculate margin for individual tier
  const calculateTierMargin = (tierPrice) => {
    if (!item?.purchase_price || item.purchase_price === 0) return 0;
    return (((tierPrice - item.purchase_price) / tierPrice) * 100).toFixed(2);
  };

  // Function to add item to cart
  const addToCart = async () => {
    if (totalQuantity === 0) return;
    
    setLoading(true);
    setError(null);

    try {
      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Create cart item
      const cartItem = {
        id: item.id || item._id,
        name: item.name,
        unit_price: item.unit_price,
        purchase_price: item.purchase_price,
        current_stock: item.current_stock,
        bulk_pricing: item.bulk_pricing,
        quantities: quantities,
        totalQuantity: totalQuantity,
        totalPrice: totalPrice,
        margin: calculateMargin(),
        addedAt: new Date().toISOString()
      };

      // Check if item already exists in cart
      const existingItemIndex = existingCart.findIndex(
        cartItem => cartItem.id === (item.id || item._id)
      );

      if (existingItemIndex > -1) {
        // Update existing item
        existingCart[existingItemIndex] = cartItem;
      } else {
        // Add new item
        existingCart.push(cartItem);
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setSuccess(true);
      
      // Dispatch custom event to update cart count in Dashboard
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Update local cart count
      setCartCount(existingCart.length);
      
      // Close modal after showing success message
      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 1500);
      
    } catch (err) {
      console.error("Add to cart error:", err);
      setError(err.message || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate(-1); // Go back to previous page
  };

  const handleCartClick = () => {
    navigate('/CartPage');
  };

  if (!showModal || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-100">
      {/* Dashboard Header */}
      <header className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">
            <i className="fas fa-store mr-3"></i>
            All Products
          </h1>
          
          {/* Cart Button */}
          <button 
            onClick={handleCartClick}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors relative"
          >
            <i className="fas fa-shopping-cart"></i>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative top-20 mx-auto bg-white w-[95%] sm:w-[420px] md:w-[480px] lg:w-[520px] max-h-[85vh] rounded-2xl shadow-xl p-5 overflow-y-auto">
        {/* Close */}
        <button
          className="absolute right-4 top-4 text-2xl font-bold"
          onClick={handleClose}
        >
          ✕
        </button>

        {/* Product Info */}
        <div className="flex gap-3 mb-4">
          <div className="h-20 w-20 bg-pink-100 rounded flex items-center justify-center flex-shrink-0">
            <div className="text-4xl">🧴</div>
          </div>
          <div>
            <p className="font-medium text-sm pr-8">{item.name}</p>
            <p className="font-bold text-lg mt-1">₹{item.unit_price}</p>
            <p className="text-sm text-blue-600 bg-blue-100 inline-block px-2 py-0.5 rounded mt-1">
              {item.current_stock} left
            </p>
          </div>
        </div>

        {/* Bulk Pricing Options */}
        <div className="space-y-3">
          {item.bulk_pricing && item.bulk_pricing.map((tier, index) => {
            const margin = calculateTierMargin(tier.price);
            
            return (
              <div key={index} className="border rounded-xl p-3 bg-gray-50">
                <div className="mb-2">
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded font-semibold">
                    {margin}% Margin
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Pack of {tier.minQty}</p>
                    <p className="text-sm mt-1">
                      <span className="font-semibold">Price</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-bold">₹{tier.price.toFixed(2)}</span>
                      <span className="text-gray-400 line-through ml-2 text-xs">₹{item.unit_price}</span>
                    </p>
                  </div>

                  <div className="flex items-center bg-yellow-400 rounded-lg px-2 py-2">
                    <button
                      onClick={() => updateQuantity(index, quantities[index] - 1)}
                      className="px-2 text-xl font-bold"
                      disabled={loading}
                    >
                      −
                    </button>
                    <span className="mx-4 font-bold min-w-[20px] text-center text-lg">
                      {quantities[index]}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, quantities[index] + 1)}
                      className="px-2 text-xl font-bold"
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-5 space-y-1 border-t pt-4">
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <div>
              <span>₹{totalPrice.toFixed(2)}</span>
              <span className="text-gray-400 ml-2">₹0</span>
            </div>
          </div>
          <p className="text-sm">Total Quantity: {totalQuantity}</p>
          <p className="text-sm">Margin: ({calculateMargin()}%)</p>
          <p className="text-sm">Extra Discount: Rs. 0</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-3 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-3 p-3 bg-green-100 text-green-700 rounded text-sm flex items-center gap-2">
            <i className="fas fa-check-circle"></i>
            <span>Item added to cart</span>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={addToCart}
          disabled={totalQuantity === 0 || loading}
          className={`w-full mt-4 py-3 rounded-lg text-white font-semibold text-base ${
            totalQuantity === 0 || loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default AddToCard;