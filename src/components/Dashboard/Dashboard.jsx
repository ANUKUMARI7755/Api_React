import React, { useEffect, useState } from 'react';
import axios from "axios";
import product from '../images/Product.jpg';
import { useNavigate, useLocation } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Categories from '../categories/Categories';

function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
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

  // Load cart count from localStorage
  const loadCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  };

  useEffect(() => {
    fetchProducts();
    loadCartCount();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartCount();
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  const handleCartClick = () => {
    navigate('/CartPage');
  };

  // Voice Search Functionality
  const handleVoiceSearch = () => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Voice search is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // You can change to 'hi-IN' for Hindi
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
      setIsListening(false);
      
      // Automatically search after voice input
      setTimeout(() => {
        setPage(1);
        fetchProducts();
      }, 500);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone permissions.');
      } else if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div>
        <Categories/>
      </div>
      {/* Dashboard Header Component */}
      <DashboardHeader cartCount={cartCount} onCartClick={handleCartClick} />
        
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-down">
          <i className="fas fa-check-circle text-xl"></i>
          <span className="font-medium">Item added to cart</span>
        </div>
      )}

      <div className="pt-24 px-4 md:px-10 mx-auto">
        {/* 🔍 Search Bar with Voice Search */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-14 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {/* Microphone Button */}
            <button
              onClick={handleVoiceSearch}
              className={`absolute right-4 top-3 p-1 rounded-full transition-all ${
                isListening 
                  ? 'text-red-600 animate-pulse' 
                  : 'text-gray-400 hover:text-blue-600'
              }`}
              title="Voice Search"
            >
              <i className={`fas fa-microphone text-xl ${isListening ? 'animate-pulse' : ''}`}></i>
            </button>
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-search"></i>
            Search
          </button>
        </div>

        {/* Listening Indicator */}
        {isListening && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
            <i className="fas fa-microphone text-blue-600 text-lg animate-pulse"></i>
            <span className="text-blue-800 font-medium">Listening... Speak now</span>
          </div>
        )}

        {/* 🛒 Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data.map((item) => {
            const bulkPrice = item.bulk_pricing && item.bulk_pricing.length > 0 
              ? item.bulk_pricing[0].price 
              : item.unit_price;

            const margin = item.unit_price && bulkPrice
              ? (((item.unit_price - bulkPrice) / item.unit_price) * 100).toFixed(2)
              : 0;

            return (
              <div key={item._id} className="bg-white rounded-xl shadow-md p-3 relative">
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  {margin}% OFF
                </span>

                <div className="h-52 flex justify-center items-center rounded">
                  <img
                    src={product}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="mb-2">
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                    <i className="fas fa-box"></i>
                    <span>{item.current_stock} left</span>
                  </span>
                </div>

                <p className="text-sm font-medium line-clamp-2 mb-2">{item.name}</p>

                <div className="flex items-center gap-2 mb-2">
                  <p className="font-bold text-lg text-green-600">₹{bulkPrice}</p>
                  {item.unit_price !== bulkPrice && (
                    <p className="text-sm line-through text-gray-500">₹{item.unit_price}</p>
                  )}
                </div>

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
          >
            <i className="fas fa-chevron-left"></i>
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

// Dashboard Header Component (Extracted for reuse)
export function DashboardHeader({ cartCount, onCartClick }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">
          <i className="fas fa-store mr-3"></i>
          All Products
        </h1>
        
        {/* Cart Button */}
        <button 
          onClick={onCartClick}
          className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors relative"
        >
          <i className="fas fa-shopping-cart"></i>
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Dashboard;  