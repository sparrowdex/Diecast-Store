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
      <div className="p-8">
        <h1 className="text-2xl font-black italic uppercase">Order Details</h1>
        <p className="mt-4">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-black italic uppercase">Order Not Found</h1>
        <Link href="/admin/orders" className="mt-4 text-xs font-mono underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link href="/admin/orders" className="text-[10px] font-mono text-gray-400 hover:text-black">
        ← BACK_TO_ORDERS
      </Link>
      <h1 className="text-2xl font-black italic uppercase mt-4">Order #{id.slice(0, 8)}</h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT: ORDER ITEMS */}
        <div className="md:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center bg-white p-4 border border-black/5">
                <div className="w-16 h-16 bg-gray-50 border border-black/5 p-2 flex items-center justify-center">
                  <img src={item.image} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase italic">{item.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs font-mono font-bold">₹{item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: CUSTOMER & SHIPPING */}
        <div className="md:col-span-1">
           <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Customer & Shipping</h3>
           <div className="bg-white p-4 border border-black/5 text-xs font-mono">
              <p><strong>{order.firstName} {order.lastName}</strong></p>
              <p>{order.email}</p>
              <p>{order.phone}</p>
              <br/>
              <p>{order.address}</p>
              <p>{order.city}, {order.postalCode}</p>
              <p>{order.country}</p>
           </div>

            <div className="mt-8">
              <FulfillmentCard 
                order={order} 
                onUpdate={(trackingNumber) => setOrder(prev => ({ ...prev, trackingNumber, status: 'SHIPPED' }))}
              />
            </div>
        </div>
      </div>
    </div>
  );
}
