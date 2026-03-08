"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const OutOfStockStamp = ({ isSmall }) => (
  <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden ${isSmall ? 'p-2' : 'p-4 sm:p-8'}`}>
    <motion.div 
      initial={{ scale: 2, opacity: 0, rotate: -20 }}
      animate={{ scale: 1, opacity: 0.9, rotate: -12 }}
      className={`border-4 ${isSmall ? '' : 'sm:border-8'} border-[#FF1E1E] text-[#FF1E1E] ${isSmall ? 'px-2 py-0.5 text-lg sm:text-xl' : 'px-4 sm:px-8 py-1 sm:py-2 text-2xl sm:text-4xl lg:text-6xl'} font-black uppercase tracking-tighter italic whitespace-nowrap`}
      style={{
        boxShadow: isSmall ? 'inset 0 0 0 2px #FF1E1E' : 'inset 0 0 0 4px #FF1E1E',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(2px)'
      }}
    >
      OUT OF STOCK
    </motion.div>
  </div>
);

// --- UPDATED BENTO CARD ---
export default function BentoCard({ car, layout = 'side', setHoverState, setCursorBlocked, isPreview = false, forceHover = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const { cart, addToCart } = useCart();
  const router = useRouter();

  const effectiveHover = forceHover || isHovered;
  const cartItem = cart?.find(item => item.id === car.id);
  const quantityInVault = Number(cartItem?.quantity || 0);

  // Detect container size from layout classes to apply relative scaling
  const isSmall = layout.includes('col-span-4') || layout.includes('col-span-2');
  
  const containerPadding = isSmall ? 'p-3 sm:p-4' : 'p-4 sm:p-6 md:p-8';
  const titleSize = isSmall ? 'text-sm sm:text-base md:text-lg' : 'text-lg sm:text-2xl md:text-3xl';
  const metaSize = isSmall ? 'text-[7px] sm:text-[8px]' : 'text-[8px] sm:text-[10px]';
  const descSize = isSmall ? 'text-[8px] sm:text-[9px]' : 'text-[9px] sm:text-xs';
  const priceSize = isSmall ? 'text-xs sm:text-sm md:text-base' : 'text-sm sm:text-lg md:text-xl';
  const buttonPadding = isSmall ? 'px-3 py-1.5' : 'px-4 sm:px-8 py-2 sm:py-3';
  const buttonText = isSmall ? 'text-[7px] sm:text-[8px]' : 'text-[8px] sm:text-[10px]';

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

  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={forceHover ? undefined : handleMouseEnter}
      onMouseLeave={forceHover ? undefined : handleMouseLeave}
      className={`relative ${layoutClass} aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-gray-100 group shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer`}
    >
      <div className="absolute inset-0 flex items-start justify-start">
        {car.stock === 0 && <OutOfStockStamp isSmall={isSmall} />}
        
        <AnimatePresence mode="wait">
           {!effectiveHover ? (
             <motion.img 
               layoutId={isPreview ? null : `car-image-${car.id}`}
               key="img" src={images[0]} className="w-full h-full object-cover"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             />
           ) : (
             <motion.div key="vid" className="w-full h-full flex items-start justify-start text-gray-300 font-mono text-xs">
               {car.video ? <video src={car.video} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-80" /> : <span>[VIDEO PREVIEW]</span>}
             </motion.div>
           )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: effectiveHover ? "0%" : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className={`absolute top-0 right-0 w-1/2 h-full bg-white/95 backdrop-blur-xl border-l border-black/5 ${containerPadding} flex flex-col justify-between z-10`}
      >
        {/* F1 Checkered Border Effect */}
        <div 
          className="absolute top-0 left-0 w-[3px] h-full opacity-20"
          style={{
            backgroundImage: `repeating-conic-gradient(#0A0A0A 0% 25%, transparent 0% 50%)`,
            backgroundSize: '6px 6px'
          }}
        />

        <div>
          <span className={`${metaSize} text-gray-400 font-mono tracking-widest uppercase`}>
            {car.brand} / {car.variants?.length > 1 ? "Multiple Scales" : (car.variants?.[0]?.scale || car.scale)} 
            {car.modelYear && ` / ${car.modelYear}`}
          </span>
          {car.genre && <div className={`${isSmall ? 'text-[6px]' : 'text-[7px] sm:text-[9px]'} text-red-600 font-bold uppercase mt-1 tracking-tighter`}>{car.genre.replace(/_/g, ' ')}</div>}
          <h3 className={`${titleSize} font-black italic uppercase tracking-tighter leading-none mt-1 sm:mt-2 text-black line-clamp-2`}>{car.name}</h3>
          <p className={`${descSize} text-gray-500 font-light mt-2 sm:mt-4 md:mt-6 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-3 md:line-clamp-4`}>{car.description}</p>
        </div>
        
        <div className={`flex items-center justify-between border-t border-gray-100 ${isSmall ? 'pt-2' : 'pt-3 sm:pt-6'}`}>
           <div className="relative">
             {quantityInVault > 0 && (
               <span className={`absolute ${isSmall ? '-top-2.5' : '-top-3 sm:-top-4'} left-0 ${isSmall ? 'text-[6px]' : 'text-[7px] sm:text-[8px]'} font-bold text-green-600 uppercase`}>In Vault: {quantityInVault}</span>
             )}
             <p className={`${isSmall ? 'text-[6px]' : 'text-[7px] sm:text-[8px]'} uppercase text-gray-400 tracking-widest mb-0.5 sm:mb-1`}>Acquisition</p>
             <p className={`${priceSize} font-black italic text-black`}>
               {car.variants?.length > 0 
                 ? `₹${car.variants[0].price}${car.variants.length > 1 ? '+' : ''}`
                 : `₹${car.price || 0}`}
             </p>
           </div>
           
           <motion.button 
             onClick={handleAddToCart}
             onMouseEnter={() => !isPreview && setCursorBlocked && setCursorBlocked(true)}
             onMouseLeave={() => !isPreview && setCursorBlocked(false)}
             disabled={isPreview || car.stock === 0}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.98 }}
             className={`group/btn relative overflow-hidden bg-black text-white ${buttonPadding} font-black ${buttonText} uppercase tracking-widest transition-all disabled:bg-gray-300 disabled:text-gray-500`}
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