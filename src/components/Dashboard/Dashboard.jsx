import React, { useEffect, useState } from 'react';
import axios from "axios";
import product from '../images/Product.jpg';
import { useNavigate, useLocation } from "react-router-dom";
// In src/index.js or src/App.js
import '@fortawesome/fontawesome-free/css/all.min.css';

function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  //==========margin calculation code============
  

  const navigate = useNavigate();
  const location = useLocation();

  const limit = 10;

  const fetchProducts = () => {
    axios.get("http://13.203.212.97:3000/products", {
      params: {
        page,
        limit,
        name: search
      }
    })
      .then((res) => {
        setData(res.data.products || []);
        setTotalPages(res.data.pagination.totalPages || 1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-100">
        
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">
            <i className="fas fa-store mr-3"></i>
            All Products
          </h1>
          
          {/* Cart Button */}
          <button className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <i className="fas fa-shopping-cart"></i>
            <span>Cart</span>
          </button>
        </div>
      </header>

      <div className="pt-24 px-4 md:px-10 mx-auto">

        {/* 🔍 Search Bar */}
       <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
             
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-search"></i>
            Search
          </button>
        </div>

        {/* 🛒 Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data.map((item) => {
            const margin = item.purchase_price
              ? (((item.unit_price - item.purchase_price) / item.unit_price) * 100).toFixed(2)
              : 0;

            return (
              <div key={item._id} className="bg-white rounded-xl shadow-md p-3 relative">
                {/* Margin */}
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  {margin}% Margin
                </span>

                {/* Image */}
                <div className="h-52  flex justify-center items-center rounded">
                  <img
                    src={
                       product
                    }
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </div>

               {/* Stock */}
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                          <i className="fas fa-box"></i>
                          <span>{item.current_stock} left</span>
                        </span>
                      </div>

                {/* Name */}
                <p className="text-sm font-medium line-clamp-2">{item.name}</p>

          
                {/* Price */}
                <p className="font-semibold mt-1 ">₹ {item.purchase_price}</p>


                {/* Price */}
                <p className="font-semibold mt-1 line-through text-gray-500">₹ {item.bulk_pricing[0].price}</p>
                

                {/* Button */}
                <button
                  onClick={() =>
                    navigate("/AddToCard", {
                      state: { item, background: location }
                    })
                  }
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>

        {/* 📄 Pagination */}
        <div className="flex justify-center items-center gap-1 mt-8 pb-6 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          ><i className="fas fa-chevron-left"></i>
            Prev
          </button>

          {[...Array(totalPages)]
            .map((_, i) => i + 1)
            .filter(p => p >= page - 2 && p <= page + 2)
            .map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 border rounded text-sm
                  ${page === p ? "bg-blue-500 text-white" : ""}`}
              >
                {p}
              </button>
            ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next  <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

// AddCard page me add to card button pe click kare to Dashboard ke card icons pe stor ho haye then  cardPage show ho and chnage code struct an any compoments