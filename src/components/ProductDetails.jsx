import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProductDetails() {
 const location = useLocation();
const navigate = useNavigate();

const item = location.state?.item;

// if (!item) {
//   return <p className="p-6">No product selected</p>;
// }


  const [qty3, setQty3] = useState(0);
  const [qty12, setQty12] = useState(0);

  const price3 = 90.85;
  const price12 = 88.55;

  const totalQty = qty3 + qty12;
  const totalPrice = (qty3 * price3 + qty12 * price12).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow">
        <button className="text-2xl font-bold">←</button>
        <h2 className="font-semibold">Product Details</h2>
        <button className="text-4xl">🛒</button>
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40"/>

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-4 max-h-[90vh] ">
        {/* Close */}
   <button
  className="absolute right-4 top-4 text-xl"
  onClick={() => navigate("/dashboard")}
>
  ✕
</button>


        {/* Product Info */}
        <div className="flex gap-3">
          <img
            src="/product.jpg"
            alt="product"
            className="h-16 w-16 object-contain"
          />
          <div>
            <p className="font-medium">
              Johnson’s Baby Lotion 100ml (72 Units)
            </p>
            <p className="font-semibold">₹115</p>
            <p className="text-sm text-purple-600">103 left</p>
          </div>
        </div>

        {/* Pack of 3 */}
        <div className="border rounded-xl p-3 mt-4">
          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
            21.00% Margin
          </span>

          <div className="flex justify-between items-center mt-2">
            <div>
              <p className="font-medium">Pack of 3</p>
              <p className="text-sm">₹{price3}</p>
            </div>

            <div className="flex items-center bg-yellow-400 rounded-lg px-2">
              <button
                onClick={() => setQty3(Math.max(0, qty3 - 1))}
                className="px-2"
              >
                −
              </button>
              <span className="mx-3">{qty3}</span>
              <button
                onClick={() => setQty3(qty3 + 1)}
                className="px-2"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Pack of 12 */}
        <div className="border rounded-xl p-3 mt-4">
          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
            23.00% Margin
          </span>

          <div className="flex justify-between items-center mt-2">
            <div>
              <p className="font-medium">Pack of 12</p>
              <p className="text-sm">₹{price12}</p>
            </div>

            <div className="flex items-center bg-yellow-400 rounded-lg px-2">
              <button
                onClick={() => setQty12(Math.max(0, qty12 - 1))}
                className="px-2"
              >
                −
              </button>
              <span className="mx-3">{qty12}</span>
              <button
                onClick={() => setQty12(qty12 + 1)}
                className="px-2"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm">
          <p>Total ₹{totalPrice}</p>
          <p>Total Quantity: {totalQty}</p>
          <p>Margin: 0%</p>
          <p>Extra Discount: ₹0</p>
        </div>

        {/* Add to Cart */}
        <button
          disabled={totalQty === 0}
          className={`w-full mt-4 py-3 rounded-lg text-white ${
            totalQty === 0 ? "bg-blue-400 hover:bg-blue-300" : "bg-purple-600"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
