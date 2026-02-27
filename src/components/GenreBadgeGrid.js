"use client";
import { motion } from "framer-motion";
import { getGenreCompletion, GENRE_METADATA } from "./badgeLogic";
import { ShieldCheck, Lock } from "lucide-react";

/**
 * GenreBadgeGrid
 * Displays the user's unlocked series badges.
 * Unlocks when a genre is 100% complete.
 */
export default function GenreBadgeGrid({ userCollection, allProducts, isDark = true }) {
  const completionStats = getGenreCompletion(userCollection, allProducts);
  
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

          return (
            <motion.div
              key={stat.id}
              initial={isUnlocked ? { scale: 0.8, opacity: 0 } : {}}
              animate={isUnlocked ? { scale: 1, opacity: 1 } : {}}
              className={`relative p-4 border rounded-sm flex flex-col items-center justify-center gap-2 transition-all duration-500 ${
                isUnlocked 
                  ? (isDark ? "bg-zinc-900" : "bg-white")
                  : (isDark ? "bg-black/40 border-zinc-800 text-zinc-700 opacity-40" : "bg-zinc-50 border-zinc-100 text-zinc-300 opacity-50")
              }`}
              style={isUnlocked ? { 
                borderColor: genreColor, 
                color: genreColor,
                boxShadow: `0 0 20px ${genreColor}15`
              } : {}}
            >
              {isUnlocked ? (
                <ShieldCheck size={20} className="mb-1" />
              ) : (
                <div className="flex flex-col items-center gap-1">
                    <Lock size={16} className="mb-1" />
                    <span className="text-[7px] font-mono opacity-60">{stat.owned}/{stat.total}</span>
                </div>
              )}
              <span className="text-[9px] font-black uppercase tracking-widest leading-none text-center">
                {label}
              </span>
              {isUnlocked && (
                <div 
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse" 
                  style={{ backgroundColor: genreColor }}
                />
              )}
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