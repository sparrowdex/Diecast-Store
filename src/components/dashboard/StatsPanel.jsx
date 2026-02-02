'use client';

import React from 'react';
import { motion } from 'framer-motion';

const StatsPanel = ({ stats, theme }) => {
  const isDark = theme === 'dark';
  
  const items = [
    { label: 'Total Models', value: stats.totalModels, color: isDark ? 'text-white' : 'text-black' },
    { label: 'Rare Editions', value: stats.rareEditions, color: 'text-orange-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 border flex flex-col justify-center items-center rounded-lg ${
            isDark ? 'border-white/20 bg-zinc-900' : 'border-black bg-white'
          }`}
        >
          <span className={`text-4xl font-mono font-black italic tracking-tighter ${item.color} ${isDark ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''}`}>
            {item.value.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] font-black uppercase tracking-tighter opacity-50 mt-1 text-center leading-none">
            {item.label.replace(' ', '_')}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsPanel;