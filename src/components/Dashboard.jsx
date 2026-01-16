import React, { useEffect, useState } from 'react';
import axios from "axios";
import product from '../components/images/Product.jpg';
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

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
      <h1 className="fixed top-0 left-0 w-full text-center text-2xl font-semibold text-white bg-blue-500 p-3 z-50">
        All Products
      </h1>

      <div className="pt-24 px-4 md:px-10 mx-auto">

        {/* 🔍 Search Bar */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border rounded-lg outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-6 rounded-lg"
          >
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
              <div key={item.id} className="bg-white rounded-xl shadow-md p-3 relative">
                {/* Margin */}
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  {margin}% Margin
                </span>

                {/* Image */}
                <div className="h-32 flex justify-center items-center mb-2">
                  <img
                    src={
                      item.images?.length > 0
                        ? `http://13.203.212.97:3000/products/upload/${item.images[0]}`
                        : product
                    }
                    alt={item.name}
                    className="h-full object-contain"
                  />
                </div>

                {/* Name */}
                <p className="text-sm font-medium line-clamp-2">{item.name}</p>

                {/* Price */}
                <p className="font-semibold mt-1">₹ {item.unit_price}</p>

                {/* Stock */}
                <p className="text-xs text-purple-600">{item.current_stock} left</p>

                {/* Button */}
                <button
                  onClick={() =>
  navigate("/ProductDetails", {
    state: { item }
  })
}
                  className="w-full mt-2 border border-yellow-500 text-yellow-600 py-1.5 rounded-lg hover:bg-yellow-50"
                >
                  Add to Cart
                </button>

              </div>
            );
          })}
        </div>

        {/* 📄 Pagination */}
        <div className="flex justify-between mt-8 gap-2  pb-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-500 text-white" : ""
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
