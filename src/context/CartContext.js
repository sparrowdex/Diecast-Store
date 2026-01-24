"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Add item to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Create a standardized cart item
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        // Ensure a consistent image property for the cart
        image: (product.images && product.images.length > 0) ? product.images[0] : '/placeholder.png'
      };
      return [...prev, cartItem];
    });
    setIsCartOpen(true);
  };

  // Remove item
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate total price
  const cartTotal = cart.reduce((total, item) => {
    const priceNumber = parseInt(item.price.replace(/[^\d]/g, "")); // Remove '₹' and ','
    return total + priceNumber * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isCartOpen, setIsCartOpen, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);