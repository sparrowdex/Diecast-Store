'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Check, Package, Truck, Ship, MapPin, ChevronRight, Copy, ChevronDown } from 'lucide-react';

/**
 * Logistics mapping for The Diecast Store
 */
const getStatusDetails = (status) => {
  const statusMap = {
    'PENDING': 0, 'PAID': 0, 'NEW': 0, 'PROCESSING': 0,
    'READY_TO_SHIP': 1, 'PICKUP_SCHEDULED': 1, 'SHIPPED': 1,
    'IN_TRANSIT': 2, 'OUT_FOR_DELIVERY': 2, 'DELIVERED': 3
  };

  const allStatuses = [
    { id: 'PENDING', name: 'CONFIRMED', icon: Package, date: 'JAN 28, 2026', description: 'Order confirmed, awaiting warehouse processing.' },
    { id: 'SHIPPED', name: 'SHIPPED', icon: Ship, date: 'JAN 29, 2026', description: 'Your package has left our facility.' },
    { id: 'IN_TRANSIT', name: 'IN TRANSIT', icon: Truck, date: 'JAN 30, 2026', description: 'Moving through the carrier network.' },
    { id: 'DELIVERED', name: 'DELIVERED', icon: MapPin, date: 'FEB 01, 2026', description: 'Your exhibit has arrived.' }
  ];

  const currentIndex = statusMap[status] ?? 0;
  return allStatuses.map((s, index) => ({
    ...s,
    isCompleted: index <= currentIndex,
    isCurrent: index === currentIndex,
  }));
};

const DeliveryTracker = ({ status, trackingNumber, isDark }) => {
  const [copied, setCopied] = useState(false);
  const [isCarrierExpanded, setIsCarrierExpanded] = useState(false);

  // --- PARALLAX ENGINE ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [6, -6]); 
  const rotateY = useTransform(mouseX, [-100, 100], [-6, 6]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0); mouseY.set(0);
  };

  const handleCopy = () => {
    if (!trackingNumber || trackingNumber === 'UNASSIGNED_ID') return;
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeline = getStatusDetails(status);
  const currentStatusIndex = timeline.findIndex(item => item.isCurrent);
  const totalProgress = ((currentStatusIndex) / (timeline.length - 1)) * 100;
  const accentGradient = isDark ? 'from-yellow-400 to-yellow-600' : 'from-orange-500 to-red-600';

  return (
    <div className={`border-t-8 ${isDark ? 'border-yellow-500 bg-[#0a0a0a] text-white' : 'border-orange-600 bg-zinc-50 text-black'} shadow-2xl font-sans relative transition-all duration-500`}>
      
      {/* Background Watermark */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 opacity-[0.03] font-black text-9xl -mr-10 -mt-10 italic uppercase select-none`}>
          {status.split('_')[0]}
        </div>
      </div>

      {/* HEADER: Balanced Layout */}
      <div className="flex flex-col md:flex-row justify-between items-center p-6 gap-6 group relative z-10 border-b border-white/5">
        
        {/* LEFT: Logistics ID */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-yellow-500' : 'bg-orange-600'}`} />
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] opacity-40">Logistics_ID</p>
          </div>
          <h3 className="font-black text-2xl italic tracking-tighter uppercase leading-none flex items-center gap-3">
            {trackingNumber || 'UNASSIGNED'}
            {trackingNumber && (
              <button onClick={handleCopy} className={`p-1.5 rounded-full transition-all ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="opacity-30 group-hover:opacity-100" />}
              </button>
            )}
          </h3>
        </div>

        {/* RIGHT: Status Phase & Carrier Chip */}
        <div className="flex items-center gap-6">
          <div className={`flex flex-col items-end px-4 py-1.5 border-r-2 ${isDark ? 'border-yellow-500/30' : 'border-orange-600/30'}`}>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-40">Phase</span>
            <span className={`font-mono text-xs font-black italic ${isDark ? 'text-yellow-500' : 'text-orange-600'}`}>
              {status.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Moved Carrier Chip to the right side of the Phase */}
          {trackingNumber && (
            <div className="relative group/carrier" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ perspective: '1200px' }}>
              <motion.div 
                onClick={() => setIsCarrierExpanded(!isCarrierExpanded)}
                className={`px-4 py-2 border rounded-sm cursor-pointer transition-all relative z-20 ${
                  isDark ? 'bg-zinc-900 border-white/10 hover:border-yellow-500/50' : 'bg-white border-black/10 hover:border-orange-600/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck size={12} className={isDark ? 'text-yellow-500' : 'text-orange-600'} />
                  <div>
                    <p className="text-[7px] font-bold uppercase tracking-widest opacity-40 leading-none mb-1">Carrier</p>
                    <p className="text-[10px] font-black uppercase italic leading-none">BlueDart_Express</p>
                  </div>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${isCarrierExpanded ? 'rotate-180' : ''} opacity-30`} />
                </div>
              </motion.div>

              <AnimatePresence>
                {isCarrierExpanded && (
                  <>
                    {/* TETHER: Connects from the right side now */}
                    <svg className="absolute bottom-full right-1/2 translate-x-1/2 w-48 h-48 pointer-events-none overflow-visible z-[60]" viewBox="0 0 100 100">
                      <motion.path
                        d="M 50 100 L 50 75 L 20 45" // Adjusted path for the new right-hand position
                        fill="none" stroke={isDark ? '#eab308' : '#ea580c'} strokeWidth="1.5" strokeDasharray="4 3"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ pathLength: 0 }}
                      />
                    </svg>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ 
                        opacity: 1, scale: 1, y: -95, x: -40, // Offsets to the left because it's on the right edge
                        rotateX, rotateY,
                        boxShadow: isDark ? "0 30px 60px -12px rgba(0,0,0,1)" : "0 30px 60px -12px rgba(0,0,0,0.2)"
                      }}
                      exit={{ opacity: 0, scale: 0.98, y: 10 }}
                      transition={{ type: "spring", damping: 25, stiffness: 180 }}
                      style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
                      className={`absolute bottom-full right-0 w-64 p-5 border-t-2 z-[70] backdrop-blur-md ${
                        isDark ? 'bg-zinc-900/98 border-white/5 border-t-yellow-500' : 'bg-white/98 border-black/5 border-t-orange-600'
                      }`}
                    >
                      <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-[7px] font-black uppercase opacity-40 tracking-[0.2em]">Agent_Assigned</p>
                            <p className="text-[11px] font-mono font-bold text-yellow-500">Vikram Singh</p>
                            <p className="text-[9px] opacity-40 font-mono">+91 98765 43210</p>
                          </div>
                          <div className="p-1.5 rounded-full bg-current/5"><Truck size={10} className={isDark ? 'text-yellow-500' : 'text-orange-600'} /></div>
                        </div>
                        <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                        <div className="flex items-center gap-2">
                           <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                           <p className="text-[10px] font-mono text-green-500 font-bold uppercase">Pickup_Manifested</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* TIMELINE & LOGS */}
      <div className="p-8 pt-12">
        <div className="relative w-full max-w-4xl mx-auto mb-20 px-4">
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r ${accentGradient} transition-all duration-1000`} style={{ width: `${totalProgress}%` }} />
          
          <div className="relative flex justify-between items-center w-full">
            {timeline.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="flex flex-col items-center">
                  <div className={`relative z-10 flex items-center justify-center h-12 w-12 transition-all duration-500 shadow-xl ${
                    item.isCompleted ? `bg-gradient-to-br ${accentGradient} text-white scale-110` : (isDark ? 'bg-zinc-900 border border-white/10 text-white/20' : 'bg-white border-2 border-zinc-200 text-zinc-300')
                  }`}>
                    {item.isCompleted && !item.isCurrent ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                  </div>
                  <span className={`absolute -bottom-10 font-mono text-[10px] font-black uppercase tracking-widest ${item.isCurrent ? (isDark ? 'text-yellow-500' : 'text-orange-600') : 'opacity-40'}`}>
                    {item.name.split('_')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {timeline.map((item) => (
            <div key={item.name} className={`group relative p-5 transition-all duration-300 border-l-4 ${item.isCurrent ? (isDark ? 'bg-white/3 border-yellow-500' : 'bg-orange-600/3 border-orange-600') : 'border-transparent opacity-40 hover:opacity-100'}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 relative z-10">
                <div className="min-w-[90px] font-mono text-[10px] opacity-50">{item.date}</div>
                <div className="grow">
                  <h4 className={`text-lg font-black uppercase italic leading-none mb-1 ${item.isCurrent ? (isDark ? 'text-yellow-500' : 'text-orange-600') : ''}`}>{item.name.replace(/_/g, ' ')}</h4>
                  <p className="text-[9px] font-bold opacity-60 tracking-wider uppercase">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracker;