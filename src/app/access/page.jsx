import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import OrderCard from "@/components/dashboard/OrderCard"; // Import the new component

export default async function AccessDashboardPage() {
  const { userId } = await auth();

  const recentOrders = await prisma.order.findMany({
    where: { userId: userId, paymentStatus: 'PAID' },
    take: 3,
    include: {
      items: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Dashboard Header */}
      <header className="mb-12 border-b border-black pb-4">
        <h2 className="text-4xl font-black italic tracking-tighter text-black">
          THE_VAULT
        </h2>
        <div className="flex justify-between font-mono text-xs text-gray-400 mt-2">
           <span>// AUTHORIZED_PERSONNEL_ONLY</span>
           <span>ID: {userId?.slice(-8)}</span>
        </div>
      </header>

      {/* 2. Welcome Block */}
      <div className="mb-16 border-l-2 border-black pl-6">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
          Dashboard_Overview
        </h3>
        <p className="max-w-xl font-mono text-sm leading-relaxed text-gray-600">
          Welcome back. This is your personal archive. Manage your collection, track acquisitions, and monitor vault status from this terminal.
        </p>
      </div>

      {/* 3. Recent Acquisitions Grid */}
      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
            Recent_Acquisitions
          </h3>
          <span className="font-mono text-[10px] text-gray-300">
            DISPLAYING {recentOrders.length} LATEST
          </span>
        </div>

        {/* This CSS Grid creates the "Bento Box" layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentOrders.length === 0 ? (
            <div className="col-span-full flex h-32 items-center justify-center border border-dashed border-gray-200 font-mono text-xs text-gray-400">
              [NO_DATA_AVAILABLE]
            </div>
          ) : (
            recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}