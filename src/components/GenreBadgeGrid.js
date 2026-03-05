"use client";
import { motion } from "framer-motion";
import { getGenreCompletion, GENRE_METADATA } from "./badgeLogic";
import { Lock, ImageOff } from "lucide-react";
import { useState } from "react";
import Tilt from "react-parallax-tilt";
import Image from "next/image";

/**
 * Internal component to handle image loading errors gracefully.
 */
function StampImage({ src, alt, color }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center opacity-20" style={{ color }}>
        <ImageOff size={24} />
      </div>
    );
  }

  return (
    <Image 
      src={src} 
      alt={alt} 
      fill 
      className="object-contain drop-shadow-md"
      sizes="(max-width: 768px) 100vw, 33vw"
      onError={() => setHasError(true)}
    />
  );
}

/**
 * GenreBadgeGrid
 * Displays the user's unlocked series badges.
 * Unlocks when a genre is 100% complete.
 */
export default function GenreBadgeGrid({ userCollection, allProducts, isDark = true }) {
  const completionStats = getGenreCompletion(userCollection || [], allProducts || []);
  
  return (
    <div className="mt-8">
      <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
        Series_Verification_Stamps
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {completionStats.map((stat) => {
          const isUnlocked = stat.isComplete;
          const metadata = GENRE_METADATA[stat.id];
          const label = isUnlocked ? (metadata?.rankName || metadata?.label) : (metadata?.label || stat.id);
          const genreColor = metadata?.color || (isDark ? "#eab308" : "#ea580c");

          // Robust filename generation: Use rankName if available, otherwise fallback to the genre ID (stat.id)
          // This prevents broken paths like "/images/stamps/.png" when metadata is incomplete.
          const fileNameSource = metadata?.rankName || stat.id;
          const imageFilename = fileNameSource ? `${fileNameSource.toLowerCase().replace(/_/g, '-')}.png` : 'default.png';
          const imagePath = `/images/stamps/${imageFilename}`;

          // --- UNLOCKED STATE (3D Parallax Stamp) ---
          if (isUnlocked) {
            return (
              <Tilt
                key={stat.id}
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                perspective={1000}
                scale={1.02}
                transitionSpeed={2000}
                gyroscope={true} // Enables tilt via mobile device movement
                className="w-full h-full"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative w-full h-28 sm:h-32 flex flex-col items-center justify-between transition-all duration-500 bg-transparent"
                >
                  {/* Image Container now spans the full width of the container */}
                  <div className="relative w-full h-24 sm:h-28">
                    <StampImage src={imagePath} alt={label} color={genreColor} />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest leading-none text-center" style={{ color: genreColor }}>
                    {label}
                  </span>
                  <div 
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse" 
                    style={{ backgroundColor: genreColor }}
                  />
                </motion.div>
              </Tilt>
            );
          }

          // --- LOCKED STATE (Original Design) ---
          return (
            <motion.div
              key={stat.id}
              className={`relative w-full h-28 sm:h-32 p-4 border rounded-sm flex flex-col items-center justify-center gap-2 transition-all duration-500 ${
                isDark ? "bg-black/40 border-zinc-800 text-zinc-700 opacity-40" : "bg-zinc-50 border-zinc-100 text-zinc-300 opacity-50"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                  <Lock size={16} className="mb-1" />
                  <span className="text-[7px] font-mono opacity-60">{stat.owned}/{stat.total}</span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest leading-none text-center">
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>
      <p className="text-[8px] font-mono text-zinc-500 mt-4 uppercase tracking-tighter italic">
        * Complete a series in the catalog to unlock its respective verification stamp.
      </p>
    </div>
  );
}