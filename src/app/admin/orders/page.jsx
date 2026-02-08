import prisma from "@/lib/prisma";
import Link from "next/link";
import { Clock, AlertCircle, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({ searchParams }) {
  // In Next.js 16, searchParams is a Promise
  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams.filter || 'ALL_EXHIBITS';

  let orders = [];
  let dbError = false;

  try {
    // Define DB-level filtering for accuracy across the entire fleet
    const where = {};
    if (filter === 'PAID') where.paymentStatus = 'PAID';
    if (filter === 'SHIPPED') where.status = 'SHIPPED';
    if (filter === 'DELIVERED') where.status = 'DELIVERED';
    if (filter === 'CRITICAL_ONLY') {
      where.status = { not: 'DELIVERED' };
      where.createdAt = { lt: new Date(Date.now() - 172800000) }; // Older than 48h
    }

    // Fetch filtered orders directly from DB
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
        items: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to recent 50 orders to prevent connection crashes
    });
  } catch (error) {
    console.error("Order Log Fetch Error:", error);
    dbError = true;
  }

  // Calculate HUD Stats using aggregate/count for global accuracy
  const totalCount = await prisma.order.count();
  const newCount = await prisma.order.count({ where: { createdAt: { gt: new Date(Date.now() - 3600000) } } });
  const criticalCount = await prisma.order.count({ where: { status: { not: 'DELIVERED' }, createdAt: { lt: new Date(Date.now() - 172800000) } } });
  const valuation = await prisma.order.aggregate({ _sum: { total: true } });

  const stats = {
    total: totalCount,
    new: newCount,
    critical: criticalCount,
    valuation: valuation._sum.total || 0
  };

  // SLA Priority Logic
  const getPriority = (createdAt) => {
    const hours = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60));
    if (hours < 1) return { label: 'NEW', color: 'text-green-500', bg: 'bg-green-500/10', ping: true };
    if (hours > 48) return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-500/10', ping: false };
    if (hours > 12) return { label: 'URGENT', color: 'text-yellow-500', bg: 'bg-yellow-500/10', ping: false };
    return { label: 'STANDARD', color: 'text-zinc-500', bg: 'bg-zinc-500/10', ping: false };
  };

  return (
    <div className="p-8 bg-black min-h-screen font-sans text-white">
      {dbError && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs font-mono flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <span>DATABASE_CONNECTION_ERROR: Unable to retrieve order logs. Telemetry offline.</span>
        </div>
      )}

      <div className="flex justify-between items-end mb-8 border-b-4 border-white pb-6">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white">
          Order_Log
        </h1>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-500">System_Live</span>
            </div>
        </div>
      </div>

      {/* Telemetry HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active_Pit_Lane (New)', value: stats.new, color: 'text-green-500' },
          { label: 'Critical_SLA', value: stats.critical, color: 'text-red-500' },
          { label: 'Fleet_Size', value: stats.total, color: 'text-white' },
          { label: 'Circuit_Valuation', value: `₹${stats.valuation.toLocaleString()}`, color: 'text-yellow-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-white/10 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 -mr-8 -mt-8 rotate-45 group-hover:bg-white/10 transition-all" />
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className={`text-3xl font-black italic ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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

      <div className="overflow-x-auto border border-white/10 bg-[#0a0a0a] shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] relative">
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-black">
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest border-r border-black/10">SLA_Status</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest border-r border-black/10">Ref_ID</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest border-r border-black/10">Customer_Details</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest border-r border-black/10">Exhibits</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest border-r border-black/10">Valuation</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => {
              const priority = getPriority(order.createdAt);
              return (
              <tr key={order.id} className="hover:bg-white/[0.04] transition-all group relative">
                <td className="p-4 border-x border-white/5">
                  <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full border border-white/10 ${priority.bg} ${priority.color}`}>
                    {priority.ping && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
                    <span className="text-[9px] font-black tracking-tighter">{priority.label}</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-xs font-bold text-zinc-400 border-r border-white/5">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="p-4 border-r border-white/5">
                  <p className="text-xs font-black uppercase">{order.firstName} {order.lastName}</p>
                  <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">{order.city}, {order.country}</p>
                </td>
                <td className="p-4 border-r border-white/5">
                  <div className="flex -space-x-3">
                    {order.items.map((item, i) => (
                      <div key={i} title={item.name} className="w-8 h-8 bg-white border border-white/20 rounded-full p-1 overflow-hidden shadow-sm grayscale group-hover:grayscale-0 transition-all">
                        <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-sm font-black italic text-white border-r border-white/5">₹{order.total.toLocaleString()}</td>
                <td className="p-4 text-right border-r border-white/5">
                  <Link 
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-2 bg-white/90 text-black px-4 py-2 text-[10px] font-black uppercase italic hover:bg-yellow-500 hover:text-black transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                  >
                    Manage_Fulfillment
                    <ChevronRight size={12} />
                  </Link>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
