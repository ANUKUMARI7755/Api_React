import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCount);
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, quantities) => {
    // Handle bulk quantities array
    if (Array.isArray(quantities)) {
      quantities.forEach((qty, index) => {
        if (qty > 0) {
          const packQty = item.bulk_pricing?.[index]?.minQty || 1;
          const totalQty = qty * packQty;
          
          setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(cartItem => cartItem._id === item._id);
            
            if (existingItemIndex >= 0) {
              const updatedItems = [...prevItems];
              updatedItems[existingItemIndex].quantity += totalQty;
              return updatedItems;
            } else {
              const newItem = {
                ...item,
                quantity: totalQty,
                selectedPrice: item.bulk_pricing?.[index] || { minQty: 1, price: item.unit_price }
              };
              return [...prevItems, newItem];
            }
          });
        }
      });
    } else {
      // Handle single quantity
      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(cartItem => cartItem._id === item._id);
        
        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += quantities;
          return updatedItems;
        } else {
          const newItem = {
            ...item,
            quantity: quantities
          };
          return [...prevItems, newItem];
        }
      });
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.selectedPrice?.price || item.unit_price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};