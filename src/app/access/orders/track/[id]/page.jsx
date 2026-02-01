import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeliveryTracker from "@/components/DeliveryTracker";

export default async function OrderTrackPage({ params }) {
  // 1. FIX: In Next.js 15, params is a Promise that MUST be awaited
  const { id } = await params; 
  
  const { userId } = await auth();

  // 2. OPTIMIZATION: Fetch order and user profile at the same time
  const [order, userProfile] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
    }),
    prisma.user.findUnique({ 
      where: { id: userId },
      select: { theme: true } 
    })
  ]);

  // 3. SECURITY: Check if order exists and belongs to the logged-in user
  if (!order || order.userId !== userId) {
    notFound();
  }

  const isDark = userProfile?.theme === "dark";

  return (
    <div className={`min-h-screen p-6 md:p-12 transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f4f4f4] text-black'}`}>
      <header className={`mb-12 border-b pb-4 transition-colors duration-500 ${isDark ? 'border-white/10' : 'border-black'}`}>
        <div className="flex justify-between items-end">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">Shipment_Logistics</h2>
          <Link href="/access/orders" className="font-mono text-[10px] hover:underline mb-1 opacity-50">
            [ RETURN_TO_ORDER_HISTORY ]
          </Link>
        </div>
      </header>
      
      <DeliveryTracker 
        status={order.status} 
        trackingNumber={order.trackingNumber}
        isDark={isDark}
      />
    </div>
  );
}