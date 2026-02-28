'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const StatsPanel = ({ stats, theme }) => {
  const isDark = theme === 'dark';
  
  const items = [
    { label: 'Models Owned', value: stats.modelsOwned, color: isDark ? 'text-white' : 'text-black', href: '/access/collection' },
    { label: 'System Idle', value: null, color: 'text-zinc-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {items.map((item, index) => (
        <Link 
          key={item.label} 
          href={item.href || '#'} 
          className={!item.href ? 'pointer-events-none' : 'group'}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 border-2 flex flex-col justify-center items-center rounded-xl transition-all h-full relative overflow-hidden isolate ${
              isDark 
                ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-white/20 text-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] group-hover:border-yellow-500/50' 
                : 'bg-white border-black text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:border-orange-600'
            }`}
          >
            {item.value !== null ? (
              <>
                <span className={`text-4xl font-mono font-black italic tracking-tighter transition-transform group-hover:scale-110 ${item.color} ${isDark ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''}`}>
                  {(item.value ?? 0).toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-50 mt-1 text-center leading-none group-hover:opacity-100 transition-opacity">
                  {item.label.replace(' ', '_')}
                </span>
                {item.href && (
                  <span className="text-[7px] font-geist-mono opacity-0 group-hover:opacity-30 uppercase mt-2 transition-opacity">
                    [ View_Collection ]
                  </span>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full opacity-40">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                    y: [0, -10, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute w-20 h-20 rounded-full blur-3xl -z-10 ${isDark ? 'bg-yellow-500/20' : 'bg-orange-500/20'}`}
                />
                <span className="font-geist-mono text-[8px] tracking-[0.3em] animate-pulse">
                  // SYSTEM_IDLE
                </span>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3].map(i => (
                    <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="w-1 h-1 bg-current rounded-full" />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default StatsPanel;