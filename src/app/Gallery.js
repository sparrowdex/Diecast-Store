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
      <span className="relative z-10 block font-mono text-[10px] sm:text-sm font-bold uppercase tracking-widest text-black transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-[110%]">
        {children}
      </span>

      {/* LAYER 2: The "Fast" Car (Red Text) */}
      <span className="absolute inset-0 z-0 block -translate-x-[110%] font-mono text-[10px] sm:text-sm font-bold uppercase italic tracking-widest text-[#FF1E1E] transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-x-0 group-hover:-skew-x-12">
        {children}
      </span>

      {/* LAYER 3: The Racing Kerb (CSS class in globals.css) */}
      <span className="absolute bottom-0 left-0 h-0.75 w-full translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 kerb-animation" />
    </Link>
  );
};

// --- Reusable Filter Components ---
const FilterButton = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`px-4 py-1.5 text-[10px] font-mono rounded-full border transition-all uppercase tracking-widest ${active ? 'bg-black text-white border-black' : 'bg-transparent text-gray-400 border-gray-200 hover:border-black'}`}>
        {label}
    </button>
);

const Select = ({ value, onChange, options, placeholder }) => (
    <div className="relative">
        <select
            value={value}
            onChange={onChange}
            className="appearance-none bg-transparent text-gray-400 border-gray-200 hover:border-black border rounded-full px-4 py-1.5 text-[10px] font-mono transition-all uppercase tracking-widest pr-8"
        >
            <option value="All">{placeholder}</option>
            {options.map(option => <option key={option} value={option}>{option.replace(/_/g, ' ')}</option>)}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
    </div>
);


// --- MAIN PAGE COMPONENT ---
export default function Gallery({ featuredExhibits, newArrivals, featuredLayout = 'hero' }) {
    const [focusedExhibit, setFocusedExhibit] = useState(null);
    const [isCursorBlocked, setCursorBlocked] = useState(false);
    const [hoverState, setHoverState] = useState(false);
    const { isSignedIn, isLoaded } = useUser();
    const { cart, setIsCartOpen } = useCart();

    // Filtering State
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [selectedScale, setSelectedScale] = useState("All");

    const filteredCollection = useMemo(() => {
        return newArrivals.filter(car => {
            const genreMatch = selectedGenre === "All" || car.genre === selectedGenre;
            const scaleMatch = selectedScale === "All" || car.scale === selectedScale;
            return genreMatch && scaleMatch;
        });
    }, [newArrivals, selectedGenre, selectedScale]);

    return (
      <main className="min-h-screen bg-[#fafafa] text-black font-sans relative selection:bg-black selection:text-white">
        <CartDrawer />
        
        <div className="p-4 md:p-12">
            <header className="mb-12 md:mb-20 flex flex-col md:flex-row justify-between items-center md:items-baseline border-b border-black/10 pb-8 gap-8 md:gap-0">
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-5xl md:text-6xl font-black tracking-tighter italic">THE_DIECAST_STORE</h1>
                <p className="text-gray-400 text-[10px] tracking-[0.4em] font-mono uppercase mt-3 ml-1">Curated_Diecast_Exhibition</p>
              </div>
              <nav className="flex w-full md:w-auto items-center justify-between md:justify-end gap-1 sm:gap-6 md:gap-8 lg:gap-12 text-[10px] font-bold tracking-widest uppercase">
                
                {/* User Section */}
                {!isLoaded ? (
                  <div className="w-12 h-4 bg-black/5 animate-pulse" />
                ) : isSignedIn ? (
                  <div className="group relative py-2">
                    <Link href="/access" className="font-mono text-[10px] sm:text-sm font-bold uppercase italic tracking-widest text-black border-b-2 border-black hover:text-[#FF1E1E] hover:border-[#FF1E1E] transition-all">
                      ACCESS
                    </Link>
                    {/* Hover Dropdown */}
                    <div className="absolute top-full left-0 w-48 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50">
                      <div className="bg-white border border-black shadow-2xl p-2 flex flex-col">
                        <Link href="/access" className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all">Dashboard</Link>
                        <Link href="/access/profile" className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all">Profile</Link>
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
                    <button className="font-mono text-[10px] sm:text-sm font-bold uppercase tracking-widest text-black hover:text-[#FF1E1E] transition-colors">
                      LOGIN
                    </button>
                  </SignInButton>
                )}

                <SpeedLink href="/catalog">Catalog</SpeedLink>
                <SpeedLink href="/journal">Journal</SpeedLink>
                
                <button 
                  onClick={() => setIsCartOpen(true)} 
                  className="group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 rounded-sm checkered-hover overflow-hidden"
                >
                  <span className="relative z-10 font-bold mix-blend-difference text-white">VAULT</span>
                  <span className="relative z-10 bg-white/20 px-1.5 py-0.5 rounded text-[9px] text-white">
                    {cart.length}
                  </span>
                </button>

              </nav>
            </header>
      
            {/* SIGNATURE GALLERY SECTION */}
            <section className="mb-20 relative">
              {/* Blueprint Grid Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, size: '40px 40px' }} />
              
              <div className="relative z-10 flex items-center gap-6 mb-10">
                <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em]">Signature_Gallery</h2>
                <div className="h-px flex-1 bg-linear-to-r from-black/10 to-transparent" />
              </div>

              <BentoGrid
                  cars={featuredExhibits}
                  layout="signature" // New fixed layout
                  setHoverState={setHoverState}
                  setCursorBlocked={setCursorBlocked}
                  onExhibitClick={(car) => setFocusedExhibit(car)}
              />
            </section>

            {/* TECHNICAL STRIP (Marquee) */}
            <div className="w-full overflow-hidden bg-black text-white py-3 mb-32 rotate-[-2deg] scale-105 shadow-2xl relative z-10 flex">
                <motion.div 
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{ duration: 300, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap font-mono text-[10px] tracking-widest uppercase"
                >
                    {[...Array(20)].map((_, i) => (
                        <span key={i} className="mx-8">
                            System_Status: <span className="text-green-500">Optimal</span> // 
                            Telemetry_Active // 
                            Vault_Secured // 
                            Precision_Engineered_Models
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* FOCUS MODE OVERLAY */}
            <AnimatePresence>
                {focusedExhibit && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setFocusedExhibit(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            layoutId={`card-${focusedExhibit.id}`}
                            className="relative w-full max-w-5xl aspect-video bg-[#111] border border-white/10 rounded-lg overflow-hidden shadow-2xl flex flex-col md:flex-row"
                        >
                            <div className="w-full md:w-2/3 h-full bg-black">
                                {focusedExhibit.video ? (
                                    <video src={focusedExhibit.video} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                ) : (
                                    <img src={focusedExhibit.images?.[0]} className="w-full h-full object-contain" />
                                )}
                            </div>
                            <div className="w-full md:w-1/3 p-8 text-white font-mono flex flex-col justify-between relative overflow-hidden bg-linear-to-br from-[#111] via-[#111] to-black/50">
                                {/* Petroleum Gloss Bubble Animation */}
                                <motion.div
                                    initial={{ x: "-100%", y: "-100%", opacity: 0 }}
                                    animate={{
                                        x: ["-20%", "40%", "10%", "30%"],
                                        y: ["-10%", "20%", "50%", "10%"],
                                        opacity: [0, 0.8, 0.5, 0],
                                        scale: [1, 2.5, 1.8, 3.5],
                                        borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 20% 80% / 25% 80% 20% 75%", "80% 20% 50% 50% / 30% 50% 50% 70%", "30% 70% 70% 30% / 30% 30% 70% 70%"]
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                                    className="absolute inset-0 w-full h-full bg-radial from-teal-300/40 via-transparent to-transparent pointer-events-none blur-2xl"
                                />

                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">{focusedExhibit.name}</h2>
                                    <div className="space-y-2 text-[10px] text-gray-400 uppercase">
                                        <p>Manufacturer: <span className="text-white">{focusedExhibit.brand}</span></p>
                                        <p>Material: <span className="text-white">{focusedExhibit.material}</span></p>
                                        <p>Scale: <span className="text-white">{focusedExhibit.scale}</span></p>
                                    </div>
                                </div>
                                <button onClick={() => setFocusedExhibit(null)} className="relative z-10 mt-8 border border-white/20 py-2 hover:bg-white hover:text-black transition-all uppercase text-xs font-bold">Close_View</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
      
            <section className="mb-20">
               <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
                 <div>
                    <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-2">The Collection</h2>
                    <h3 className="text-2xl font-bold tracking-tight">New Arrivals</h3>
                 </div>
                 <div className="flex flex-wrap gap-3 items-center">
                    <Select 
                        value={selectedScale} 
                        onChange={(e) => setSelectedScale(e.target.value)} 
                        options={['1:64', '1:32', '1:24', '1:18']} 
                        placeholder="All Scales"
                    />
                    <Select 
                        value={selectedGenre} 
                        onChange={(e) => setSelectedGenre(e.target.value)} 
                        options={['CLASSIC_VINTAGE', 'RACE_COURSE', 'CITY_LIFE', 'SUPERPOWERS', 'LUXURY_REDEFINED', 'OFF_ROAD', 'FUTURE_PROOF']} 
                        placeholder="All Genres"
                    />
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
        </div>

        <Footer />
        {/* Removed styles from here because they are now in globals.css */}
    </main>
  );
}