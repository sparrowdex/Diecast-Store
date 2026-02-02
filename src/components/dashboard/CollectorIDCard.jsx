'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const CollectorIDCard = ({ profile }) => {
  const isDark = profile.theme === 'dark';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl border-2 p-8 transition-all duration-500 isolate h-full ${
        isDark ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-white/20 text-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]' : 'bg-white border-black text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
      }`}
    >
      {/* F1-inspired background pattern */}
      <div className="absolute right-0 top-0 h-full w-48 opacity-[0.1] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Tilted Physical Stamp - Moved to overlap the grid pattern for a more authentic look */}
      <div className="absolute top-24 right-10 transform -rotate-12 z-20 pointer-events-none transform-gpu will-change-transform">
        <div className="px-6 py-2.5 bg-yellow-500 text-black text-sm font-black border-2 border-black uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {profile.stamp || "VERIFIED"}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
        {/* Avatar Placeholder */}
        <div className={`relative h-24 w-24 rounded-full border-4 flex items-center justify-center overflow-hidden shrink-0 ${
          isDark ? 'border-white/20 bg-zinc-800' : 'border-black bg-gray-100'
        }`}>
           {profile.imageUrl ? (
             <Image 
               src={profile.imageUrl} 
               alt={profile.collectorName} 
               width={96}
               height={96}
               className="h-full w-full object-cover"
             />
           ) : (
             <span className="text-4xl font-black italic tracking-tighter">
               {profile.collectorName?.charAt(0) || 'C'}
             </span>
           )}
        </div>

        <div className="flex-1">
          <div className="mb-2">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
              {profile.collectorName}
            </h3>
            <p className="text-[10px] font-mono opacity-40 uppercase tracking-tighter">
              {profile.collectorName?.toLowerCase().replace(/\s+/g, '_')}.auth_id
            </p>
            <p className="text-[10px] opacity-50 font-mono uppercase tracking-widest mt-1">
              // ID_HOLDER_VERIFIED
            </p>
          </div>
          
          {/* System Metadata Block */}
          <div className="grid grid-cols-2 gap-6 mb-6 max-w-xs border-y border-current/5 py-4">
            <div className="space-y-1">
              <span className="block text-[8px] font-bold opacity-30 uppercase tracking-[0.2em]">Member_Since</span>
              <span className="block font-mono text-xs opacity-80 italic">{profile.memberSince}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-[8px] font-bold opacity-30 uppercase tracking-[0.2em]">Last_Activity</span>
              <span className="block font-mono text-xs opacity-80 italic">{profile.lastSync}</span>
            </div>
          </div>

          <div className="flex gap-6 font-mono text-[10px] opacity-40">
            <div>
              <span className="block font-bold uppercase">Rank</span>
              ELITE_COLLECTOR
            </div>
            <div>
              <span className="block font-bold uppercase">Status</span>
              AUTHORIZED
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectorIDCard;