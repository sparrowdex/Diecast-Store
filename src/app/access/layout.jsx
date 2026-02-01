import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserButton } from "@clerk/nextjs";
import AccessMobileNav from "@/components/dashboard/AccessMobileNav";
import { headers } from "next/headers";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/access", label: "Dashboard" },
  { href: "/access/collection", label: "My Archive" },
  { href: "/access/profile", label: "Collector Profile" },
  { href: "/access/orders", label: "Order History" },
  { href: "/access/settings", label: "Account Settings" },
];

export default async function AccessLayout({ children }) {
  const { userId } = await auth();
  const headerList = await headers();
  const pathname = headerList.get("x-invoke-path") || "";
  const isDashboard = pathname === "/access";
  
  const totalSpentAggregate = await prisma.order.aggregate({
    _sum: { total: true },
    where: { userId: userId, paymentStatus: 'PAID' },
  });

  const totalSpent = totalSpentAggregate._sum.total || 0;
  const totalItems = await prisma.orderItem.count({ 
    where: { order: { userId: userId, paymentStatus: 'PAID' } } 
  });

  const userProfile = await prisma.user.findUnique({ where: { id: userId } });
  const isDark = userProfile?.theme === 'dark';
  const textColor = isDark ? 'text-yellow-500' : 'text-orange-600';

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden font-geist ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-zinc-100 text-black'}`}>
      {/* Telemetry Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] select-none z-0" 
           style={{ backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        
        {/* MOBILE COMPACT HEADER */}
        <div className="lg:hidden mb-4 border-b pb-4 border-current/10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">THE_VAULT</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          
          {isDashboard && (
            <div className={`grid grid-cols-2 gap-4 py-3 bg-current/[0.02] border border-current/5`}>
              <div className="text-center">
                <p className="font-geist-mono text-[7px] uppercase tracking-widest opacity-40">Collection_Value</p>
                <p className={`text-sm font-black italic ${textColor}`}>₹{totalSpent.toLocaleString()}</p>
              </div>
              <div className="text-center border-l border-current/10">
                <p className="font-geist-mono text-[7px] uppercase tracking-widest opacity-40">Exhibits</p>
                <p className="text-sm font-black italic">{totalItems.toString().padStart(2, '0')}</p>
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP HEADER */}
        <div className={`hidden lg:flex justify-between items-end mb-12 border-b-4 pb-6 ${isDark ? 'border-white/10' : 'border-black'}`}>
          <div className="w-full">
            <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">The_Vault</h1>
            <p className="font-geist-mono text-[9px] uppercase tracking-[0.3em] opacity-40 mt-2">// Authorized_Collector_Access</p>
          </div>

          <div className="flex items-center gap-8 justify-end">
            <div className="text-right min-w-[120px]">
              <p className="font-geist-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total_Value</p>
              <p className={`text-2xl font-black italic ${textColor}`}>₹{totalSpent.toLocaleString()}</p>
            </div>
            <div className="text-right min-w-[100px]">
              <p className="font-geist-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Exhibits</p>
              <p className="text-2xl font-black italic">{totalItems.toString().padStart(2, '0')}</p>
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION BAR */}
        <AccessMobileNav isDark={isDark} links={NAV_LINKS} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mt-8 lg:mt-0">
          <aside className="hidden lg:block lg:col-span-1">
            <nav className={`flex flex-col space-y-1 border-r pr-6 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`text-[11px] font-black uppercase tracking-[0.2em] p-4 italic transition-all border-l-2 border-transparent hover:border-current ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 flex items-center gap-4 px-4 py-3 border border-dashed border-current/20">
              <UserButton afterSignOutUrl="/" />
              <span className="font-geist-mono text-[9px] opacity-40 uppercase tracking-widest">Active_Session</span>
            </div>
          </aside>

          <main className="lg:col-span-3 min-w-0 max-w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}