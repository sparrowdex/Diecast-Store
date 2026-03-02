import prisma from "@/lib/prisma";
import Link from "next/link";
import { Clock, AlertCircle, ChevronRight, User, Package, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams.filter || 'ALL_EXHIBITS';

  let orders = [];
  let dbError = false;

  try {
    const where = {};
    if (filter === 'PAID') where.paymentStatus = 'PAID';
    if (filter === 'SHIPPED') where.status = 'SHIPPED';
    if (filter === 'DELIVERED') where.status = 'DELIVERED';
    if (filter === 'CRITICAL_ONLY') {
      where.status = { not: 'DELIVERED' };
      where.createdAt = { lt: new Date(Date.now() - 172800000) }; 
    }

    orders = await prisma.order.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        city: true,
        country: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        items: { select: { name: true, image: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch (error) {
    dbError = true;
  }

  const stats = {
    total: await prisma.order.count(),
    new: await prisma.order.count({ where: { createdAt: { gt: new Date(Date.now() - 3600000) } } }),
    critical: await prisma.order.count({ where: { status: { not: 'DELIVERED' }, createdAt: { lt: new Date(Date.now() - 172800000) } } }),
    valuation: (await prisma.order.aggregate({ _sum: { total: true } }))._sum.total || 0
  };

  const getPriority = (createdAt) => {
    const hours = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60));
    if (hours < 1) return { label: 'NEW', color: 'text-green-500', bg: 'bg-green-500/10', ping: true };
    if (hours > 48) return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-500/10', ping: false };
    if (hours > 12) return { label: 'URGENT', color: 'text-yellow-500', bg: 'bg-yellow-500/10', ping: false };
    return { label: 'STANDARD', color: 'text-zinc-500', bg: 'bg-zinc-500/10', ping: false };
  };

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen font-sans text-white overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-2 md:border-b-4 border-white pb-6 gap-4">
        <h1 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter text-white">
          Order_Log
        </h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full shrink-0">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-green-500 whitespace-nowrap">System_Live</span>
        </div>
      </div>

      {/* Glossy HUD - FIXED GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Active_Pit', value: stats.new, color: 'text-green-500' },
          { label: 'Critical_SLA', value: stats.critical, color: 'text-red-500' },
          { label: 'Fleet_Size', value: stats.total, color: 'text-white' },
          { label: 'Circuit_Val', value: `₹${stats.valuation.toLocaleString()}`, color: 'text-yellow-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-white/10 p-4 relative overflow-hidden group min-w-0">
            {/* Glossy Corner Accent Restored */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 -mr-6 -mt-6 rotate-45 group-hover:bg-white/10 transition-all" />
            
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1 truncate">
              {stat.label}
            </p>
            {/* Added truncate + tracking-tighter to keep text inside the box */}
            <p className={`text-xl md:text-3xl font-black italic ${stat.color} truncate tracking-tighter`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar scrollbar-hide">
        {['ALL_EXHIBITS', 'PAID', 'SHIPPED', 'DELIVERED', 'CRITICAL_ONLY'].map((f) => (
          <Link 
            key={f}
            href={`/admin/orders?filter=${f}`}
            className={`px-4 py-2 border border-white/10 text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === f ? 'bg-white text-black' : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            {f}
          </Link>
        ))}
      </div>

      {/* TABLE (Desktop Only) */}
      <div className="hidden lg:block border border-white/10 bg-[#0a0a0a] relative mb-10 overflow-hidden">
        {/* Subtle Grid Overlay Restored */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        <table className="w-full text-left border-collapse relative z-10">
          <thead>
            <tr className="bg-white text-black font-black uppercase italic text-[10px] tracking-widest">
              <th className="p-4 border-r border-black/10">SLA</th>
              <th className="p-4 border-r border-black/10">Ref_ID</th>
              <th className="p-4 border-r border-black/10">Customer</th>
              <th className="p-4 border-r border-black/10">Exhibits</th>
              <th className="p-4 border-r border-black/10">Valuation</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => {
              const priority = getPriority(order.createdAt);
              return (
              <tr key={order.id} className="hover:bg-white/[0.04] transition-all group">
                <td className="p-4 border-r border-white/5">
                   <PriorityBadge priority={priority} />
                </td>
                <td className="p-4 font-mono text-xs font-bold text-zinc-500 border-r border-white/5">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="p-4 border-r border-white/5">
                  <p className="text-xs font-black uppercase">{order.firstName} {order.lastName}</p>
                  <p className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-widest">{order.city}, {order.country}</p>
                </td>
                <td className="p-4 border-r border-white/5">
                   <ExhibitStack items={order.items} />
                </td>
                <td className="p-4 text-sm font-black italic text-white border-r border-white/5">₹{order.total.toLocaleString()}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 text-[10px] font-black uppercase italic hover:bg-yellow-500 transition-all">
                    Manage <ChevronRight size={12} />
                  </Link>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {/* MOBILE LIST */}
      <div className="lg:hidden flex flex-col gap-4 mb-10">
        {orders.map((order) => {
          const priority = getPriority(order.createdAt);
          return (
            <div key={order.id} className="bg-[#0a0a0a] border border-white/10 p-5 rounded-sm relative overflow-hidden group">
              {/* Card Glossy Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] -mr-8 -mt-8 rotate-45" />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex flex-col gap-1">
                  <PriorityBadge priority={priority} />
                  <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mt-1">ID: #{order.id.slice(-6).toUpperCase()}</span>
                </div>
                <p className="text-lg font-black italic text-white tracking-tighter">₹{order.total.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-3 mb-5 border-y border-white/5 py-3 relative z-10">
                 <ExhibitStack items={order.items} />
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-white truncate max-w-[150px]">{order.firstName} {order.lastName}</span>
                    <span className="text-[8px] text-zinc-500 uppercase tracking-widest truncate">{order.city}, {order.country}</span>
                 </div>
              </div>

              <Link 
                href={`/admin/orders/${order.id}`}
                className="w-full flex justify-center items-center gap-2 bg-white text-black py-3 text-[11px] font-black uppercase italic hover:bg-yellow-500 transition-all relative z-10"
              >
                Manage_Fulfillment <ChevronRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
    return (
        <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full border border-white/5 ${priority.bg} ${priority.color}`}>
            {priority.ping && <span className="h-1 w-1 rounded-full bg-current animate-pulse" />}
            <span className="text-[8px] font-black tracking-widest uppercase">{priority.label}</span>
        </div>
    );
}

function ExhibitStack({ items }) {
    return (
        <div className="flex -space-x-3 shrink-0">
            {items.slice(0, 3).map((item, i) => (
                <div key={i} className="w-8 h-8 bg-white border border-black rounded-full p-1 overflow-hidden shrink-0 shadow-xl">
                    <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
            ))}
            {items.length > 3 && (
                <div className="w-8 h-8 bg-zinc-800 border border-white/20 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                    +{items.length - 3}
                </div>
            )}
        </div>
    );
}