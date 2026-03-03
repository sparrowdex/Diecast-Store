import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams.filter || 'ALL_EXHIBITS';

  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  let orders = [];
  let dbError = false;

  try {
    const where = {};
    if (filter === 'PAID') where.paymentStatus = 'PAID';
    if (filter === 'SHIPPED') where.status = 'SHIPPED';
    if (filter === 'DELIVERED') where.status = 'DELIVERED';
    if (filter === 'CRITICAL_ONLY') {
      where.status = { not: 'DELIVERED' };
      where.createdAt = { lt: new Date(now - 172800000) }; 
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
    new: await prisma.order.count({ where: { createdAt: { gt: new Date(now - 3600000) } } }),
    critical: await prisma.order.count({ where: { status: { not: 'DELIVERED' }, createdAt: { lt: new Date(now - 172800000) } } }),
    valuation: (await prisma.order.aggregate({ _sum: { total: true } }))._sum.total || 0
  };

  const getPriority = (createdAt) => {
    const hours = Math.floor((now - new Date(createdAt)) / (1000 * 60 * 60));
    if (hours < 1) return { label: 'NEW', color: 'text-green-500', bg: 'bg-green-500/10', ping: true };
    if (hours > 48) return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-500/10', ping: false };
    if (hours > 12) return { label: 'URGENT', color: 'text-yellow-500', bg: 'bg-yellow-500/10', ping: false };
    return { label: 'STANDARD', color: 'text-zinc-500', bg: 'bg-zinc-500/10', ping: false };
  };

  return (
    // THE FIX: w-full and overflow-hidden prevent the entire page from sliding side-to-side
    <div className="p-3 md:p-8 bg-black min-h-screen font-sans text-white w-full overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-row justify-between items-center md:items-end mb-6 border-b-2 md:border-b-4 border-white pb-4 gap-2 w-full">
        <h1 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-none truncate">
          Order_Log
        </h1>
        <div className="flex items-center gap-1.5 px-2 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full shrink-0">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-green-500 leading-none mt-px">SYSTEM_LIVE</span>
        </div>
      </div>

      {/* Glossy HUD - THE FIX: Reduced text size on mobile so it doesn't push the boxes wide */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6 w-full">
        {[
          { label: 'Active_Pit', value: stats.new, color: 'text-green-500' },
          { label: 'Critical_SLA', value: stats.critical, color: 'text-red-500' },
          { label: 'Fleet_Size', value: stats.total, color: 'text-white' },
          { label: 'Circuit_Val', value: `₹${stats.valuation.toLocaleString()}`, color: 'text-yellow-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-white/10 p-3 md:p-4 relative overflow-hidden group min-w-0 w-full">
            <div className="absolute top-0 right-0 w-8 h-8 bg-white/5 -mr-4 -mt-4 rotate-45" />
            <p className="text-[7px] md:text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5 truncate">
              {stat.label}
            </p>
            {/* Reduced text-lg on mobile to prevent numbers from blowing out the grid */}
            <p className={`text-base md:text-3xl font-black italic ${stat.color} truncate tracking-tighter`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Bar - THE FIX: Changed to flex-wrap so tabs stack on tiny screens instead of pushing the page wide */}
      <div className="flex flex-wrap gap-1.5 mb-6 w-full">
        {['ALL_EXHIBITS', 'PAID', 'SHIPPED', 'DELIVERED', 'CRITICAL_ONLY'].map((f) => (
          <Link 
            key={f}
            href={`/admin/orders?filter=${f}`}
            className={`px-3 py-1.5 border border-white/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all truncate ${
              filter === f ? 'bg-white text-black' : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            {f}
          </Link>
        ))}
      </div>

      {/* TIER 1: TABLE (Desktop Only) */}
      <div className="hidden lg:block border border-white/10 bg-[#0a0a0a] relative mb-10 overflow-hidden w-full">
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

      {/* TIER 2 & 3: MOBILE LIST (< lg) - Combined and Ultra-Compacted */}
      <div className="lg:hidden flex flex-col gap-2.5 w-full pb-10">
        {orders.map((order) => {
          const priority = getPriority(order.createdAt);
          return (
            <div key={order.id} className="bg-[#0a0a0a] border border-white/10 p-2.5 flex flex-col gap-3 relative overflow-hidden group w-full min-w-0">
              <div className="absolute top-0 right-0 w-10 h-10 bg-white/[0.02] -mr-5 -mt-5 rotate-45 pointer-events-none" />

              <div className="flex gap-3 items-center relative z-10 w-full min-w-0">
                <div className="shrink-0">
                   <ExhibitStack items={order.items} compact={true} />
                </div>
                
                <div className="flex flex-col flex-1 min-w-0 justify-center">
                  <p className="text-[11px] font-black uppercase tracking-tight text-white truncate leading-none mt-0.5">
                    {order.firstName} {order.lastName}
                  </p>
                  <p className="text-[9px] font-mono text-zinc-500 mt-1.5 leading-none truncate">
                    #{order.id.slice(-6).toUpperCase()}{" // "}{order.city}
                  </p>
                  <p className="text-[10px] font-black italic text-yellow-500 mt-1.5 tracking-tighter leading-none">
                    ₹{order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Bar - THE FIX: Adjusted padding and pulled the Manage button slightly to the left */}
              <div className="flex justify-between items-center bg-white/[0.03] pl-2 pr-1.5 py-1.5 border border-white/5 relative z-10 w-full rounded-sm">
                <div className="shrink-0">
                  <PriorityBadge priority={priority} compact={true} />
                </div>
                {/* Changed px-3 to px-2 to artificially shrink the button width and pull it inwards */}
                <Link 
                  href={`/admin/orders/${order.id}`} 
                  className="flex gap-1 items-center bg-white text-black hover:bg-yellow-500 px-2 py-1 text-[8px] font-black uppercase tracking-widest transition-colors rounded-none shrink-0"
                >
                  MANAGE <ChevronRight size={10} />
                </Link>
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="p-8 text-center font-mono text-[10px] text-zinc-600 uppercase tracking-widest italic border border-white/5">
            -- No Active Nodes --
          </div>
        )}
      </div>

    </div>
  );
}

// Compact logic baked directly into the badge to prevent CSS scale() bugs
function PriorityBadge({ priority, compact = false }) {
    return (
        <div className={`inline-flex items-center ${compact ? 'gap-1.5 px-1.5 py-0.5' : 'gap-2 px-2 py-1'} rounded-full border border-white/5 ${priority.bg} ${priority.color}`}>
            {priority.ping && <span className={`${compact ? 'h-0.5 w-0.5' : 'h-1 w-1'} rounded-full bg-current animate-pulse`} />}
            <span className={`${compact ? 'text-[6px]' : 'text-[8px]'} font-black tracking-widest uppercase`}>{priority.label}</span>
        </div>
    );
}

function ExhibitStack({ items, compact = false }) {
    const size = compact ? "w-7 h-7 p-0.5" : "w-8 h-8 p-1";
    const textSize = compact ? "text-[6px]" : "text-[8px]";
    const overlap = compact ? "-space-x-2" : "-space-x-3";

    return (
        <div className={`flex ${overlap} shrink-0`}>
            {items.slice(0, 3).map((item, i) => (
                <div key={i} className={`${size} bg-white border border-black rounded-full overflow-hidden shrink-0 shadow-xl`}>
                    <Image src={item.image} alt="Exhibit" width={32} height={32} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
            ))}
            {items.length > 3 && (
                <div className={`${size} bg-zinc-800 border border-white/20 rounded-full flex items-center justify-center ${textSize} font-bold text-white shrink-0`}>
                    +{items.length - 3}
                </div>
            )}
        </div>
    );
}