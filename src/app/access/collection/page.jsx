import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function CollectionPage() {
  const { userId } = await auth();

  const purchasedItems = await prisma.orderItem.findMany({
    where: {
      order: {
        userId: userId,
        paymentStatus: 'PAID',
      },
    },
    include: {
      product: true, // Include product details for linking
    },
    orderBy: {
      order: {
        createdAt: 'desc'
      }
    }
  });

  return (
    <div>
      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black mb-6">Exhibit_Collection</h2>
      {purchasedItems.length === 0 ? (
        <div className="bg-gray-50 border border-black/10 p-8">
            <p className="text-sm font-mono text-gray-400 italic">No exhibits acquired yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {purchasedItems.map(item => (
            <Link key={item.id} href={`/product/${item.productId}`}>
              <div className="border border-black/10 hover:border-black transition-colors group aspect-square flex flex-col">
                <div className="flex-grow bg-white p-4 flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4 border-t border-black/5">
                    <p className="text-xs font-bold uppercase truncate group-hover:underline">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">Acquired: {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}