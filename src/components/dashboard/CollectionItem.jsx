'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Edit3, ExternalLink, X } from 'lucide-react';

export default function CollectionItem({ item, isDark }) {
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState(item.nickname || '');
  const [loading, setLoading] = useState(false);

  const accentColor = isDark ? 'text-yellow-500' : 'text-orange-600';
  const borderColor = isDark ? 'border-yellow-500' : 'border-orange-600';
  const bgAccent = isDark ? 'bg-yellow-500' : 'bg-orange-600';

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/collection/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ nickname }),
      });
      if (res.ok) setIsEditing(false); // If you're using setIsEditing elsewhere
      if (res.ok) setShowModal(false);
    } catch (error) {
      console.error("Failed to update nickname", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. THE GALLERY UNIT (Image + Data Strip) */}
      <motion.div 
        layout
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowModal(true)}
        className={`
          relative flex flex-col cursor-pointer group overflow-hidden border-2 transition-all
          ${isDark ? 'bg-zinc-900 border-white/10 hover:border-yellow-500/50 shadow-2xl' : 'bg-white border-black/5 hover:border-orange-600/50 shadow-sm'}
        `}
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden border-b border-current/5">
          <Image 
            src={item.image} 
            alt={item.name} 
            fill 
            className="object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-700" 
          />
          
          {/* Unit Serial Overlay */}
          <div className="absolute bottom-2 right-2 font-geist-mono text-[7px] opacity-20 group-hover:opacity-100 uppercase tracking-tighter">
            REF_0{item.id.slice(-2).toUpperCase()}
          </div>
          
          {/* Pulse Status (Now integrated with alias logic) */}
          {nickname && (
            <div className={`absolute top-2 left-2 h-1 w-1 rounded-full ${bgAccent} animate-pulse`} />
          )}
        </div>

        {/* DATA STRIP: Essential info at a glance */}
        <div className={`p-3 space-y-1 ${isDark ? 'bg-black/20' : 'bg-zinc-50/50'}`}>
          <div className="flex justify-between items-center">
            <span className="font-geist-mono text-[8px] opacity-40 uppercase tracking-[0.2em] truncate">
              {item.product?.brand || "PRECISION_MODEL"}
            </span>
            <span className="font-geist-mono text-[7px] opacity-30 italic">
              {item.product?.scale || '1:24'}
            </span>
          </div>
          
          <h4 className="font-black italic text-[10px] leading-tight uppercase truncate opacity-80 group-hover:opacity-100 transition-opacity">
            {item.name}
          </h4>

          {/* Inline Alias Space */}
          <div className={`font-geist-mono text-[9px] italic truncate h-3 mt-1 ${accentColor}`}>
            {nickname ? `"${nickname}"` : ''}
          </div>
        </div>
      </motion.div>

      {/* 2. THE SYSTEM MODAL (Design Preserved) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-md p-8 border-t-[6px] font-geist overflow-hidden ${isDark ? 'bg-[#0c0c0c] text-white border-yellow-500' : 'bg-zinc-50 text-black border-orange-600'}`}>
              
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                   style={{ backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <span className="block font-geist-mono text-[9px] opacity-40 uppercase tracking-[0.3em]">{item.product?.brand || 'ASSET_VALUATION'}</span>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{item.name}</h3>
                  </div>
                  <button onClick={() => setShowModal(false)} className="opacity-40 hover:opacity-100 transition-opacity"><X size={20} /></button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-3 bg-current/5 border border-current/5">
                        <p className="font-geist-mono text-[8px] opacity-40 uppercase mb-1">Scale_Reference</p>
                        <p className="font-black italic text-sm">{item.product?.scale || '1:24'}</p>
                    </div>
                    <div className="p-3 bg-current/5 border border-current/5">
                        <p className="font-geist-mono text-[8px] opacity-40 uppercase mb-1">Rarity_State</p>
                        <p className={`font-black italic text-sm ${item.product?.isRare ? accentColor : ''}`}>
                            {item.product?.isRare ? 'RARE_EDITION' : 'STANDARD'}
                        </p>
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                  <label className="flex items-center gap-2 font-geist-mono text-[10px] font-black uppercase tracking-widest opacity-40">
                    <Edit3 size={12} className={accentColor} /> Unit_Alias_Configuration
                  </label>
                  <div className="relative">
                    <input 
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="ENTER_NEW_ALIAS..."
                      className={`w-full bg-transparent border-b-2 p-3 font-black italic text-xl focus:outline-none transition-all ${isDark ? 'border-white/10 focus:border-yellow-500' : 'border-black/10 focus:border-orange-600'}`}
                    />
                    <div className={`absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 ${isDark ? 'border-white/10' : 'border-black/10'}`} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button onClick={handleSave} disabled={loading} className={`w-full py-4 font-black italic uppercase tracking-[0.2em] text-xs transition-all relative overflow-hidden group ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    <div className={`absolute left-0 top-0 h-full w-1 transition-all group-hover:w-full group-hover:opacity-10 ${bgAccent}`} />
                    <span className="relative z-10">{loading ? 'SYNCING...' : 'COMMIT_ALIAS_CHANGES'}</span>
                  </button>
                  <Link href={`/access/orders/${item.orderId}`} className={`w-full py-4 text-center text-[10px] font-black uppercase italic tracking-widest border transition-all ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}>
                    <div className="flex items-center justify-center gap-2">Inspect_Source_Manifest</div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}