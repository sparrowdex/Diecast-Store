"use client"; // Required for Framer Motion and State
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CARS } from "../data"; // Path to your data.js in 'src/'

// 1. THE MAIN PAGE (Must be the default export)
export default function GalleryPage() {
  // --- STATE FOR THE FILTER ---
  const [selectedScale, setSelectedScale] = useState(null);

  // --- DATA DERIVATION ---
  const featuredCars = CARS.filter(car => car.size === 'large');
  const archiveCars = CARS.filter(car => car.size === 'small');
  
  // Dynamically get all unique scales from the archive collection
  const uniqueScales = [...new Set(archiveCars.map(car => car.scale))].sort();

  // Apply the filter to the archive cars
  const filteredArchiveCars = selectedScale
    ? archiveCars.filter(car => car.scale === selectedScale)
    : archiveCars;

  return (
    <main className="min-h-screen bg-[#fafafa] text-black p-4 md:p-12 font-sans">
      {/* Premium Header */}
      <header className="mb-16 flex justify-between items-baseline border-b border-black/10 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter italic">GALLERY_01</h1>
          <p className="text-gray-400 text-xs tracking-[0.3em] font-mono uppercase mt-2">
            Curated_Collector_Exhibition_2025
          </p>
        </div>
        <nav className="hidden md:flex gap-8 text-[10px] font-bold tracking-widest uppercase">
          <span className="cursor-pointer hover:line-through">Catalog</span>
          <span className="cursor-pointer hover:line-through">Archive</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>Live Inventory</span>
          </div>
        </nav>
      </header>

      {/* SECTION 1: THE EXHIBIT (BENTO) */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.4em]">Featured_Exhibits</h2>
          <div className="h-[1px] flex-1 bg-black/5" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[350px] grid-flow-dense">
          {featuredCars.map((car) => (
            <GalleryCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* SECTION 2: THE ARCHIVE (STANDARD GRID) */}
      <section>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
                <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.4em]">Archive_Collection</h2>
                <div className="h-[1px] flex-1 bg-black/5 min-w-[50px]" />
            </div>
            {/* --- SCALE FILTER UI --- */}
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase">
                <button 
                    onClick={() => setSelectedScale(null)}
                    className={`px-3 py-1 rounded-full transition-colors ${!selectedScale ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                >
                    All
                </button>
                {uniqueScales.map(scale => (
                    <button 
                        key={scale}
                        onClick={() => setSelectedScale(scale)}
                        className={`px-3 py-1 rounded-full transition-colors ${selectedScale === scale ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                    >
                        {scale}
                    </button>
                ))}
            </div>
        </div>
        
        {/* Tighter 6-column grid for the archive */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10">
          <AnimatePresence>
            {filteredArchiveCars.map((car) => (
              <StandardCard key={car.id} car={car} />
            ))}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}

// 2. THE BENTO CARD COMPONENT
function GalleryCard({ car }) {
  const [isHovered, setIsHovered] = useState(false);
  const isLarge = car.size === 'large';

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative rounded-xl overflow-hidden bg-white border border-black/5 shadow-sm transition-all duration-500
        ${isLarge ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'}
        ${isHovered ? 'shadow-2xl' : ''}
      `}
    >
      {/* Media Layer */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#fdfdfd]">
        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.img
              key="image"
              src={car.image} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full h-full object-contain ${isLarge ? 'p-16' : 'p-8'}`}
            />
          ) : (
            <motion.div 
              key="video-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 w-full h-full bg-gray-200"
            >
              <video
                src={car.video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Overlay Panel */}
      <motion.div
        initial={false}
        animate={{ 
          x: isHovered ? "0%" : "101%", 
          opacity: isHovered ? 1 : 0 
        }}
        transition={{ type: "spring", damping: 30, stiffness: 150 }}
        className={`absolute top-0 right-0 h-full bg-black/95 backdrop-blur-xl text-white p-8 flex flex-col z-10
          ${isLarge ? 'w-1/2' : 'w-full'}
        `}
      >
        <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-start">
                <span className="text-[10px] text-gray-500 font-mono tracking-widest">{car.brand}</span>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded">#{car.id}</span>
            </div>
            
            <h2 className={`font-black mt-4 leading-none uppercase italic tracking-tighter
                ${isLarge ? 'text-4xl' : 'text-xl'}
            `}>
                {car.name}
            </h2>
            
            <div className="h-[1px] w-full bg-white/20 my-6" />
            
            <p className="text-gray-400 font-light leading-relaxed text-sm mb-4">
              A championship-winning formula car, engineered for peak performance and presented in pristine collector's condition.
            </p>
            
            <div className="flex flex-wrap gap-2 text-[8px] font-bold">
                <div className="border border-white/20 px-2 py-1 rounded-full uppercase tracking-tighter">
                Scale_{car.scale}
                </div>
                <div className="border border-white/20 px-2 py-1 rounded-full uppercase tracking-tighter">
                Mint_Stk
                </div>
            </div>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/10">
            <div>
                <p className="text-[7px] text-gray-500 uppercase mb-1">Value</p>
                <span className={`${isLarge ? 'text-2xl' : 'text-lg'} font-black italic tracking-tighter`}>
                {car.price}
                </span>
            </div>
            <button className="bg-white text-black text-[9px] font-black px-5 py-3 hover:bg-red-500 hover:text-white transition-all duration-300 uppercase tracking-tighter italic">
                Acquire Item
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
}


// 3. THE STANDARD ARCHIVE CARD
function StandardCard({ car }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/3] bg-[#f5f5f5] rounded-lg overflow-hidden flex items-center justify-center p-6 mb-3 transition-colors group-hover:bg-[#ebebeb]">
        <img 
          src={car.image} 
          alt={car.name} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="bg-white/80 backdrop-blur px-1.5 py-0.5 text-[8px] font-mono border rounded uppercase">
            {car.scale}
          </span>
        </div>
      </div>
      
      <div className="px-1">
        <h3 className="text-[11px] font-bold uppercase tracking-tight text-gray-900 truncate">
          {car.name}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[10px] text-gray-400 font-mono uppercase">{car.brand}</span>
          <span className="text-xs font-black italic">{car.price}</span>
        </div>
      </div>
    </motion.div>
  );
}
