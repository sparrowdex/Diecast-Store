"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const displayId = searchParams.get("payment_id") || searchParams.get("orderId") || "TXN_UNKNOWN";
  
  const [isScanning, setIsScanning] = useState(true);
  const blueprintRef = useRef(null); // Reference to the area we want to download

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 2000);

    const frame = () => {
      const duration = 2 * 1000;
      const end = Date.now() + duration;
      
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FF1E1E", "#000000", "#ffffff"],
        shapes: ['square'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FF1E1E", "#000000", "#ffffff"],
        shapes: ['square'],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    if (!isScanning) frame();
    return () => clearTimeout(timer);
  }, [isScanning]);

  // --- DOWNLOAD LOGIC ---
  const downloadManifesto = async () => {
    if (blueprintRef.current === null) return;
    
    try {
      const dataUrl = await toPng(blueprintRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `THE_DIECAST_STORE_MANIFESTO_${displayId.substring(0, 8)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Capture failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-sans selection:bg-black selection:text-white overflow-hidden relative">
      {/* Background Tech Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-3xl w-full relative z-10">
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div 
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-64 h-1 bg-black/10 relative overflow-hidden mb-4">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="absolute inset-0 bg-[#FF1E1E]"
                />
              </div>
              <p className="font-mono text-[10px] tracking-[0.5em] uppercase animate-pulse text-gray-400">Verifying_Vault_Access...</p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-block mb-6 border-4 border-black p-2"
                >
                   <div className="bg-black text-white p-4">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                   </div>
                </motion.div>
                
                <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none text-black">
                  EXHIBIT<span className="text-[#FF1E1E]">_</span>ACQUIRED
                </h1>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.6em] mt-6">
                  Vault_Log // Transaction_Successful
                </p>
              </div>

              {/* Blueprint Section (Captured for Download) */}
              <div ref={blueprintRef} className="bg-white border border-black/10 shadow-sm mb-12 overflow-hidden">
                <div className="bg-black p-4 flex justify-between items-center">
                  <span className="text-[8px] font-mono text-white/50 uppercase tracking-[0.3em]">Technical_Manifesto_v1.0</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white/20" />
                    <div className="w-1 h-1 bg-white/20" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5">
                  <div className="bg-white p-8">
                    <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-3 italic">Reference_ID</p>
                    <p className="text-lg font-mono font-bold text-black truncate">{displayId}</p>
                  </div>
                  <div className="bg-white p-8 border-l border-black/10">
                    <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-3 italic">Vault_Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-lg font-black italic uppercase text-black">SECURED</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 border-t border-black/5 bg-gray-50/50">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-2 italic">Curator_Note</p>
                  <p className="text-[11px] leading-relaxed text-gray-600 font-medium">
                    This exhibit has been officially processed and allocated to your private vault. 
                    The engineering specifications and provenance of this model have been verified 
                    against the Curated_Diecast_Exhibition standards.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center gap-6">
                <Link 
                  href="/" 
                  className="group relative inline-block bg-black text-white px-16 py-6 font-black text-xs uppercase tracking-[0.4em] overflow-hidden"
                >
                  <span className="relative z-10">Return_to_Gallery</span>
                  <div className="absolute inset-0 bg-[#FF1E1E] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>

                <button 
                  onClick={downloadManifesto}
                  className="flex items-center gap-3 font-mono text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download_Technical_Manifesto.png
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}