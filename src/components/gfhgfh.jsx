import React, { useEffect, useState } from 'react';
import axios from "axios";
import product from '../components/images/Product.jpg';

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://13.203.212.97:3000/products")
      .then((res) => {
        console.log("API Response:", res.data);
        setData(res.data.products || []); // ✅ FIX
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>All Products</h1>

      {data.map((item) => (
        <div key={item.id} style={{ border: "1px solid #ddd", margin: 10, padding: 10 }}>
          
          {/* ✅ PRODUCT IMAGE */}
          <img
            src={
              item.images?.length > 0
                ? `http://13.203.212.97:3000/uploads/${item.images[0]}`
                : item.thumbnail
                ? `http://13.203.212.97:3000/uploads/${item.thumbnail}`
                : product
            }
            alt={item.name}
            width="150"
          />

          <p><b>Name:</b> {item.name}</p>
          <p><b>Price:</b> ₹{item.unit_price}</p>
          <p><b>Stock:</b> {item.current_stock}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
