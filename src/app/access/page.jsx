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

  const allProducts = await prisma.product.findMany({ select: { id: true, genre: true } });
  const categories = [...new Set(allItems.map(item => item.product?.genre).filter(Boolean))].map(genre => {
    const totalInGenre = allProducts.filter(p => p.genre === genre).length;
    const ownedUniqueInGenre = new Set(allItems.filter(item => item.product?.genre === genre).map(item => item.productId)).size;
    return {
      name: genre.replace(/_/g, ' '),
      percentage: totalInGenre > 0 ? Math.min(Math.round((ownedUniqueInGenre / totalInGenre) * 100), 100) : 0,
    };
  });

  const isDark = userProfile.theme === 'dark';

  const profileData = {
    ...userProfile,
    imageUrl: user?.imageUrl,
    memberSince: new Date(userProfile.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
    lastSync: orders[0] ? new Date(orders[0].createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.') : 'NEVER'
  };

  return (
    <div className="space-y-12">
      <header className={`border-b-2 pb-4 ${isDark ? 'border-white/10' : 'border-black'}`}>
        <div className="flex justify-end items-center mb-4">
          <Link href="/access/collection" className="font-geist-mono text-[9px] hover:underline opacity-50 uppercase">[ Full_Archive ]</Link>
        </div>
        <div className="flex justify-between items-end">
          <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">Collector_Dashboard</h2>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-full">
          <CollectorIDCard profile={profileData} />
        </div>
        <div className="lg:col-span-1 h-full">
          <StatsPanel stats={stats} theme={userProfile.theme} />
        </div>
        <div className="lg:col-span-3 pt-4">
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