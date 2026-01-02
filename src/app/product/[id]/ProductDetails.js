"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, use } from "react"; 
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";

export default function ProductDetailClient({ car }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { addToCart, setIsCartOpen, cart } = useCart();

  // Combine image(s) and video into a single media array
  const media = [];
  if (car?.images) {
    media.push(...car.images);
  }
  if (car?.video) {
    media.push(car.video);
  }

  const [activeMedia, setActiveMedia] = useState(media[0]);

  if (!car) return <div className="p-20 font-mono">Exhibit Not Found.</div>;

  const isVideo = activeMedia && activeMedia.endsWith('.mp4');

  return (
    <main className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden relative selection:bg-black selection:text-white">
      <CartDrawer />
      
      {/* 1. LEFT SIDE: MEDIA STAGE */}
      <motion.section 
        layout
        className={`relative bg-[#f8f8f8] flex flex-col items-center justify-center transition-all duration-700 ease-in-out
          ${isFullScreen ? 'w-full h-screen z-40 fixed inset-0' : 'w-full md:w-[60%] h-[50vh] md:h-screen'}
        `}
      >
        {/* Navigation & Cart (Absolute on top of media) */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50">
          <Link href="/" className="text-[10px] font-black tracking-widest uppercase hover:underline">
            ← Gallery_Index
          </Link>
          <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-black/5 hover:bg-black hover:text-white transition-colors">
             <span className="text-[9px] font-black uppercase">Vault</span>
             <span className="text-[9px]">{cart.length}</span>
          </button>
        </div>

        {/* The Hero Media (Image or Video) */}
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isVideo ? (
               <motion.video
                key={activeMedia}
                layoutId={`car-image-${car.id}`}
                src={activeMedia}
                className={`w-full h-full object-contain transition-all duration-700
                    ${isFullScreen ? 'p-0' : 'p-12'}`}
                autoPlay loop muted playsInline
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ) : (
              <motion.img
                key={activeMedia}
                layoutId={`car-image-${car.id}`}
                src={activeMedia}
                className={`object-contain transition-all duration-700 drop-shadow-2xl
                  ${isFullScreen ? 'w-[80%] h-[80%] p-0' : 'w-[70%] h-[70%] p-12'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Media Thumbnail Gallery */}
        {media.length > 1 && !isFullScreen && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-full z-50">
            {media.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveMedia(item)}
                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-colors ${activeMedia === item ? 'border-black' : 'border-transparent hover:border-black/50'}`}
              >
                {item.endsWith('.mp4') ? (
                   <div className="w-full h-full bg-black flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 011.45.89v2.22a1 1 0 01-1.45.89L15 12M4 6h11a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" /></svg>
                   </div>
                ) : (
                  <img src={item} className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Toggle View Button */}
        <button 
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="absolute bottom-8 right-8 bg-black text-white p-4 rounded-full hover:scale-110 transition-transform shadow-xl z-50"
        >
          {isFullScreen ? (
            <span className="text-[10px] font-mono">EXIT_VIEW</span>
          ) : (
             <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2h4M2 2v4M14 2h-4M14 2v4M2 14h4M2 14v-4M14 14h-4M14 14v-4"/></svg>
          )}
        </button>
      </motion.section>

      {/* 2. RIGHT SIDE: DATA PLATE */}
      <AnimatePresence>
        {!isFullScreen && (
          <motion.section 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-[40%] h-auto md:h-screen overflow-y-auto bg-white border-l border-black/5 p-8 md:p-16 flex flex-col"
          >
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 border border-black/10 rounded-full text-[9px] font-mono uppercase text-gray-500">{car.brand}</span>
                <span className="px-3 py-1 border border-black/10 rounded-full text-[9px] font-mono uppercase text-gray-500">Scale {car.scale}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] mb-8">
                {car.name}
              </h1>

              <div className="h-[1px] w-full bg-black/5 my-8" />

              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Exhibit_Description</h3>
                  <p className="text-sm font-light leading-relaxed text-gray-600">
                    {car.description || "A pristine example of automotive engineering in miniature form. This diecast model features authentic livery application, rubber tires, and detailed interior components matching the original specification."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-sm">
                    <p className="text-[8px] uppercase text-gray-400 tracking-widest mb-1">Material</p>
                    <p className="text-xs font-bold">Diecast Metal / ABS</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-sm">
                    <p className="text-[8px] uppercase text-gray-400 tracking-widest mb-1">Condition</p>
                    <p className="text-xs font-bold">Mint (Boxed)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-12 pt-8 border-t border-black/5 sticky bottom-0 bg-white/95 backdrop-blur">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] uppercase text-gray-400 tracking-widest">Valuation</span>
                <span className="text-4xl font-black italic tracking-tighter">{car.price}</span>
              </div>
              <button 
                onClick={() => addToCart(car)}
                className="w-full group relative overflow-hidden bg-black text-white py-5 font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors"
              >
                 <span className="relative z-10">Acquire Exhibit</span>
                 <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-15deg]" />
              </button>
              <p className="text-[8px] text-gray-400 text-center mt-3 font-mono">WORLDWIDE_SHIPPING_AVAILABLE</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
