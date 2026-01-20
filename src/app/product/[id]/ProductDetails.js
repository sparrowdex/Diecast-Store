"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react"; 
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";

export default function ProductDetailClient({ car, preview = false }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const { addToCart, setIsCartOpen, cart } = useCart();
  const [mediaError, setMediaError] = useState(false); // New state for media errors

  // Combine image(s) and video into a single media array of objects
  const media = [];
  if (car?.images) {
    media.push(...car.images.map(url => ({ url, type: 'image' })));
  }
  if (car?.video) {
    media.push({ url: car.video, type: 'video' });
  }

  const [activeMedia, setActiveMedia] = useState(media[0]);

  // Reset mediaError when activeMedia changes
  useEffect(() => {
    setMediaError(false);
  }, [activeMedia]);

  if (!car) return <div className="p-20 font-mono text-black">Exhibit Not Found.</div>;

  const isVideo = activeMedia?.type === 'video';

  const handleMediaError = () => {
    setMediaError(true);
  };

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
        {/* Navigation & Cart */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50">
          {!preview && (
            <Link href="/" className="text-[10px] font-black tracking-widest uppercase hover:underline text-black">
              ← Gallery_Index
            </Link>
          )}

          {/* User Section */}
          {!preview && (
            <div className="ml-auto mr-6">
              {!isLoaded ? (
                <div className="w-12 h-4 bg-black/5 animate-pulse" />
              ) : isSignedIn ? (
                <div className="group relative py-2">
                  <Link href="/access" className="text-[10px] font-black tracking-widest uppercase text-black border-b border-black hover:text-red-600 hover:border-red-600 transition-all">
                    ACCESS
                  </Link>
                  <div className="absolute top-full right-0 w-48 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50">
                    <div className="bg-white border border-black shadow-2xl p-2 flex flex-col text-right">
                      <Link href="/access" className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all">My Collection</Link>
                      <SignOutButton>
                        <button className="w-full text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors">Logout</button>
                      </SignOutButton>
                    </div>
                  </div>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="text-[10px] font-black tracking-widest uppercase text-black hover:text-red-600 transition-colors">
                    LOGIN
                  </button>
                </SignInButton>
              )}
            </div>
          )}

          {!preview && (
            <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-black/5 hover:bg-black hover:text-white transition-colors text-black">
                <span className="text-[9px] font-black uppercase">Vault</span>
                <span className="text-[9px]">{cart.length}</span>
            </button>
          )}
        </div>

        {/* The Hero Media */}
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {mediaError ? (
              <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm font-mono text-center">Failed to load media.<br/>Please check your connection.</p>
              </div>
            ) : isVideo ? (
               <motion.video
                key={activeMedia.url}
                layoutId={`car-image-${car.id}`}
                src={activeMedia.url}
                className={`w-full h-full object-contain transition-all duration-700 ${isFullScreen ? 'p-0' : 'p-12'}`}
                autoPlay loop muted playsInline
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onError={handleMediaError} // Add onError handler
              />
            ) : (
              <motion.img
                key={activeMedia.url}
                layoutId={`car-image-${car.id}`}
                src={activeMedia.url}
                className={`object-contain transition-all duration-700 drop-shadow-2xl ${isFullScreen ? 'w-[80%] h-[80%] p-0' : 'w-[70%] h-[70%] p-12'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onError={handleMediaError} // Add onError handler
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
                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-colors ${activeMedia.url === item.url ? 'border-black' : 'border-transparent hover:border-black/50'}`}
              >
                {item.type === 'video' ? (
                   <div className="w-full h-full bg-black flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                   </div>
                ) : (
                  <img src={item.url} className="w-full h-full object-cover" alt="thumbnail" />
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
            className="w-full md:w-[40%] h-screen bg-white border-l border-black/5 flex flex-col relative"
          >
            {/* Scrollable Content: flex-1 allows it to take all remaining space */}
            <div className="flex-1 overflow-y-auto p-8 md:p-16">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 border border-black/10 rounded-full text-[9px] font-mono uppercase text-gray-500">{car.brand}</span>
                <span className="px-3 py-1 border border-black/10 rounded-full text-[9px] font-mono uppercase text-gray-500">Scale {car.scale}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] mb-8 text-black">
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

                {car.editorsNote && (
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Editor&apos;s_Note</h3>
                    <p className="text-sm font-light leading-relaxed text-gray-600">
                      {car.editorsNote}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pb-8">
                  <div className="p-4 bg-gray-50 rounded-sm">
                    <p className="text-[8px] uppercase text-gray-400 tracking-widest mb-1">Material</p>
                    <p className="text-xs font-bold text-black">{car.material || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-sm">
                    <p className="text-[8px] uppercase text-gray-400 tracking-widest mb-1">Condition</p>
                    <p className="text-xs font-bold text-black">{car.condition || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar: Static position, always at the bottom of the section */}
            <div className="bg-white border-t border-black/5 p-8 md:p-16 pt-8">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] uppercase text-gray-400 tracking-widest">Valuation</span>
                <span className="text-4xl font-black italic tracking-tighter text-black">₹{car.price}</span>
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