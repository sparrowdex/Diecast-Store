"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("vault");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart from storage:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("vault", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const stockLimit = product.stock ?? 999;

      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, stockLimit);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      // Create a standardized cart item
      const cartItem = {
        id: product.id,
        name: product.name,
        price: typeof product.price === 'string' 
          ? parseInt(product.price.replace(/[^\d]/g, "")) 
          : product.price,
        brand: product.brand,
        scale: product.scale,
        stock: stockLimit,
        quantity: Math.min(quantity, stockLimit),
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

  // Update quantity for an existing item
  const updateQuantity = (id, newQuantity) => {
    const qty = Number(newQuantity);
    setCart((prev) => 
      prev.map((item) => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, Math.min(qty, item.stock ?? 999)) } 
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total price
  const cartTotal = cart.reduce((total, item) => {
    const price = typeof item.price === 'number' ? item.price : parseInt(String(item.price).replace(/[^\d]/g, "")) || 0;
    return total + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);