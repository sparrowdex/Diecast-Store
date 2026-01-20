import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function AccessLayout({ children }) {
  const { userId } = await auth();
  
  const totalSpentAggregate = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
    where: { userId: userId, paymentStatus: 'PAID' },
  });

  const totalSpent = totalSpentAggregate._sum.total || 0;
  const totalItems = await prisma.orderItem.count({ where: { order: { userId: userId, paymentStatus: 'PAID' } } });

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <div className="flex justify-between items-end mb-12 border-b-4 border-black pb-6">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter text-black">
          The_Vault
        </h1>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collection_Value</p>
            <p className="text-2xl font-black italic">₹{totalSpent.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total_Exhibits</p>
            <p className="text-2xl font-black italic">{totalItems}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1">
          <nav className="flex flex-col space-y-2 border-r border-black/10 pr-6">
            <Link href="/access" className="text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-100 p-3 transition-colors">Dashboard</Link>
            <Link href="/access/collection" className="text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-100 p-3 transition-colors">My Collection</Link>
            <Link href="/access/orders" className="text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-100 p-3 transition-colors">Order History</Link>
            <Link href="/access/settings" className="text-sm font-bold uppercase tracking-widest text-black hover:bg-gray-100 p-3 transition-colors">Settings</Link>
          </nav>
          <div className="mt-8 border-t border-black/10 pt-6">
            <UserButton afterSignOutUrl="/" />
          </div>
        </aside>
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}