'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { GENRE_METADATA } from '../badgeLogic';

const ProgressRing = ({ percentage, label, size = 100, strokeWidth = 10, theme = 'dark', color, id }) => {
  const visualPercentage = Math.max(0, Math.min(percentage, 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (visualPercentage / 100) * circumference;

  const textColor = theme === 'dark' ? 'text-white' : 'text-black';
  const trackColor = theme === 'dark' ? 'stroke-white/10' : 'stroke-black/10';

  const isHex = color?.startsWith('#');
  const progressColor = !color ? 'stroke-orange-500' : (isHex ? '' : color);
  const strokeStyle = isHex ? { stroke: color } : {};

  const isComplete = visualPercentage === 100;
  const metadata = GENRE_METADATA[id];

  return (
    <div className="flex flex-col items-center justify-center group">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transition-transform duration-500 group-hover:scale-110">
        {/* Background Track */}
        <circle
          className={`transition-colors ${trackColor}`}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Fill */}
        <circle
          className={`transition-all duration-1000 ease-out -rotate-90 origin-center ${progressColor}`}
          style={strokeStyle}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.span 
              key="percent"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className={`text-xl font-black italic tracking-tighter ${textColor}`}
            >
              {visualPercentage}%
            </motion.span>
          ) : (
            <motion.div
              key="badge"
              initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: -5 }}
              className="px-2 py-0.5 text-[7px] font-black uppercase shadow-xl text-white text-center leading-tight"
              style={{ backgroundColor: color || '#FF8700' }}
            >
              {metadata?.rankName || 'COMPLETE'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
      <p className={`mt-4 text-[9px] font-black uppercase tracking-widest text-center ${textColor} opacity-40 group-hover:opacity-100 transition-opacity`}>
        {label}
      </p>
    </div>
  );
};

export default ProgressRing;
