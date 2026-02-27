'use client';

import { useState } from 'react';
import ProgressRing from './ProgressRing';
import { motion, AnimatePresence } from 'framer-motion';
import { GENRE_METADATA } from '../badgeLogic';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ProgressPanel = ({ categories, theme = 'dark' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!categories || categories.length === 0) {
    return (
      <div className={`p-8 border border-dashed text-center font-mono text-xs opacity-50 transition-colors ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
        [ NO_CATEGORY_DATA ]
      </div>
    );
  }

  // Sort categories: Completed/In-progress first
  const sortedCategories = [...categories].sort((a, b) => {
    const progressA = a.total > 0 ? a.owned / a.total : 0;
    const progressB = b.total > 0 ? b.owned / b.total : 0;
    return progressB - progressA;
  });

  const hasMore = sortedCategories.length > 3;
  const displayedCategories = isExpanded ? sortedCategories : sortedCategories.slice(0, 3);

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
            <AnimatePresence mode="popLayout">
                {displayedCategories.map((cat, index) => {
                    // FIX 1: Fallback ID to prevent 'undefined' collisions
                    // We use the index if cat.id is missing, ensuring uniqueness
                    const uniqueId = cat.id || `series_${index}`;
                    
                    return (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: isExpanded ? 0 : index * 0.1 }}
                            key={uniqueId} // Use uniqueId for React Key
                        >
                          <ProgressRing
                              // FIX 2: Pass the guaranteed unique ID
                              id={uniqueId}
                              
                              // Visual Props
                              label={GENRE_METADATA[cat.id]?.label || cat.id?.replace(/_/g, ' ') || 'Unknown Series'}
                              percentage={cat.total > 0 ? (cat.owned / cat.total) * 100 : 0}
                              theme={theme}
                              size={80}
                              strokeWidth={8}
                              color={GENRE_METADATA[cat.id]?.color}
                              
                              // FIX 3: Stagger the start time slightly (0ms, 200ms, 400ms)
                              // This prevents "Audio Fighting" if multiple unlock at once
                              delay={index * 0.2}
                          />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>

        {hasMore && (
          <motion.button
            layout
            onClick={() => setIsExpanded(!isExpanded)}
            className={`mt-6 w-full py-3 border border-dashed flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-all
              ${theme === 'dark' ? 'border-white/10 hover:bg-white/5 text-white/40 hover:text-white' : 'border-black/10 hover:bg-black/5 text-black/40 hover:text-black'}`}
          >
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {isExpanded ? 'Collapse_Archive' : `Expand_Full_Archive [ +${categories.length - 3} ]`}
          </motion.button>
        )}
    </div>
  );
};

export default ProgressPanel;