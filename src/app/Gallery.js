"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useState, useMemo } from "react";
import Link from 'next/link';
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import BentoGrid from "@/components/BentoGrid";
import StandardCard from "@/components/StandardCard";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";

// --- COMPONENT: SpeedLink ("The Overtake" Animation) ---
const SpeedLink = ({ href, children }) => {
  return (
    <Link href={href} className="group relative block w-fit overflow-hidden py-1">
      
      {/* LAYER 1: The "Slow" Car (Black Text) */}
      <span className="relative z-10 block font-mono text-sm font-bold uppercase tracking-widest text-black transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-[110%]">
        {children}
      </span>

      {/* LAYER 2: The "Fast" Car (Red Text) */}
      <span className="absolute inset-0 z-0 block -translate-x-[110%] font-mono text-sm font-bold uppercase italic tracking-widest text-[#FF1E1E] transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0 group-hover:-skew-x-12">
        {children}
      </span>

      {/* LAYER 3: The Racing Kerb (CSS class in globals.css) */}
      <span className="absolute bottom-0 left-0 h-[3px] w-full translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 kerb-animation" />
    </Link>
  );
};

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
export default function Gallery({ featuredExhibits, archiveCollection, newArrivals, featuredLayout = 'hero' }) {
    const [isCursorBlocked, setCursorBlocked] = useState(false);
    const [hoverState, setHoverState] = useState(false);
    const { isSignedIn, isLoaded } = useUser();
    const { cart, setIsCartOpen } = useCart();

    const fullCollection = useMemo(() => [...newArrivals, ...archiveCollection], [newArrivals, archiveCollection]);
  
    return (
      <main className="min-h-screen bg-[#fafafa] text-black font-sans relative selection:bg-black selection:text-white">
        <CartDrawer />
        
        <div className="p-4 md:p-12">
            <header className="mb-20 flex justify-between items-baseline border-b border-black/10 pb-8">
              <div>
                <h1 className="text-6xl font-black tracking-tighter italic">THE_DIECAST_STORE</h1>
                <p className="text-gray-400 text-[10px] tracking-[0.4em] font-mono uppercase mt-3 ml-1">Curated_Diecast_Exhibition</p>
              </div>
              <nav className="hidden md:flex gap-12 text-[10px] font-bold tracking-widest uppercase items-center">
                
                {/* User Section */}
                {!isLoaded ? (
                  <div className="w-12 h-4 bg-black/5 animate-pulse" />
                ) : isSignedIn ? (
                  <div className="group relative py-2">
                    <Link href="/access" className="font-mono text-sm font-bold uppercase italic tracking-widest text-black border-b-2 border-black hover:text-[#FF1E1E] hover:border-[#FF1E1E] transition-all">
                      ACCESS
                    </Link>
                    {/* Hover Dropdown */}
                    <div className="absolute top-full left-0 w-48 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50">
                      <div className="bg-white border border-black shadow-2xl p-2 flex flex-col">
                        <Link href="/access" className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all">Dashboard</Link>
                        <Link href="/access/collection" className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all">My Collection</Link>
                        <Link href="/access/orders" className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all">Order History</Link>
                        <Link href="/access/settings" className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all">Settings</Link>
                        <div className="h-px bg-black/5 my-2" />
                        <SignOutButton>
                          <button className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors">Logout_Session</button>
                        </SignOutButton>
                      </div>
                    </div>
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <button className="font-mono text-sm font-bold uppercase tracking-widest text-black hover:text-[#FF1E1E] transition-colors">
                      LOGIN
                    </button>
                  </SignInButton>
                )}

                <SpeedLink href="/catalog">Catalog</SpeedLink>
                <SpeedLink href="/journal">Journal</SpeedLink>
                
                <button 
                  onClick={() => setIsCartOpen(true)} 
                  className="group relative flex items-center gap-2 px-6 py-2 rounded-sm checkered-hover overflow-hidden"
                >
                  <span className="relative z-10 font-bold mix-blend-difference text-white">VAULT</span>
                  <span className="relative z-10 bg-white/20 px-1.5 py-0.5 rounded text-[9px] text-white">
                    {cart.length}
                  </span>
                </button>

              </nav>
            </header>
      
            <section className="mb-32">
              <div className="flex items-center gap-6 mb-10">
                <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em]">Featured_Exhibits</h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-black/10 to-transparent" />
              </div>
              <BentoGrid
                  cars={featuredExhibits}
                  layout={featuredLayout}
                  setHoverState={setHoverState}
                  setCursorBlocked={setCursorBlocked}
              />
            </section>
      
            <section className="mb-20">
               <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
                 <div>
                    <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-2">The Collection</h2>
                    <h3 className="text-2xl font-bold tracking-tight">New Arrivals & Featured Collection</h3>
                 </div>
               </div>
      
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
                 <AnimatePresence mode="popLayout">
                   {fullCollection.map((car) => (
                     <StandardCard key={car.id} car={car} />
                   ))}
                 </AnimatePresence>
               </div>
            </section>

            <CustomCursor active={hoverState && !isCursorBlocked} />
        </div>

        <Footer />
        {/* Removed styles from here because they are now in globals.css */}
    </main>
  );
}