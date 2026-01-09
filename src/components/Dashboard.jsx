import React, { useEffect, useState } from 'react';
import axios from "axios";
import product from '../components/images/Product.jpg';

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://13.203.212.97:3000/products")
      .then((res) => {
        console.log("API Response:", res.data);
        setData(res.data.data || []);
        
      })
      .catch((error) => {
        console.error(error);
        
      });
  }, []);

  return (
    <div>
      <h1>All Products</h1>


      {data.map((item) => (
        <div key={item.id}>
   
           <p><b>Name:</b> {item.name}</p>
           <p><b>Price:</b> ₹{item.unit_price}</p>
           <p><b>Stock:</b> {item.current_stock}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
