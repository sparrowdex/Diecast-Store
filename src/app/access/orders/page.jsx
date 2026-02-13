import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import OrderHistoryItem from "@/components/dashboard/OrderHistoryItem";
import Link from "next/link";

export default async function OrdersHistoryPage() {
  const { userId } = await auth();

  // Run queries in parallel for better performance
  const [userProfile, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { theme: true }
    }),
    prisma.order.findMany({
      where: {
        userId: userId,
        paymentStatus: 'PAID',
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  ]);

  const isDark = userProfile?.theme === 'dark';

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

      {orders.length === 0 ? (
        <div className={`p-8 border border-dashed text-center font-mono text-xs opacity-50 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          [ NO_ORDERS_FOUND ]
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <OrderHistoryItem key={order.id} order={order} isDark={isDark} />
          ))}
        </div>
      )}
    </div>
  );
}