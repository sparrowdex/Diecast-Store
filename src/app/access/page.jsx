import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import CollectorIDCard from "@/components/dashboard/CollectorIDCard";
import StatsPanel from "@/components/dashboard/StatsPanel";
import OrderCard from "@/components/dashboard/OrderCard";
import ProgressPanel from "@/components/dashboard/ProgressPanel";

export default async function AccessDashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  let userProfile = await prisma.user.findUnique({ where: { id: userId } });
  if (!userProfile) {
    userProfile = await prisma.user.create({
      data: { id: userId, theme: "dark", collectorName: `COLLECTOR_${userId?.slice(-4)}` },
    });
  }

  const orders = await prisma.order.findMany({
    where: { userId, paymentStatus: 'PAID' },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const allPaidOrders = await prisma.order.findMany({
    where: { userId, paymentStatus: 'PAID' },
    include: { items: { include: { product: true } } }
  });

  const allItems = allPaidOrders.flatMap(order => order.items);
  const stats = {
    totalModels: allItems.reduce((sum, item) => sum + item.quantity, 0),
    rareEditions: allItems.filter(item => item.product?.isRare).length,
  };

  const allProducts = await prisma.product.findMany({ select: { category: true } });
  const categories = [...new Set(allItems.map(item => item.product?.category).filter(Boolean))].map(cat => {
    const total = allProducts.filter(p => p.category === cat).length;
    const owned = allItems.filter(item => item.product?.category === cat).length;
    return {
      name: cat,
      percentage: total > 0 ? Math.round((owned / total) ? 100 : 0) : 0,
    };
  });

  const isDark = userProfile.theme === 'dark';

  return (
    <div className="space-y-12">
      <header className={`border-b-2 pb-4 ${isDark ? 'border-white/10' : 'border-black'}`}>
        <div className="flex justify-between items-end">
          <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">Collector_Dashboard</h2>
          <Link href="/access/collection" className="font-geist-mono text-[9px] hover:underline mb-1 opacity-50 uppercase">[ Full_Archive ]</Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CollectorIDCard profile={{ ...userProfile, imageUrl: user?.imageUrl }} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <StatsPanel stats={stats} theme={userProfile.theme} />
          <ProgressPanel categories={categories} theme={userProfile.theme} />
        </div>
      </div>

      <section className="pt-8">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">Recent_Acquisitions</h3>
            <span className="h-[1px] flex-grow mx-6 bg-current opacity-5 hidden md:block"></span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {orders.length === 0 ? (
            <div className={`col-span-full py-20 border-2 border-dashed ${isDark ? 'border-white/5' : 'border-black/5'} text-center font-geist-mono text-[10px] opacity-20`}>
              // NO_ASSETS_DETECTED_IN_VAULT
            </div>
          ) : (
            orders.map((order) => <OrderCard key={order.id} order={order} isDark={isDark} />)
          )}
        </div>
      </section>
    </div>
  );
}