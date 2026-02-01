
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import CollectionItem from "@/components/dashboard/CollectionItem";
import { redirect } from 'next/navigation';

export default async function CollectionPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/access');
  }

  const [userProfile, purchasedItems] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { theme: true }
    }),
    prisma.orderItem.findMany({
      where: {
        order: {
          userId: userId,
          paymentStatus: 'PAID',
        },
      },
      include: {
        product: true, 
      },
      orderBy: {
        order: {
          createdAt: 'desc'
        }
      }
    })
  ]);

  const isDark = userProfile?.theme === 'dark';

  return (
    <div className="space-y-10">
      {/* RESPONSIVE HEADER - Matches Dashboard and Profile */}
      <header className={`border-b-2 pb-4 transition-colors duration-500 ${isDark ? 'border-white/10' : 'border-black'}`}>
        <div className="flex justify-between items-end">
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase leading-none break-words">
            My_Archive
          </h2>
          <p className="font-geist-mono text-[9px] opacity-40 uppercase hidden sm:block">
            // TOTAL_ASSETS: {purchasedItems.length.toString().padStart(2, '0')}
          </p>
        </div>
      </header>

      {purchasedItems.length === 0 ? (
        <div className={`p-20 border-2 border-dashed flex items-center justify-center transition-all ${isDark ? "bg-zinc-900/50 border-white/5" : "bg-black/[0.02] border-black/5"}`}>
            <p className="text-[10px] font-geist-mono text-current opacity-30 italic uppercase tracking-widest">
                // NO_EXHIBITS_DETECTED_IN_SECTOR
            </p>
        </div>
      ) : (
        /* DYNAMIC GRID - Optimized for small mobile screens (2 cols) up to Desktop */
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {purchasedItems.map(item => (
            <CollectionItem key={item.id} item={item} isDark={isDark} />
          ))}
        </div>
      )}
    </div>
  );
}