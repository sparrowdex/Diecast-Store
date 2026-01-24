"use client";

import { updateOrderStatus } from "@/lib/actions/order-admin";

export default function StatusToggle({ orderId, currentStatus }) {
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    const res = await updateOrderStatus(orderId, newStatus);
    if (!res.success) alert(res.error);
    // Optionally, you might want to trigger a router.refresh() here 
    // if you want the whole page to reflect any changes.
  };

  return (
    <div className="relative group">
      <select
        defaultValue={currentStatus}
        onChange={handleStatusChange}
        className={`text-[10px] font-black uppercase px-3 py-2 border-2 outline-none cursor-pointer transition-all appearance-none
          ${currentStatus === 'PENDING' ? 'bg-transparent text-white border-white/20' : ''}
          ${currentStatus === 'SHIPPED' ? 'bg-white text-black border-white' : ''}
          ${currentStatus === 'DELIVERED' ? 'bg-green-600 text-white border-green-600' : ''}
        `}
      >
        <option value="PENDING" className="bg-black text-white">Pending_Arrival</option>
        <option value="SHIPPED" className="bg-black text-white">In_Transit</option>
        <option value="DELIVERED" className="bg-black text-white">Delivered_to_Vault</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  );
}
