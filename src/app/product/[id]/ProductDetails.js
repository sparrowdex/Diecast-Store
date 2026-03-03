"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react"; 
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";

export default function ProductDetailClient({ car, preview = false }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const { addToCart, setIsCartOpen, cart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [mediaError, setMediaError] = useState(false);

  // 1. Media Setup
  const media = [];
  if (car?.images) {
    media.push(...car.images.map(url => ({ url, type: 'image' })));
  }
  if (car?.video) {
    media.push({ url: car.video, type: 'video' });
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = media[activeIndex];

  // 2. Navigation Logic
  const nextMedia = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % media.length);
  }, [media.length]);

  const prevMedia = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + media.length) % media.length);
  }, [media.length]);

  // 3. Keyboard Navigation (Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "ArrowLeft") prevMedia();
      if (e.key === "Escape") setIsFullScreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextMedia, prevMedia]);

  // Reset error on change
  useEffect(() => {
    setMediaError(false);
  }, [activeIndex]);

  if (!car) return <div className="p-20 font-mono text-black">Exhibit Not Found.</div>;

  const isVideo = activeMedia?.type === 'video';

  return (
    <main className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden relative selection:bg-black selection:text-white">
      <CartDrawer />
      
      {/* LEFT SIDE: MEDIA STAGE */}
      <motion.section 
        layout
        className={`relative bg-[#f8f8f8] flex flex-col items-center justify-center transition-all duration-700 ease-in-out
          ${isFullScreen ? 'w-full h-screen z-40 fixed inset-0' : 'w-full md:w-[60%] h-[50vh] md:h-screen'}
        `}
      >
        {/* Navigation & Cart Overlay */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50">
          {!preview && (
            <Link href="/" className="text-[10px] font-black tracking-widest uppercase hover:underline text-black">
              ← Gallery_Index
            </Link>
          )}

          {!preview && (
            <div className="ml-auto flex items-center gap-6">
              {!isLoaded ? (
                <div className="w-12 h-4 bg-black/5 animate-pulse" />
              ) : isSignedIn ? (
                <div className="group relative py-2">
                  <Link href="/access" className="text-[10px] font-black tracking-widest uppercase text-black border-b border-black">
                    ACCESS
                  </Link>
                  <div className="absolute top-full right-0 w-48 pt-6 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                    <div className="bg-white border border-black p-2 flex flex-col text-right shadow-xl">
                      <Link href="/access" className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400 hover:text-black">My Collection</Link>
                      <SignOutButton>
                        <button className="w-full text-right px-4 py-3 text-[10px] font-black uppercase text-red-600">Logout</button>
                      </SignOutButton>
                    </div>
                  </div>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="text-[10px] font-black uppercase text-black hover:text-red-600">LOGIN</button>
                </SignInButton>
              )}
              <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-black/5 text-black">
                <span className="text-[9px] font-black">VAULT</span>
                <span className="text-[9px]">{cart.length}</span>
              </button>
            </div>
          )}
        </div>

        {/* Hero Media with Swipe Support */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {mediaError ? (
              <motion.div key="error" className="text-center font-mono text-gray-400">
                <p>Media Load Error</p>
              </motion.div>
            ) : (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, { offset, velocity }) => {
                  if (offset.x > 100) prevMedia();
                  else if (offset.x < -100) nextMedia();
                }}
                className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing ${isFullScreen ? 'p-0' : 'p-12'}`}
              >
                {isVideo ? (
                  <video
                    src={activeMedia.url}
                    className="w-full h-full object-contain"
                    autoPlay loop muted playsInline
                    onError={() => setMediaError(true)}
                  />
                ) : (
                  <div className={`relative w-full h-full ${isFullScreen ? 'scale-100' : 'scale-90'} transition-transform duration-500`}>
                    <Image 
                      src={activeMedia.url} 
                      alt={car.name} 
                      fill 
                      className="object-contain drop-shadow-2xl" 
                      priority 
                      onError={() => setMediaError(true)}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Responsive Thumbnail Gallery (Visible in Zoom too) */}
        {media.length > 1 && (
          <div className={`absolute left-1/2 -translate-x-1/2 flex gap-2 bg-white/50 backdrop-blur-md p-1.5 md:p-2 rounded-full z-50 transition-all duration-500
            ${isFullScreen ? 'bottom-24 md:bottom-12 scale-90 md:scale-100' : 'bottom-8'}
          `}>
            {media.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden border-2 transition-all ${
                  activeIndex === index ? 'border-black scale-110 shadow-lg' : 'border-transparent hover:border-black/30'
                }`}
              >
                {item.type === 'video' ? (
                   <div className="w-full h-full bg-black flex items-center justify-center">
                      <svg className="w-3 h-3 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                   </div>
                ) : (
                  <Image src={item.url} alt="thumb" fill className="object-cover" sizes="48px" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Toggle Zoom Button */}
        <button 
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="absolute bottom-8 right-8 bg-black text-white p-4 rounded-full hover:scale-110 transition-transform shadow-xl z-50"
        >
          {isFullScreen ? <span className="text-[10px] font-mono px-2">EXIT_VIEW</span> : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2h4M2 2v4M14 2h-4M14 2v4M2 14h4M2 14v-4M14 14h-4M14 14v-4"/></svg>}
        </button>
      </motion.section>

      {/* RIGHT SIDE: DATA PLATE */}
      <AnimatePresence>
        {!isFullScreen && (
          <motion.section
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="w-full md:w-[40%] h-screen bg-white border-l border-black/5 flex flex-col relative"
          >
            <div className="flex-1 overflow-y-auto p-8 md:p-16">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 border border-black/10 rounded-full text-[9px] font-mono uppercase text-gray-500">{car.brand}</span>
                <span className="px-3 py-1 border border-black/10 rounded-full text-[9px] font-mono uppercase text-gray-500">Scale {car.scale}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] mb-8 text-black">{car.name}</h1>
              <div className="h-[1px] w-full bg-black/5 my-8" />
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Exhibit_Description</h3>
                  <p className="text-sm font-light leading-relaxed text-gray-600">{car.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-sm">
                    <p className="text-[8px] uppercase text-gray-400 tracking-widest">Material</p>
                    <p className="text-xs font-bold text-black">{car.material || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-sm">
                    <p className="text-[8px] uppercase text-gray-400 tracking-widest">Condition</p>
                    <p className="text-xs font-bold text-black">{car.condition || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-t border-black/5 p-8 md:p-16 pt-8">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[10px] uppercase text-gray-400 tracking-widest mb-1">Valuation</p>
                  <p className="text-4xl font-black italic tracking-tighter text-black leading-none">₹{car.price}</p>
                </div>
                <div className="flex items-center border border-black/10 rounded-sm h-12">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 h-full hover:bg-gray-50 border-r border-black/10">-</button>
                  <span className="px-6 font-mono text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(car.stock || 99, quantity + 1))} className="px-4 h-full hover:bg-gray-50 border-l border-black/10">+</button>
                </div>
              </div>
              <button
                onClick={() => addToCart(car, quantity)}
                disabled={car.stock === 0}
                className="w-full group relative overflow-hidden bg-black text-white py-5 font-black text-xs uppercase tracking-[0.3em] disabled:bg-gray-300"
              >
                 <span className="relative z-10">{car.stock === 0 ? 'Sold Out' : 'Acquire Exhibit'}</span>
                 {car.stock > 0 && <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" />}
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}