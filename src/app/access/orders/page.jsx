import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import OrderHistoryItem from "@/components/dashboard/OrderHistoryItem";
import Link from "next/link";

export default async function OrdersHistoryPage({ searchParams }) {
  const { userId } = await auth();
  const params = await searchParams;
  
  const currentPage = parseInt(params.page) || 1;
  const currentStatus = params.status || 'ALL';
  const pageSize = 5; // Orders per "Sector"

  const whereClause = {
    userId: userId,
    paymentStatus: 'PAID',
    ...(currentStatus !== 'ALL' && { status: currentStatus })
  };

  // Run queries in parallel for better performance
  const [userProfile, orders, totalCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { theme: true }
    }),
    prisma.order.findMany({
      where: whereClause,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    }),
    prisma.order.count({ where: whereClause })
  ]);

  const isDark = userProfile?.theme === 'dark';
  const totalPages = Math.ceil(totalCount / pageSize);
  const statuses = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

  return (
    <div className={`p-6 md:p-12 transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f4f4f4] text-black'}`}>
      <header className={`mb-12 border-b pb-4 transition-colors duration-500 ${isDark ? 'border-white/10' : 'border-black'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase">Order_History</h2>
          <Link href="/access" className="font-mono text-[10px] hover:underline mb-1 opacity-50">
            [ RETURN_TO_DASHBOARD ]
          </Link>
        </div>
      </header>

      {/* STATUS FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-8 font-mono text-[9px] uppercase tracking-widest">
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/access/orders?status=${s}&page=1`}
            className={`
              px-4 py-2 border transition-all duration-200
              ${currentStatus === s 
                ? (isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black') 
                : (isDark ? 'border-white/10 opacity-40 hover:opacity-100' : 'border-black/10 opacity-40 hover:opacity-100')
              }
            `}
          >
            {s}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className={`p-8 border border-dashed text-center font-mono text-xs opacity-50 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          [ NO_ORDERS_MATCHING_CRITERIA ]
        </div>
      ) : (
        <div>
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <OrderHistoryItem key={order.id} order={order} isDark={isDark} />
            ))}
          </div>

          {/* PAGINATION TELEMETRY */}
          <div className="mt-12 flex justify-between items-center font-mono text-[10px] uppercase opacity-50 border-t pt-8 border-current/5">
            <Link 
              href={`?page=${currentPage - 1}&status=${currentStatus}`} 
              className={`transition-opacity ${currentPage <= 1 ? 'pointer-events-none opacity-10' : 'hover:underline'}`}
            >
              [ PREV_SECTOR ]
            </Link>
            <span className="tracking-[0.3em]">LAP {currentPage} / {totalPages || 1}</span>
            <Link 
              href={`?page=${currentPage + 1}&status=${currentStatus}`} 
              className={`transition-opacity ${currentPage >= totalPages ? 'pointer-events-none opacity-10' : 'hover:underline'}`}
            >
              [ NEXT_SECTOR ]
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}