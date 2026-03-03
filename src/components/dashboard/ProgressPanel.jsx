'use client';

import { useState } from 'react';
import ProgressRing from './ProgressRing';
import { motion, AnimatePresence } from 'framer-motion';
import { GENRE_METADATA } from '../badgeLogic';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ProgressPanel = ({ categories, theme = 'dark' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const sortedCategories = [...categories].sort((a, b) => {
    const progressA = a.total > 0 ? a.owned / a.total : 0;
    const progressB = b.total > 0 ? b.owned / b.total : 0;
    return progressB - progressA;
  });

  const hasMore = sortedCategories.length > 3;
  const displayedCategories = isExpanded ? sortedCategories : sortedCategories.slice(0, 3);
  
  // Mobile carousel logic
  const mobileBadges = sortedCategories.slice(0, 6); // Max 6 badges for mobile carousel
  const mobileCarouselPages = [];
  for (let i = 0; i < mobileBadges.length; i += 2) {
      mobileCarouselPages.push(mobileBadges.slice(i, i + 2));
  }

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      setCarouselIndex(prev => Math.max(prev - 1, 0));
    } else if (offset < -100 || velocity < -500) {
      setCarouselIndex(prev => Math.min(prev + 1, mobileCarouselPages.length - 1));
    }
  };

  return (
    <div className="relative p-2 transition-colors isolate">
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">Series_Completion</h3>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-mono text-[8px] opacity-30 uppercase tracking-tighter">Live_Telemetry</span>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="relative w-full overflow-hidden">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              animate={{ x: `-${carouselIndex * 100}%` }}
              transition={{ type: "tween" }}
              className="flex"
            >
              {mobileCarouselPages.map((page, pageIndex) => (
                <div className="flex-shrink-0 w-full grid grid-cols-2 gap-x-4" key={pageIndex}>
                  {page.map((cat, index) => {
                    const uniqueId = cat.id || `series_mobile_${pageIndex}_${index}`;
                    return (
                       <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.1 }}
                            key={uniqueId}
                        >
                          <ProgressRing
                              id={uniqueId}
                              label={GENRE_METADATA[cat.id]?.label || cat.id?.replace(/_/g, ' ') || 'Unknown Series'}
                              percentage={cat.total > 0 ? (cat.owned / cat.total) * 100 : 0}
                              theme={theme}
                              size={80}
                              strokeWidth={8}
                              color={GENRE_METADATA[cat.id]?.color}
                              delay={index * 0.2}
                          />
                        </motion.div>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          </div>
          {mobileCarouselPages.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {mobileCarouselPages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    carouselIndex === index ? 'bg-white' : 'bg-white/20 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-y-4 gap-x-4 py-2">
            <AnimatePresence mode="popLayout">
                {displayedCategories.map((cat, index) => {
                    const uniqueId = cat.id || `series_desktop_${index}`;
                    return (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: isExpanded ? 0 : index * 0.1 }}
                            key={uniqueId}
                        >
                          <ProgressRing
                              id={uniqueId}
                              label={GENRE_METADATA[cat.id]?.label || cat.id?.replace(/_/g, ' ') || 'Unknown Series'}
                              percentage={cat.total > 0 ? (cat.owned / cat.total) * 100 : 0}
                              theme={theme}
                              size={80}
                              strokeWidth={8}
                              color={GENRE_METADATA[cat.id]?.color}
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
            className={`mt-6 w-full py-3 border border-dashed hidden md:flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-all
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