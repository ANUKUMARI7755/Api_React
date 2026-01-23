import React, { useState } from "react";

// Sample product data matching API structure
const sampleProduct = {
  "id": 696,
  "name": "Johnson's Baby Lotion 100ml (72 Units)",
  "unit_price": 115,
  "purchase_price": 90.85,
  "current_stock": 103,
  "bulk_pricing": [
    {
      "minQty": 3,
      "price": 90.85
    },
    {
      "minQty": 12,
      "price": 88.55
    }
  ]
};

function AddToCard() {
  const [item] = useState(sampleProduct);
  const [showModal, setShowModal] = useState(true);

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

  // Minimum order amount
  const MIN_ORDER_AMOUNT = 2000;

  // Function to add item to cart
  const addToCart = async () => {
    if (totalQuantity === 0) return;
    
    if (totalPrice < MIN_ORDER_AMOUNT) {
      setError(`Minimum order amount is ₹${MIN_ORDER_AMOUNT}. Current total: ₹${totalPrice.toFixed(2)}`);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Demo mode - simulating API call
      console.log("Adding to cart:", {
        product_id: item.id.toString(),
        quantity: totalQuantity,
        total_price: totalPrice.toFixed(2)
      });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes - showing success
      // In your actual app, uncomment the fetch code below:
      
      /*
      const response = await fetch('http://13.203.212.97:3000/cart', {
        method: 'POST',
        headers: {
          'accept': '*!/!*',
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
      */

      setSuccess(true);
      
      // Reset quantities after 1.5 seconds
      setTimeout(() => {
        setQuantities(item.bulk_pricing.map(() => 0));
        setSuccess(false);
      }, 1500);
      
    } catch (err) {
      console.error("Add to cart error:", err);
      setError(err.message || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setShowModal(false)}
      />

      {/* Modal */}
      <div className="relative bg-white w-[95%] sm:w-[420px] md:w-[480px] lg:w-[520px] max-h-[90vh] rounded-2xl shadow-xl p-5 overflow-y-auto">
        {/* Close */}
        <button
          className="absolute right-4 top-4 text-2xl font-bold"
          onClick={() => setShowModal(false)}
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
          <div className="mt-3 p-3 bg-green-100 text-green-700 rounded text-sm">
            ✓ Item added to cart successfully!
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={addToCart}
          disabled={totalQuantity === 0 || loading || totalPrice < MIN_ORDER_AMOUNT}
          className={`w-full mt-4 py-3 rounded-lg text-white font-semibold text-base ${
            totalQuantity === 0 || loading || totalPrice < MIN_ORDER_AMOUNT
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? 'Adding...' : totalPrice < MIN_ORDER_AMOUNT ? `Min Order ₹${MIN_ORDER_AMOUNT}` : 'Add to Cart'}
        </button>
        
        {totalPrice > 0 && totalPrice < MIN_ORDER_AMOUNT && (
          <p className="text-xs text-red-600 mt-2 text-center">
            Add ₹{(MIN_ORDER_AMOUNT - totalPrice).toFixed(2)} more to place order
          </p>
        )}
      </div>
    </div>
  );
}

export default AddToCard;