'use client';

import ProgressRing from './ProgressRing';
import { motion } from 'framer-motion';

const ProgressPanel = ({ categories, theme = 'dark' }) => {
  const getGenreColor = (name) => {
    const n = name.toLowerCase();
    if (n.includes('f1')) return 'stroke-red-600 dark:stroke-red-500';
    if (n.includes('gt')) return 'stroke-blue-600 dark:stroke-blue-500';
    if (n.includes('classic')) return 'stroke-amber-600 dark:stroke-amber-500';
    if (n.includes('hyper')) return 'stroke-purple-600 dark:stroke-purple-500';
    if (n.includes('off')) return 'stroke-emerald-600 dark:stroke-emerald-500';
    return 'stroke-orange-600 dark:stroke-orange-500';
  };

  if (!categories || categories.length === 0) {
    return (
      <div className={`p-8 border border-dashed text-center font-mono text-xs opacity-50 transition-colors ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
        [ NO_CATEGORY_DATA ]
      </div>
    );
  }

  return (
    <div className="relative p-2 transition-colors isolate">
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">Series_Completion</h3>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-mono text-[8px] opacity-30 uppercase tracking-tighter">Live_Telemetry</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4 py-2">
            {categories.map((cat, index) => (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={cat.name}
                >
                  <ProgressRing
                      label={cat.name.replace(/_/g, ' ')}
                      percentage={cat.percentage}
                      theme={theme}
                      size={80}
                      strokeWidth={8}
                      color={getGenreColor(cat.name)}
                  />
                </motion.div>
            ))}
        </div>
    </div>
  );
};

export default ProgressPanel;
