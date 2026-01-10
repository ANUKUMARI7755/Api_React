import React, { useEffect, useState } from 'react';
import axios from "axios";
import product from '../components/images/Product.jpg';

function Dashboard() {
  const [data, setData] = useState([]);


  useEffect(() => {
    axios.get("http://13.203.212.97:3000/products")
      .then((res) => {
        console.log("API Response:", res.data);
        setData(res.data.products || []);

      })
      .catch((error) => {
        console.error(error);

      });
  }, []);

  return (
    <div >
      <h1 className="fixed top-0 left-0 w-full text-center text-2xl font-semibold text-white bg-blue-500 p-3 z-50">
        All Products
      </h1>
<div className='pt-20 bg-white'>
   
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 place-items-center'>
        {data.map((item) => (
          <div key={item.id} className="border border-gray-300 m-2 p-4 items-center justify-center bg-amber-50 rounded-lg shadow-md ">
            <img src={product} alt={item.name} className="w-full h-40 object-cover rounded mb-2" />
            {/* /===============map images============= */}
            {/* <img src={item.images?.length >0 ? 'http://13.203.212.97:3000/uploads/$[0]}' :product} alt={item.name}  className="w-full h-40 object-cover rounded-md mb-2"/> */}
            <p><b>Name:</b> {item.name}</p>
            <p><b>Price:</b> ₹{item.unit_price}</p>
            <p><b>Stock:</b> {item.current_stock}</p>
            

            <table className="text-sm mt-2 border border-pink-400 rounded-lg overflow-hidden">
              <thead className='bg-purple-800 text-white'>
                <tr className='flex gap-4'>
                  <th className='px-4 py-2 '>Min Qty</th>
                  <th className='px-4 py-2 '>Price</th>
                </tr>
              </thead>
              <tbody className='bg-purple-200'>
                {item.bulk_pricing?.map((bp, index) => (
                  <tr key={index} className='flex gap-14'>
                    <td className='px-4 py-2  text-center'>{bp.minQty}</td>
                    <td className='px-4 py-2  text-center'>₹{bp.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        ))}
      </div>
</div>
    </div>
  );
}

export default Dashboard;
