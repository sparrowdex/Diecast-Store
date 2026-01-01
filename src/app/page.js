"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import Link from 'next/link';
import { FEATURED_EXHIBITS, ARCHIVE_COLLECTION } from "../data";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import BentoGrid from "@/components/BentoGrid";
import StandardCard from "@/components/StandardCard";
import CustomCursor from "@/components/CustomCursor";

// --- Reusable Filter Components ---
const FilterButton = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`px-4 py-1.5 text-[10px] font-mono rounded-full border transition-all uppercase tracking-widest ${active ? 'bg-black text-white border-black' : 'bg-transparent text-gray-400 border-gray-200 hover:border-black'}`}>
        {label}
    </button>
);

const Select = ({ value, onChange, options }) => (
    <div className="relative">
        <select
            value={value}
            onChange={onChange}
            className="appearance-none bg-transparent text-gray-400 border-gray-200 hover:border-black border rounded-full px-4 py-1.5 text-[10px] font-mono transition-all uppercase tracking-widest pr-8"
        >
            <option value="All">All Scales</option>
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
    </div>
);


// --- MAIN PAGE COMPONENT ---
export default function GalleryPage() {
  const [selectedScale, setSelectedScale] = useState('All');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [isCursorBlocked, setCursorBlocked] = useState(false);
  const [hoverState, setHoverState] = useState(false);
  const { cart, setIsCartOpen } = useCart();

  // --- Data for Standard Grid ---
  const uniqueScales = [...new Set(ARCHIVE_COLLECTION.map(car => car.scale))].sort();

  const filteredCollection = useMemo(() => {
    return ARCHIVE_COLLECTION
      .filter(car => selectedScale === 'All' || car.scale === selectedScale)
      .filter(car => !showFeaturedOnly || car.isFeatured)
      .filter(car => !showNewOnly || (car.isNew && !car.isFeatured));
  }, [selectedScale, showFeaturedOnly, showNewOnly]);

  return (
    <main className="min-h-screen bg-[#fafafa] text-black p-4 md:p-12 font-sans relative selection:bg-black selection:text-white">
      <CartDrawer />
      
      <header className="mb-20 flex justify-between items-baseline border-b border-black/10 pb-8">
        <div>
          <h1 className="text-6xl font-black tracking-tighter italic">THE_DIECAST_STORE</h1>
          <p className="text-gray-400 text-[10px] tracking-[0.4em] font-mono uppercase mt-3 ml-1">Curated_Diecast_Exhibition</p>
        </div>
        <nav className="hidden md:flex gap-12 text-[10px] font-bold tracking-widest uppercase items-center">
          <Link href="/catalog" className="cursor-pointer hover:underline underline-offset-4">Catalog</Link>
          <Link href="/journal" className="cursor-pointer hover:underline underline-offset-4">Journal</Link>
          <button onClick={() => setIsCartOpen(true)} className="group flex items-center gap-2 px-4 py-2 bg-black text-white rounded-sm hover:bg-red-600 transition-colors">
            <span>VAULT</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px]">{cart.length}</span>
          </button>
        </nav>
      </header>

      {/* Featured Section */}
      <section className="mb-32">
        <div className="flex items-center gap-6 mb-10">
          <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em]">Featured_Exhibits</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-black/10 to-transparent" />
        </div>
        <BentoGrid 
            cars={FEATURED_EXHIBITS} 
            layout="hero"
            setHoverState={setHoverState}
            setCursorBlocked={setCursorBlocked}
        />
      </section>

      {/* New Arrivals & Featured Section */}
      <section className="mb-20">
         <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
           <div>
              <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-2">New Arrivals & Featured</h2>
              <h3 className="text-2xl font-bold tracking-tight">Curated Collection</h3>
           </div>
           <div className="flex items-center gap-2">
                <FilterButton label="Featured" active={showFeaturedOnly} onClick={() => setShowFeaturedOnly(!showFeaturedOnly)} />
                <FilterButton label="New" active={showNewOnly} onClick={() => setShowNewOnly(!showNewOnly)} />
                <div className="w-[1px] h-4 bg-gray-200 mx-2" />
                <Select value={selectedScale} onChange={(e) => setSelectedScale(e.target.value)} options={uniqueScales} />
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
          <AnimatePresence mode="popLayout">
            {filteredCollection.map((car) => (
              <StandardCard key={car.id} car={car} />
            ))}
          </AnimatePresence>
        </div>
      </section>

      <CustomCursor active={hoverState && !isCursorBlocked} />
    </main>
  );
}