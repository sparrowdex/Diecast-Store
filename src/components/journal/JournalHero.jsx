'use client';
import { Gauge, Calendar, User, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JournalHero({ entry }) {
  return (
    <section className="relative w-full h-[85vh] flex flex-col justify-end overflow-hidden font-geist">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <img src={entry.images[0]} className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
        {/* Telemetry Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-20 w-full">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 mb-6">
           <span className="bg-[#FF8700] text-black px-4 py-1 text-[10px] font-black uppercase italic tracking-[0.3em]">FEATURED_EXHIBIT</span>
           <div className="h-[1px] w-20 bg-white/20" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-12 max-w-5xl">
          {entry.title}
        </motion.h1>

        <div className="flex flex-wrap gap-12 border-t border-white/10 pt-10 font-geist-mono">
          <div className="space-y-1">
            <p className="text-[9px] text-white/40 uppercase flex items-center gap-2"><User size={10}/> Author</p>
            <p className="text-sm font-bold uppercase italic">{entry.author || "ANONYMOUS"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] text-white/40 uppercase flex items-center gap-2"><Calendar size={10}/> Timestamp</p>
            <p className="text-sm font-bold uppercase italic">{new Date(entry.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] text-white/40 uppercase flex items-center gap-2"><Gauge size={10}/> Lap_Time</p>
            <p className="text-sm font-bold uppercase italic">{entry.readTime || '05'}_MINS</p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
        <ChevronDown size={24} />
      </div>
    </section>
  );
}