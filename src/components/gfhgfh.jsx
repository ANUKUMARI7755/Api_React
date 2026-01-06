import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ GET API CALL
  useEffect(() => {
    axios
      .get("http://13.203.212.97:3000/products")
      .then((res) => {
        console.log("API DATA:", res.data);
        setProducts(res.data); // 👈 array expected
      })
      .catch((error) => {
        console.error("API Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading products...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product List</h1>

      {/* ✅ MAP FUNCTION */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {products.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              width: "220px",
              background: "#fff"
            }}
          >
            {/* Product Image */}
            <img
              src={item.thumbnail || "https://via.placeholder.com/200"}
              alt={item.name}
              style={{ width: "100%", height: "140px", objectFit: "cover" }}
            />

            {/* Product Info */}
            <h3 style={{ margin: "10px 0" }}>{item.name}</h3>
            <p>₹ {item.unit_price}</p>
            <p>Stock: {item.current_stock}</p>
            <p>
              ⭐ {item.rating?.average} ({item.rating?.total_reviews})
            </p>

            <button
              style={{
                width: "100%",
                padding: "8px",
                background: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px"
              }}
            >
              View Product
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
