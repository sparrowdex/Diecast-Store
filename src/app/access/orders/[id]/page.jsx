import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CreditCard, Smartphone, ShieldCheck, Zap, PackageSearch, ChevronLeft } from 'lucide-react';

export default async function OrderDetailsPage({ params }) {
  const { id } = await params;
  const { userId } = await auth();

  const order = await prisma.order.findUnique({
    where: { id, userId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) notFound();

  const userProfile = await prisma.user.findUnique({ where: { id: userId } });
  const isDark = userProfile?.theme === "dark";

  const accentColor = isDark ? 'text-yellow-500' : 'text-orange-600';
  const borderColor = isDark ? 'border-yellow-500/30' : 'border-orange-600/30';

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans overflow-x-hidden ${isDark ? 'bg-[#050505] text-white' : 'bg-zinc-100 text-black'}`}>
      
      {/* 1. TERMINAL HEADER - Adjusted for Mobile padding */}
      <header className="p-6 md:p-12 pb-0 md:pb-0 mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="relative w-full md:w-auto">
          <div className={`absolute -left-4 top-0 h-full w-1 ${isDark ? 'bg-yellow-500' : 'bg-orange-600'}`} />
          {/* Responsive Text Size to prevent overflow */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none wrap-break-word">
            Asset_Manifest
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
            <p className="font-mono text-[9px] md:text-[10px] opacity-40 tracking-widest uppercase">
              ID: <span className="opacity-100 font-bold">{order.id.slice(0, 12).toUpperCase()}...</span>
            </p>
            <p className="font-mono text-[9px] md:text-[10px] opacity-40 tracking-widest uppercase border-l pl-4 border-current/20">
              {new Date(order.createdAt).toISOString().split('T')[0]}
            </p>
          </div>
        </div>
        <Link href="/access" className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest p-2 border transition-all w-full md:w-auto justify-center
         ${isDark 
           ? `border-yellow-500/30 text-white hover:bg-yellow-500 hover:text-black hover:border-yellow-500` 
          : `border-orange-600/30 text-black hover:bg-orange-600 hover:text-white hover:border-orange-600`}`}
        >
        <ChevronLeft size={12} /> [ Back_to_Archive ]
        </Link>
      </header>

      {/* Main Content Area - Responsive Grid */}
      <div className="px-6 md:px-12 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: UNIT ACQUISITION */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <PackageSearch size={18} className={accentColor} />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-30 text-balance">Acquired_Units_Register</h3>
          </div>

          {order.items.map((item, index) => (
            <div 
              key={item.id} 
              className={`relative flex flex-col sm:flex-row gap-4 md:gap-6 p-4 md:p-6 border transition-all group ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}
            >
              <div className="absolute top-0 right-0 p-2 font-mono text-[8px] opacity-20">
                REF_0{index + 1}
              </div>

              {/* Responsive Image Container */}
              <div className={`h-40 sm:h-32 w-full sm:w-40 shrink-0 border relative flex items-center justify-center p-4 ${isDark ? 'bg-black border-white/10' : 'bg-zinc-50 border-black/5'}`}>
                 <img 
                  src={item.image} 
                  alt={item.name} 
                  className={`max-h-full max-w-full object-contain p-2 ${!isDark ? 'mix-blend-multiply' : ''}`} 
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-4">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${accentColor}`}>{item.product?.brand || "Precision_Diecast"}</span>
                  <h4 className="font-black italic uppercase text-xl md:text-2xl tracking-tighter leading-tight mt-1">{item.name}</h4>
                </div>
                
                {/* Responsive details - wrap on tiny screens */}
                <div className="flex flex-wrap justify-between items-end gap-4 border-t border-dashed border-current/10 pt-4 font-mono">
                  <div className="space-y-1">
                    <span className="block text-[8px] opacity-40 uppercase tracking-widest text-nowrap">Qty_Confirm</span>
                    <span className="text-xs md:text-sm font-bold">{item.quantity.toString().padStart(2, '0')} UNITS</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="block text-[8px] opacity-40 uppercase tracking-widest text-nowrap">Valuation</span>
                    <span className="text-base md:text-lg font-black italic">₹{item.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: LOGS - Stacks below on mobile */}
        <div className="flex flex-col gap-6">
          
          <section className={`p-6 md:p-8 border-2 ${isDark ? 'border-white/10 bg-zinc-900/50' : 'border-black bg-white'}`}>
            <div className="flex justify-between items-start mb-6 md:mb-8">
                <h3 className="font-mono text-[10px] font-black uppercase tracking-widest opacity-40 border-b-2 border-current pb-1 text-nowrap">Logistics_Log</h3>
                <div className="flex gap-[1px] h-6 opacity-30">
                    {[2,4,1,3,2,1,4].map((w, i) => <div key={i} className="bg-current" style={{ width: `${w}px` }} />)}
                </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block font-mono text-[8px] opacity-40 uppercase tracking-[0.2em] mb-1 text-nowrap">Current_State</label>
                <p className={`font-black italic uppercase text-2xl md:text-3xl tracking-tighter ${accentColor}`}>{order.status}</p>
              </div>
              
              <div>
                <label className="block font-mono text-[8px] opacity-40 uppercase tracking-[0.2em] mb-1 text-nowrap">Tracking_Ref</label>
                <p className="font-mono text-[10px] md:text-xs font-bold border border-current/10 p-2 bg-current/5 break-all">
                    {order.trackingNumber || "//_PENDING_ASSIGNMENT"}
                </p>
              </div>

              <div className="pt-6 border-t border-current/10">
                <div className="flex flex-col gap-3 p-3 border border-dashed border-current/20">
                    <div className="flex items-center gap-3">
                        {order.paymentMethod === 'UPI' ? <Smartphone size={16} className={accentColor}/> : <CreditCard size={16} className={accentColor}/>}
                        <div>
                            <p className="font-black text-[10px] uppercase italic leading-none">{order.paymentMethod || 'SECURE_GATEWAY'}</p>
                            <p className="font-mono text-[8px] opacity-40 uppercase mt-1">Provider: Razorpay</p>
                        </div>
                    </div>
                    <div className={`w-full text-center py-1 text-[8px] font-black uppercase border ${order.paymentStatus === 'PAID' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-yellow-500/10 border-yellow-500 text-yellow-500'}`}>
                        {order.paymentStatus}
                    </div>
                </div>
              </div>
            </div>
          </section>

          <section className={`p-6 md:p-8 border-2 border-current/10 bg-current/[0.02] relative overflow-hidden`}>
            <ShieldCheck size={60} className="absolute -right-4 -bottom-4 opacity-[0.03] -rotate-12" />
            
            <h3 className="font-mono text-[10px] font-black uppercase tracking-widest opacity-40 mb-6">Telemetry</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between opacity-60">
                <span>SUBTOTAL</span>
                <span>₹{(order.total - order.shippingCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between opacity-60">
                <span>SHIPPING</span>
                <span>₹{order.shippingCost.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between pt-4 mt-2 border-t-2 border-current/10 font-black text-xl md:text-2xl italic tracking-tighter ${accentColor}`}>
                <span>TOTAL</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}