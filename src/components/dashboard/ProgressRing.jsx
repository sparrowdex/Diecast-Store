'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { GENRE_METADATA } from '../badgeLogic';

// NEW SYNC: Since we skip the 'Hiss', the impact is almost instant
const IMPACT_DELAY = 0.1; 

const ProgressRing = ({ percentage, label, size = 100, strokeWidth = 4, theme = 'dark', color, id }) => {
  const visualPercentage = Math.max(0, Math.min(percentage, 100));
  const isComplete = visualPercentage === 100;
  const metadata = GENRE_METADATA[id];
  
  const [status, setStatus] = useState('loading'); 
  const [replayKey, setReplayKey] = useState(0);   
  const audioRef = useRef(null);

  // --- 1. INITIAL LOAD ---
  useEffect(() => {
    if (isComplete) {
      const hasSeen = localStorage.getItem(`badge_seen_${id}`);
      if (hasSeen) {
        setStatus('settled');
      } else {
        setStatus('animating');
        // Full unlock still plays from start (0s) for the drama
        triggerAudio('full');
      }
    }
  }, [isComplete, id]);

  // --- 2. AUDIO TRIGGER ---
  const triggerAudio = (type) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (type === 'replay') {
        // --- REPLAY LOGIC (Snappy) ---
        // Start from Second 1 (Skip the Hiss)
        audio.currentTime = 1.0; 
        audio.volume = 1.0;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.warn("Audio blocked:", e));
        }

        // Play for 2 seconds (1.0s -> 3.0s) then cut
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 2000); 

      } else {
        // --- FULL UNLOCK (Dramatic) ---
        // Play from 0s to get the full buildup
        audio.currentTime = 0;
        audio.volume = 1.0;
        audio.play();
        localStorage.setItem(`badge_seen_${id}`, 'true');
        setTimeout(() => setStatus('settled'), 4000); 
      }
    } catch (e) {
      console.warn("Audio Error");
    }
  };

  // --- 3. CLICK HANDLER ---
  const handleReplay = () => {
    if (status === 'animating') return; 

    // 1. Play Audio (Starts at 1.0s)
    triggerAudio('replay');

    // 2. Trigger Visuals
    setStatus('animating');
    setReplayKey(prev => prev + 1);

    // 3. Reset after animation
    setTimeout(() => setStatus('settled'), 2000);
  };

  // Styles
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (visualPercentage / 100) * circumference;
  const trackColor = theme === 'dark' ? 'stroke-white/5' : 'stroke-black/5';
  const baseColor = color || '#FF4500';

  return (
    <div className="flex flex-col items-center justify-center group font-sans">
      <audio ref={audioRef} src="/sounds/hydraulic.mp3" preload="auto" />

      <div className="relative isolate">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transition-transform duration-500 group-hover:scale-105">
          <circle className={`transition-colors ${trackColor}`} strokeWidth={2} fill="transparent" r={radius} cx={size/2} cy={size/2} />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="-rotate-90 origin-center"
            stroke={baseColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            fill="transparent"
            r={radius} cx={size/2} cy={size/2}
            style={{ filter: `drop-shadow(0 0 2px ${baseColor})` }}
          />
        </svg>

        {/* CLICK ZONE */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
          onClick={() => isComplete && handleReplay()}
        >
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.span 
                key="percent"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-xl font-black italic tracking-tighter text-white"
              >
                {visualPercentage}%
              </motion.span>
            ) : (
              <motion.div
                key={`${id}-${replayKey}`}
                
                // 1. LOOMING STATE
                initial={status === 'settled' ? {
                  scale: 1, opacity: 1, rotate: -5, filter: "blur(0px)"
                } : {
                  // Replay starts huge but snaps down fast
                  scale: 2.5, 
                  opacity: 0, 
                  rotate: -15, 
                  filter: "blur(5px) brightness(1.5)"
                }}

                // 2. IMPACT STATE
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotate: -5, 
                  filter: "blur(0px) brightness(1)",
                }}

                // 3. HEAVY METAL PHYSICS
                transition={status === 'settled' ? { duration: 0 } : {
                  // Wait 0.1s (Tiny sync delay)
                  delay: IMPACT_DELAY, 
                  type: "spring", 
                  stiffness: 800, // Very snappy
                  damping: 60,    // No bounce
                  mass: 3         // Heavy feel
                }}

                className="absolute flex items-center justify-center px-3 py-1 border border-white/40 shadow-xl z-30"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${baseColor} 0%, #ffffff 50%, ${baseColor} 100%)`,
                  boxShadow: `0px 4px 15px ${baseColor}, inset 0 0 10px rgba(255,255,255,0.5)`,
                  backgroundSize: '200% 200%', 
                }}
              >
                <span 
                  className="text-[10px] font-black italic uppercase tracking-tighter leading-none whitespace-nowrap drop-shadow-sm"
                  style={{ 
                    color: '#000000', 
                    textShadow: '0px 1px 0px rgba(255,255,255,0.5)'
                  }}
                >
                  {metadata?.rankName?.replace(/_/g, ' ') || 'SERIES COMPLETE'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <p className="mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-center text-white opacity-40 group-hover:opacity-100 transition-opacity">
        {label}
      </p>
    </div>
  );
};

export default ProgressRing;