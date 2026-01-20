import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export default async function OrderHistoryPage() {
  const { userId } = await auth();

  const orders = await prisma.order.findMany({
    where: { userId: userId, paymentStatus: 'PAID' },
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black mb-6">Acquisition_Log</h2>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-gray-50 border border-black/10 p-8">
            <p className="text-sm font-mono text-gray-400 italic">No exhibits acquired yet.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="border border-black/10 p-6 hover:border-black transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-mono text-gray-400 uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm font-bold uppercase tracking-tight">Order #{order.id.slice(-6)}</p>
                  <p className="text-xs font-mono text-gray-500 mt-1">Total: ₹{order.total.toLocaleString()}</p>
                </div>
                <span className={`text-[10px] font-black uppercase px-3 py-1 border ${
                  order.status === 'DELIVERED' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-black text-white border-black'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-4">
                {order.items.map((item, i) => (
                  <div key={i} title={item.name} className="aspect-square bg-white border border-black/5 p-2 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}