"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Link from "next/link"; // NEW: Import Link for navigation

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
          />
          
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white border-l border-black/5 shadow-2xl z-[9999] flex flex-col font-sans"
          >
            {/* Header */}
            <div className="p-6 border-b border-black/5 flex justify-between items-center bg-gray-50">
              <h2 className="text-sm font-black uppercase tracking-widest">Your_Vault ({cart.length})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-xs font-mono hover:text-red-500">[CLOSE]</button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                  <span className="text-4xl mb-4">❖</span>
                  <p className="text-xs font-mono uppercase tracking-widest">Vault is Empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-16 bg-gray-100 rounded-sm p-2 flex-shrink-0 border border-black/5">
                      <img 
                        src={item.image || (item.images && item.images[0]) || "/placeholder-car.png"} 
                        className="w-full h-full object-contain mix-blend-multiply" 
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold uppercase tracking-tight">{item.name}</h3>
                        <p className="text-xs font-mono">{item.price}</p>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase">{item.brand} • Scale {item.scale}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-[9px] text-red-500 underline mt-2 hover:no-underline uppercase tracking-wider"
                      >
                        Remove_Item
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-6 bg-black text-white">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Total_Valuation</span>
                  <span className="text-2xl font-black italic">₹{cartTotal.toLocaleString()}</span>
                </div>
                
                {/* NEW: Link to Checkout */}
                <Link 
                  href="/checkout" 
                  onClick={() => setIsCartOpen(false)} // Close drawer on navigation
                  className="block w-full"
                >
                  <button className="w-full bg-white text-black py-4 font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors">
                    Proceed to Checkout
                  </button>
                </Link>
                
                <p className="text-[8px] text-gray-500 text-center mt-3 font-mono">SECURE_ENCRYPTED_TRANSACTION</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}