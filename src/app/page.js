"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CARS } from "../data";

// --- MAIN PAGE COMPONENT ---
export default function GalleryPage() {
  const [selectedScale, setSelectedScale] = useState(null);
  const [hoverState, setHoverState] = useState(false);
  const [isCursorBlocked, setCursorBlocked] = useState(false);

  // Separate data
  const featuredCars = CARS.filter(car => car.size === 'large');
  const archiveCars = CARS.filter(car => car.size === 'small');
  
  // Get unique scales for filter buttons
  const uniqueScales = [...new Set(archiveCars.map(car => car.scale))].sort();

  // Filter logic
  const filteredArchive = selectedScale
    ? archiveCars.filter(car => car.scale === selectedScale)
    : archiveCars;

  return (
    <main className="min-h-screen bg-[#fafafa] text-black p-4 md:p-12 font-sans relative selection:bg-black selection:text-white">
      
      {/* 1. HEADER */}
      <header className="mb-20 flex justify-between items-baseline border-b border-black/10 pb-8">
        <div>
          <h1 className="text-6xl font-black tracking-tighter italic">GALLERY_01</h1>
          <p className="text-gray-400 text-[10px] tracking-[0.4em] font-mono uppercase mt-3 ml-1">
            Curated_Diecast_Exhibition
          </p>
        </div>
        <nav className="hidden md:flex gap-12 text-[10px] font-bold tracking-widest uppercase">
          <span className="cursor-pointer hover:underline underline-offset-4">Catalog</span>
          <span className="cursor-pointer hover:underline underline-offset-4">Journal</span>
          <div className="flex items-center gap-2 px-3 py-1 border border-black/10 rounded-full">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            <span>Live Vault</span>
          </div>
        </nav>
      </header>

      {/* 2. FEATURED EXHIBITS (BENTO GRID) */}
      <section className="mb-32">
        <div className="flex items-center gap-6 mb-10">
          <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em]">Featured_Exhibits</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-black/10 to-transparent" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[400px]">
          {featuredCars.map((car) => (
            <BentoCard 
              key={car.id} 
              car={car} 
              setHoverState={setHoverState} 
              setCursorBlocked={setCursorBlocked} 
            />
          ))}
        </div>
      </section>

      {/* 3. ARCHIVE COLLECTION (STANDARD GRID) */}
      <section className="mb-20">
        <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
           <div>
              <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-2">Archive_Collection</h2>
              <h3 className="text-2xl font-bold tracking-tight">Full Inventory</h3>
           </div>

           {/* Scale Filters */}
           <div className="flex gap-2">
              <button 
                onClick={() => setSelectedScale(null)}
                className={`px-4 py-1.5 text-[10px] font-mono rounded-full border transition-all uppercase tracking-widest
                  ${!selectedScale ? 'bg-black text-white border-black' : 'bg-transparent text-gray-400 border-gray-200 hover:border-black'}`}
              >
                All
              </button>
              {uniqueScales.map(scale => (
                <button 
                  key={scale}
                  onClick={() => setSelectedScale(scale)}
                  className={`px-4 py-1.5 text-[10px] font-mono rounded-full border transition-all uppercase tracking-widest
                    ${selectedScale === scale ? 'bg-black text-white border-black' : 'bg-transparent text-gray-400 border-gray-200 hover:border-black'}`}
                >
                  {scale}
                </button>
              ))}
           </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
          <AnimatePresence mode="popLayout">
            {filteredArchive.map((car) => (
              <StandardCard key={car.id} car={car} />
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. GLOBAL COMPONENTS */}
      <CustomCursor active={hoverState && !isCursorBlocked} />
      
    </main>
  );
}

// --- SUB-COMPONENT: BENTO CARD (Featured) ---
function BentoCard({ car, setHoverState, setCursorBlocked }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => { setIsHovered(true); setHoverState(true); }}
      onMouseLeave={() => { setIsHovered(false); setHoverState(false); }}
      className="relative md:col-span-2 md:row-span-1 rounded-sm overflow-hidden bg-white border border-gray-100 group shadow-sm hover:shadow-2xl transition-all duration-700"
    >
      {/* Image Layer */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#fdfdfd] p-12">
        <AnimatePresence mode="wait">
           {!isHovered ? (
             <motion.img 
               key="img"
               src={car.image} 
               className="w-full h-full object-contain drop-shadow-xl"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             />
           ) : (
             <motion.div 
               key="vid"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 font-mono text-xs"
             >
               {/* Video Placeholder if file is missing */}
               {car.video ? (
                 <video src={car.video} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-80" />
               ) : (
                 <span>[VIDEO_PREVIEW_LOADING]</span>
               )}
             </motion.div>
           )}
        </AnimatePresence>
      </div>

      {/* Info Slide-Out Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isHovered ? "0%" : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="absolute top-0 right-0 w-1/2 h-full bg-white/95 backdrop-blur-xl border-l border-black/5 p-8 flex flex-col justify-between z-10"
      >
        <div>
          <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">{car.brand}</span>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none mt-2">{car.name}</h3>
          <p className="text-xs text-gray-500 font-light mt-6 leading-relaxed">{car.description}</p>
        </div>
        
        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
           <div>
             <p className="text-[8px] uppercase text-gray-400 tracking-widest mb-1">Acquisition</p>
             <p className="text-xl font-black italic">{car.price}</p>
           </div>
           
           {/* THE SHINY BUTTON */}
           <button 
             onMouseEnter={() => setCursorBlocked(true)}
             onMouseLeave={() => setCursorBlocked(false)}
             className="group/btn relative overflow-hidden bg-black text-white px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
           >
             <span className="relative z-10">Acquire</span>
             {/* The Shine Effect Overlay */}
             <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-15deg]" />
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- SUB-COMPONENT: STANDARD CARD (Archive) ---
function StandardCard({ car }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-square bg-[#f8f8f8] rounded-sm flex items-center justify-center p-6 mb-3 border border-transparent group-hover:border-black/5 transition-colors">
        <img src={car.image} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
        <div className="absolute top-2 left-2">
          <span className="text-[8px] font-mono border border-black/10 bg-white px-1.5 py-0.5 rounded text-gray-500">
            {car.scale}
          </span>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-tight truncate">{car.name}</h4>
        <div className="flex justify-between items-center mt-1 text-[10px]">
          <span className="text-gray-400">{car.brand}</span>
          <span className="font-bold">{car.price}</span>
        </div>
      </div>
    </motion.div>
  );
}

// --- SUB-COMPONENT: RECTANGULAR CURSOR ---
function CustomCursor({ active }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      animate={{
        x: mousePos.x,
        y: mousePos.y,
        scale: active ? 1 : 0,
        opacity: active ? 1 : 0
      }}
      transition={{ type: "spring", damping: 30, stiffness: 250, mass: 0.8 }}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ translateX: "-50%", translateY: "-50%" }} 
    >
      <div className="w-24 h-8 bg-white/20 backdrop-blur-md border border-white/50 shadow-2xl flex items-center justify-center rounded-sm">
        <span className="text-[9px] font-black tracking-widest text-black uppercase">
          View
        </span>
      </div>
    </motion.div>
  );
}