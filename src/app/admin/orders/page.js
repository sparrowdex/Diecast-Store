"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-black italic uppercase">Orders</h1>
        <p className="mt-4">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black italic uppercase">Orders</h1>
      <div className="mt-8 bg-white border border-black/10">
        <table className="w-full text-left">
          <thead className="text-xs uppercase tracking-widest border-b border-black/10">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Email</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-black/5">
                <td className="p-4 font-mono text-xs">{order.id}</td>
                <td className="p-4 text-sm">
                  {order.firstName} {order.lastName}
                </td>
                <td className="p-4 text-sm">{order.email}</td>
                <td className="p-4 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm font-bold">₹{order.total.toLocaleString()}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/orders/${order.id}`} className="text-xs font-mono underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
