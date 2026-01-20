import prisma from "@/lib/prisma";
import { updateOrderStatus } from "@/lib/actions/order-admin";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 bg-black min-h-screen font-sans text-white">
      <div className="flex justify-between items-end mb-12 border-b-4 border-white pb-6">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white">
          Order_Log
        </h1>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total_Orders</p>
          <p className="text-2xl font-black italic">{orders.length}</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-white/10 bg-[#0a0a0a]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-black">
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Ref_ID</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Customer_Details</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Exhibits</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Valuation</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Payment</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Fulfillment_Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-xs font-bold">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="p-4">
                  <p className="text-xs font-black uppercase">{order.firstName} {order.lastName}</p>
                  <p className="text-[10px] font-mono text-gray-400">{order.email}</p>
                  <p className="text-[9px] text-gray-400 mt-1">{order.city}, {order.country}</p>
                </td>
                <td className="p-4">
                  <div className="flex -space-x-3">
                    {order.items.map((item, i) => (
                      <div key={i} title={item.name} className="w-10 h-10 bg-white border border-white/20 rounded-full p-1 overflow-hidden shadow-sm">
                        <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-sm font-black italic text-white">₹{order.total.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`text-[9px] font-black uppercase px-2 py-1 border-2 ${
                    order.paymentStatus === 'PAID' 
                      ? 'bg-green-500/10 border-green-500 text-green-500' 
                      : 'bg-red-500/10 border-red-500 text-red-500'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <StatusToggle orderId={order.id} currentStatus={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Client Component for the status dropdown
 */
function StatusToggle({ orderId, currentStatus }) {
  "use client";
  
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    const res = await updateOrderStatus(orderId, newStatus);
    if (!res.success) alert(res.error);
  };

  return (
    <div className="relative group">
      <select
        defaultValue={currentStatus}
        onChange={handleStatusChange}
        className={`text-[10px] font-black uppercase px-3 py-2 border-2 outline-none cursor-pointer transition-all
          ${currentStatus === 'PENDING' ? 'bg-transparent text-white border-white/20' : ''}
          ${currentStatus === 'SHIPPED' ? 'bg-white text-black border-white' : ''}
          ${currentStatus === 'DELIVERED' ? 'bg-green-600 text-white border-green-600' : ''}
        `}
      >
        <option value="PENDING" className="bg-black text-white">Pending_Arrival</option>
        <option value="SHIPPED" className="bg-black text-white">In_Transit</option>
        <option value="DELIVERED" className="bg-black text-white">Delivered_to_Vault</option>
      </select>
    </div>
  );
}