import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AddToCard() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;
  
  if (!item) {
    return <p className="p-6">No product selected</p>;
  }

  // Background scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // State for each bulk pricing tier quantity
  const [quantities, setQuantities] = useState(
    item.bulk_pricing ? item.bulk_pricing.map(() => 0) : [0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Update quantity for specific tier
  const updateQuantity = (index, newQty) => {
    const updated = [...quantities];
    updated[index] = Math.max(0, newQty);
    setQuantities(updated);
  };

  // Calculate total quantity
  const totalQuantity = quantities.reduce((sum, qty, idx) => {
    if (item.bulk_pricing && item.bulk_pricing[idx]) {
      return sum + (qty * item.bulk_pricing[idx].minQty);
    }
    return sum;
  }, 0);

  // Calculate total price
  const totalPrice = quantities.reduce((sum, qty, idx) => {
    if (item.bulk_pricing && item.bulk_pricing[idx]) {
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
      if (qty > 0 && item.bulk_pricing && item.bulk_pricing[idx]) {
        const packQty = item.bulk_pricing[idx].minQty;
        totalCost += qty * packQty * item.purchase_price;
      }
    });

    if (totalCost === 0) return 0;
    return (((totalPrice - totalCost) / totalPrice) * 100).toFixed(2);
  };

  // Calculate margin for individual tier
  const calculateTierMargin = (tierPrice) => {
    if (!item.purchase_price || item.purchase_price === 0) return 0;
    return (((tierPrice - item.purchase_price) / tierPrice) * 100).toFixed(2);
  };

  // Function to add item to cart
  const addToCart = async () => {
    if (totalQuantity === 0) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://13.203.212.97:3000/cart', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: item.id.toString(),
          quantity: totalQuantity
        })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to add item to cart';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Success response:", result);

      setSuccess(true);
      
      // Reset quantities
      setQuantities(item.bulk_pricing.map(() => 0));
      
      // Close modal after success
      setTimeout(() => {
        navigate(-1);
      }, 1500);
      
    } catch (err) {
      console.error("Add to cart error:", err);
      setError(err.message || 'Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => navigate(-1)}
      />

      {/* Modal */}
      <div className="relative bg-white w-[95%] sm:w-[420px] md:w-[480px] lg:w-[520px] max-h-[90vh] rounded-2xl shadow-xl p-4 overflow-y-auto">
        {/* Close */}
        <button
          className="absolute right-4 top-4 text-xl font-bold"
          onClick={() => navigate(-1)}
        >
          ✕
        </button>

        {/* Product Info */}
        <div className="flex gap-3 mb-4">
          <div className="h-20 w-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
            <div className="text-4xl">📦</div>
          </div>
          <div>
            <p className="font-medium text-sm">{item.name}</p>
            <p className="font-bold text-lg">₹{item.unit_price}</p>
            <p className="text-sm text-blue-600 bg-blue-100 inline-block px-2 py-0.5 rounded mt-1">
              {item.current_stock} left
            </p>
          </div>
        </div>

        {/* Bulk Pricing Options */}
        <div className="space-y-3">
          {item.bulk_pricing && item.bulk_pricing.map((tier, index) => {
            const margin = calculateTierMargin(tier.price);
            const pricePerPack = tier.price * tier.minQty;
            
            return (
              <div key={index} className="border rounded-xl p-3">
                <div className="mb-2">
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                    {margin}% Margin
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Pack of {tier.minQty}</p>
                    <p className="text-sm">
                      <span className="font-semibold">₹{tier.price.toFixed(2)}</span>
                      <span className="text-gray-400 line-through ml-2">₹{item.unit_price}</span>
                    </p>
                  </div>

                  <div className="flex items-center bg-yellow-400 rounded-lg px-2 py-1">
                    <button
                      onClick={() => updateQuantity(index, quantities[index] - 1)}
                      className="px-2 text-lg font-bold"
                      disabled={loading}
                    >
                      −
                    </button>
                    <span className="mx-3 font-semibold min-w-[20px] text-center">
                      {quantities[index]}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, quantities[index] + 1)}
                      className="px-2 text-lg font-bold"
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
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <div>
              <span>₹{totalPrice.toFixed(2)}</span>
              <span className="text-gray-400 ml-2">₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-sm">Total Quantity: {totalQuantity}</p>
          <p className="text-sm">Margin: ({calculateMargin()}%)</p>
          <p className="text-sm">Extra Discount: Rs. 0</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-3 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-3 p-2 bg-green-100 text-green-700 rounded text-sm">
            Item added to cart successfully!
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={addToCart}
          disabled={totalQuantity === 0 || loading}
          className={`w-full mt-4 py-3 rounded-lg text-white font-semibold ${
            totalQuantity === 0 || loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default AddToCard;