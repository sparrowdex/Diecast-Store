"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

// --- UPDATED BENTO CARD ---
export default function BentoCard({ car, layout = 'side', setHoverState, setCursorBlocked, isPreview = false, forceHover = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const effectiveHover = forceHover || isHovered;

  const handleClick = () => {
    if (!isPreview) {
      router.push(`/product/${car.id}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isPreview) {
      addToCart(car);
    }
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (setHoverState) setHoverState(true);
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (setHoverState) setHoverState(false);
  }

  const layoutClass = layout; // The prop is now the class string itself

  if (!car || !car.images || car.images.length === 0) {
    return (
      <div className={`${layoutClass} rounded-2xl overflow-hidden bg-gray-800 border border-gray-700`}>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <span className="text-gray-500 text-xs font-mono">[Missing Content]</span>
        </div>
      </div>
    );
  }

  // Determine sidebar width based on card size
  let sidebarWidth = 'w-1/2';
  if (layout.includes('col-span-12')) {
    sidebarWidth = 'w-3/5'; // Wider for full-width cards
  } else if (layout.includes('col-span-8')) {
    sidebarWidth = 'w-1/2'; // Standard for large cards
  } else if (layout.includes('col-span-6')) {
    sidebarWidth = 'w-2/5'; // Narrower for medium cards
  } else if (layout.includes('col-span-4')) {
    sidebarWidth = 'w-1/3'; // Even narrower for smaller cards
  } else if (layout.includes('col-span-2')) {
    sidebarWidth = 'w-1/4'; // Narrowest for very small cards
  }

  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={forceHover ? undefined : handleMouseEnter}
      onMouseLeave={forceHover ? undefined : handleMouseLeave}
      className={`relative ${layoutClass} rounded-2xl overflow-hidden bg-white border border-gray-100 group shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer`}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-[#fdfdfd] p-8">
        <AnimatePresence mode="wait">
           {!effectiveHover ? (
             <motion.img 
               layoutId={isPreview ? null : `car-image-${car.id}`}
               key="img" src={car.images[0]} className="w-full h-full object-cover"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             />
           ) : (
             <motion.div key="vid" className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 font-mono text-xs">
               {car.video ? <video src={car.video} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-80" /> : <span>[VIDEO_PREVIEW]</span>}
             </motion.div>
           )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: effectiveHover ? "0%" : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="absolute top-0 right-0 w-1/2 h-full bg-white/95 backdrop-blur-xl border-l border-black/5 p-8 flex flex-col justify-between z-10"
      >
        <div>
          <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">{car.brand} / {car.scale}</span>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none mt-2">{car.name}</h3>
          <p className="text-xs text-gray-500 font-light mt-6 leading-relaxed line-clamp-3">{car.description}</p>
        </div>
        
        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
           <div>
             <p className="text-[8px] uppercase text-gray-400 tracking-widest mb-1">Acquisition</p>
             <p className="text-xl font-black italic">₹{car.price}</p>
           </div>
           
           <button 
             onClick={handleAddToCart}
             onMouseEnter={() => !isPreview && setCursorBlocked(true)}
             onMouseLeave={() => !isPreview && setCursorBlocked(false)}
             disabled={isPreview}
             className="group/btn relative overflow-hidden bg-black text-white px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform disabled:bg-gray-400"
           >
             <span className="relative z-10">Acquire</span>
             <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-15deg]" />
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
}