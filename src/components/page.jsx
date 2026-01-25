import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import DeliveryTracker from "@/components/DeliveryTracker";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderTrackingPage({ params }) {
  const { id } = await params;
  const { userId } = await auth();

  const order = await prisma.order.findUnique({
    where: { id, userId },
    include: { items: true }
  });

  if (!order) return notFound();

  return (
    <div className="min-h-screen bg-[#fafafa] p-8 md:p-20 font-sans text-black">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 border-b border-black/10 pb-8">
          <Link href="/access/orders" className="text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition-colors">
            ← Back_to_Logs
          </Link>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mt-6">
            Shipment_Telemetry
          </h1>
          <p className="text-xs font-mono text-gray-400 uppercase mt-2">
            Order_Ref: #{order.id.toUpperCase()} // {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </header>

        <div className="bg-white border border-black/5 p-8 md:p-12 shadow-sm mb-8">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-12">Live_Progress_Track</h3>
          <DeliveryTracker status={order.status} trackingNumber={order.trackingNumber} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {order.items.map((item, i) => (
            <div key={i} className="aspect-square bg-white border border-black/5 p-4 flex items-center justify-center group">
              <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}