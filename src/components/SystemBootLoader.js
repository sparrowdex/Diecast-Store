"use client";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

/**
 * SystemBootLoader
 * Simulates a technical boot sequence for the Profile Configuration.
 * Supports both Light and Dark modes.
 */
export default function SystemBootLoader({ isDark = true }) {
  const lines = [
    "INITIALIZING_CORE_SYSTEMS",
    "MOUNTING_VAULT_DRIVES",
    "ESTABLISHING_TELEMETRY_LINK",
    "LOADING_COLLECTOR_IDENTITY",
    "AUTHENTICATING_EXHIBITS",
    "SYSTEM_READY"
  ];

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 font-mono transition-colors duration-500 ${
      isDark ? "bg-[#050505] text-white" : "bg-zinc-100 text-black"
    }`}>
      <div className="w-full max-w-xs space-y-4">
        <div className="flex items-center gap-2 mb-2 opacity-40">
           <Terminal size={14} />
           <span className="text-[10px] uppercase tracking-[0.3em]">System_Boot</span>
        </div>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.4 }}
            className="flex items-center gap-3"
          >
            <div className={`h-1 w-1 rounded-full animate-pulse ${isDark ? 'bg-yellow-500' : 'bg-orange-600'}`} />
            <span className="text-[10px] tracking-widest uppercase opacity-60 italic">{line}...</span>
          </motion.div>
        ))}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2.4, ease: "easeInOut" }}
          className={`h-[2px] w-full origin-left mt-4 ${isDark ? 'bg-yellow-500' : 'bg-orange-600'}`} 
        />
      </div>
    </div>
  );
}