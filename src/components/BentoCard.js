"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const OutOfStockStamp = () => (
  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden p-8">
    <motion.div 
      initial={{ scale: 2, opacity: 0, rotate: -20 }}
      animate={{ scale: 1, opacity: 0.9, rotate: -12 }}
      className="border-8 border-[#FF1E1E] text-[#FF1E1E] px-8 py-2 font-black text-4xl lg:text-6xl uppercase tracking-tighter italic whitespace-nowrap"
      style={{
        boxShadow: 'inset 0 0 0 4px #FF1E1E',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(2px)'
      }}
    >
      OUT_OF_STOCK
    </motion.div>
  </div>
);

// --- UPDATED BENTO CARD ---
export default function BentoCard({ 
  car, 
  layout = 'side', 
  setHoverState, 
  setCursorBlocked, 
  isPreview = false, 
  forceHover = false,
  onFocusClick // New prop for Focus Mode
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { cart, addToCart } = useCart();
  const router = useRouter();

  const effectiveHover = forceHover || isHovered;
  const cartItem = cart?.find(item => item.id === car.id);
  const quantityInVault = Number(cartItem?.quantity || 0);

  const handleClick = () => {
    if (isPreview) return;
    
    if (onFocusClick) {
      onFocusClick();
    } else {
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

  const images = car?.images && car.images.length > 0 ? car.images : (car?.image ? [car.image] : []);

  if (!car || images.length === 0) {
    return (
      <div className={`${layoutClass} rounded-2xl overflow-hidden bg-gray-800 border border-gray-700`}>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <span className="text-gray-500 text-xs font-mono">[Missing Content]</span>
        </div>
      </div>
    );
  }

  const isSmallCard = layout.includes('col-span-4') || layout.includes('col-span-2');

  // Determine sidebar width based on card size
  let sidebarWidth = 'w-1/2';
  if (layout.includes('col-span-12')) {
    sidebarWidth = 'w-3/5'; // Wider for full-width cards
  } else if (layout.includes('col-span-8')) {
    sidebarWidth = 'w-1/2'; // Standard for large cards
  } else if (layout.includes('col-span-6')) {
    sidebarWidth = 'w-2/5'; // Narrower for medium cards
  } else if (layout.includes('col-span-4')) {
    sidebarWidth = 'w-1/2'; // Halfway as requested
  } else if (layout.includes('col-span-2')) {
    sidebarWidth = 'w-1/4'; // Narrowest for very small cards
  }

  return (
    <motion.div
      layoutId={isPreview ? null : `card-${car.id}`}
      onClick={handleClick}
      onMouseEnter={forceHover ? undefined : handleMouseEnter}
      onMouseLeave={forceHover ? undefined : handleMouseLeave}
      className={`relative ${layoutClass} rounded-2xl overflow-hidden bg-white group shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer`}
    >
      <div className={`absolute inset-0 flex items-center justify-center p-8 transition-colors duration-500 ${effectiveHover ? 'bg-black' : 'bg-white'}`}>
        {car.stock === 0 && <OutOfStockStamp />}
        
        <AnimatePresence mode="wait">
           {!effectiveHover ? (
             <motion.img 
               key="img" src={images[0]} className="w-full h-full object-contain"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             />
           ) : (
             <motion.div key="vid" className="w-full h-full flex items-center justify-center text-gray-300 font-mono text-xs">
               {car.video ? <video src={car.video} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-80" /> : <span>[VIDEO_PREVIEW]</span>}
             </motion.div>
           )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: effectiveHover ? "0%" : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className={`absolute top-0 right-0 ${sidebarWidth} h-full bg-white/95 backdrop-blur-xl border-l border-black/5 ${isSmallCard ? 'p-4' : 'p-8'} flex flex-col justify-between z-10 overflow-hidden`}
      >
        {/* F1 Checkered Border Effect */}
        <div 
          className="absolute top-0 left-0 w-[3px] h-full opacity-20"
          style={{
            backgroundImage: `repeating-conic-gradient(#000 0% 25%, transparent 0% 50%)`,
            backgroundSize: '6px 6px'
          }}
        />

        <div className="relative z-10">
          <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">{car.brand} / {car.scale} {car.modelYear && `/ ${car.modelYear}`}</span>
          {car.genre && <div className="text-[9px] text-red-600 font-bold uppercase mt-1 tracking-tighter">{car.genre.replace(/_/g, ' ')}</div>}
          <h3 className={`${isSmallCard ? 'text-lg' : 'text-3xl'} font-black italic uppercase tracking-tighter leading-none mt-2 text-black`}>{car.name}</h3>
          <p className={`${isSmallCard ? 'text-[10px] mt-2' : 'text-xs mt-6'} text-gray-500 font-light leading-relaxed line-clamp-3`}>{car.description}</p>
        </div>
        
        <div className={`relative z-10 flex items-center justify-between border-t border-gray-100 ${isSmallCard ? 'pt-3' : 'pt-6'}`}>
           <div className="relative">
             {quantityInVault > 0 && (
               <span className="absolute -top-4 left-0 text-[8px] font-bold text-green-600 uppercase">In Vault: {quantityInVault}</span>
             )}
             <p className="text-[8px] uppercase text-gray-400 tracking-widest mb-1">Acquisition</p>
             <p className="text-xl font-black italic text-black">₹{car.price}</p>
           </div>
           
           <motion.button 
             onClick={handleAddToCart}
             onMouseEnter={() => !isPreview && setCursorBlocked(true)}
             onMouseLeave={() => !isPreview && setCursorBlocked(false)}
             disabled={isPreview || car.stock === 0}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.98 }}
             className={`group/btn relative overflow-hidden bg-linear-to-b from-zinc-800 to-black border border-white/10 shadow-2xl text-white ${isSmallCard ? 'px-4 py-2' : 'px-8 py-3'} font-black text-[10px] uppercase tracking-widest transition-all disabled:bg-gray-300 disabled:text-gray-500`}
           >
             {/* Hidden text to maintain button width */}
             <span className="invisible block">{car.stock === 0 ? 'Sold Out' : 'Acquire'}</span>
             
             {/* The sliding wrapper */}
             <div className="absolute inset-0 z-10 flex w-[200%] h-full transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover/btn:-translate-x-1/2 group-hover/btn:-skew-x-[15deg]">
               <span className="w-1/2 h-full flex items-center justify-center">{car.stock === 0 ? 'Sold Out' : 'Acquire'}</span>
               <span className="w-1/2 h-full flex items-center justify-center italic">{car.stock === 0 ? 'Sold Out' : 'Acquire'}</span>
             </div>

             <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-15deg]" />
           </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}