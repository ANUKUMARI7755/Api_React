import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import product from '../images/Product.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    axios.get("http://13.203.212.97:3000/products/categories")
      .then((res) => {
        if (res.data.success) {
          const homeCategories = res.data.data
            .filter(cat => cat.home_status === true)
            .sort((a, b) => a.priority - b.priority);
          setCategories(homeCategories);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  };

  const handleCategoryClick = (category) => {
    // Navigate to dashboard with category filter
    navigate('/', { 
      state: { 
        categoryId: category.id, 
        categoryName: category.name 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">
            <i className="fas fa-th-large mr-3"></i>
            All Categories
          </h1>
        </div>
      </header>

      <div className="container mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="aspect-square rounded-t-xl overflow-hidden bg-gray-50">
                  <img
                    src={category.icon ? `http://13.203.212.97:3000/uploads/categories/${category.icon}` : product}
                    alt={category.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = product;
                    }}
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {categories.length === 0 && !loading && (
          <div className="text-center py-16">
            <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-600 text-lg">No categories available</p>
            <button
              onClick={fetchCategories}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <i className="fas fa-redo mr-2"></i>
              Reload Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;