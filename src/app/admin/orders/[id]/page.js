"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import FulfillmentCard from '@/components/FulfillmentCard';

export default function OrderDetailPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-8 bg-black min-h-screen text-white font-sans">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Order_Telemetry</h1>
        <p className="mt-4 text-xs font-mono opacity-50 animate-pulse">Initializing data stream...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 bg-black min-h-screen text-white font-sans">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-red-500">Order_Not_Found</h1>
        <Link href="/admin/orders" className="mt-4 text-xs font-mono underline opacity-50 hover:opacity-100">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 bg-black min-h-screen font-sans text-white">
      <Link href="/admin/orders" className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors">
        ← BACK_TO_ORDERS
      </Link>
      <h1 className="text-4xl font-black italic uppercase mt-4 tracking-tighter">Order_Telemetry #{id.slice(0, 8)}</h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT: ORDER ITEMS */}
        <div className="md:col-span-2">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-zinc-500">Exhibit_Manifest</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-6 items-center bg-zinc-900 border border-white/10 p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 -mr-6 -mt-6 rotate-45" />
                <div className="w-20 h-20 bg-white border border-white/10 p-2 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                  <img src={item.image} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black uppercase italic text-white">{item.name}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                </div>
                <p className="text-lg font-black italic text-yellow-500">₹{item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: CUSTOMER & SHIPPING */}
        <div className="md:col-span-1 space-y-8">
           <div>
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-zinc-500">Collector_Coordinates</h3>
             <div className="bg-zinc-900 border border-white/10 p-6 text-xs font-mono text-zinc-300 space-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 -mr-6 -mt-6 rotate-45" />
                <p className="text-white font-black uppercase italic text-sm mb-2">{order.firstName} {order.lastName}</p>
                <p className="opacity-70">{order.email}</p>
                <p className="opacity-70">{order.phone}</p>
                <div className="h-px bg-white/10 my-4" />
                <p className="uppercase tracking-wider">{order.address}</p>
                <p className="uppercase tracking-wider">{order.city}, {order.postalCode}</p>
                <p className="uppercase tracking-wider text-yellow-500/80">{order.country}</p>
             </div>
           </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-zinc-500">Logistics_Control</h3>
              <FulfillmentCard 
                order={order} 
                onUpdate={(trackingNumber, shipmentId) => setOrder(prev => ({ ...prev, trackingNumber, shipmentId, status: 'SHIPPED' }))}
              />
            </div>
        </div>
      </div>
    </div>
  );
}
