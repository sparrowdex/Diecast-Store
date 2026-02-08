'use client';

import { useState, useEffect } from 'react';
import { Truck, Package, Printer, CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react';
import { shiprocketMock } from '@/lib/shiprocket-mock';
import { updateOrderFulfillment } from '@/lib/actions/orders';

const FulfillmentCard = ({ order, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(order.trackingNumber ? 3 : 1); // 1: Details, 2: Create, 3: Shipped
  const [urgency, setUrgency] = useState({ label: 'Standard', color: 'text-zinc-500', ping: false });

  useEffect(() => {
    // Calculate Priority based on order age (Mocking logic)
    const orderDate = new Date(order.createdAt || Date.now());
    const hoursElapsed = Math.floor((new Date() - orderDate) / (1000 * 60 * 60));

    if (hoursElapsed < 1) {
      setUrgency({ label: 'NEW ORDER', color: 'text-green-500', ping: true });
    } else if (hoursElapsed > 48) {
      setUrgency({ label: 'CRITICAL SLA', color: 'text-red-500', ping: false });
    } else if (hoursElapsed > 12) {
      setUrgency({ label: 'URGENT', color: 'text-yellow-500', ping: false });
    }
  }, [order.createdAt]);

  const handleCreateShipment = async () => {
    setLoading(true);
    try {
      // 1. Simulate Shiprocket API
      const shipment = await shiprocketMock.createShipment(order);
      const awb = await shiprocketMock.generateAWB(shipment.shipment_id);
      
      // 2. Persist to Database via Server Action
      await updateOrderFulfillment(order.id, awb.awb_code, shipment.shipment_id);
    } catch (err) {
      console.error("Fulfillment Error:", err);
    }

    setStep(3);
    setLoading(false);
    if (onUpdate) onUpdate(awb.awb_code);
  };

  return (
    <div className="bg-zinc-900 border border-white/10 p-6 rounded-sm font-sans relative overflow-hidden">
      {/* Priority Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 text-yellow-500">
            <Truck size={20} />
          </div>
          <h3 className="text-lg font-black uppercase italic tracking-tight text-white">
            Logistics Fulfillment
          </h3>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full ${urgency.color}`}>
          {urgency.ping && <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
          <span className="text-[10px] font-black uppercase tracking-widest">{urgency.label}</span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest">Step 1: Package Metrics</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Weight (kg)</label>
              <input type="number" defaultValue="0.5" className="w-full bg-black border border-white/10 p-2 text-sm text-white focus:border-yellow-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Dimensions (cm)</label>
              <input type="text" placeholder="10x10x10" className="w-full bg-black border border-white/10 p-2 text-sm text-white focus:border-yellow-500 outline-none" />
            </div>
          </div>
          <button 
            onClick={() => setStep(2)}
            className="w-full bg-white text-black font-black py-3 uppercase italic text-sm hover:bg-yellow-500 transition-colors"
          >
            Confirm Dimensions
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 text-center py-4">
          <Package size={40} className="mx-auto text-zinc-500 mb-2" />
          <p className="text-sm text-zinc-300">Ready to generate Shiprocket AWB for this exhibit?</p>
          <button 
            disabled={loading}
            onClick={handleCreateShipment}
            className="w-full bg-yellow-500 text-black font-black py-3 uppercase italic text-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Generate Shipping Label'}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 p-4 flex items-center gap-3">
            <CheckCircle2 className="text-green-500" size={20} />
            <div>
              <p className="text-[10px] text-green-500 uppercase font-black">Shipment Active</p>
              <p className="font-mono text-sm text-white">{order.trackingNumber || 'SR_MOCK_7721'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <button className="flex items-center justify-center gap-2 border border-white/10 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
              <Printer size={14} />
              Print Shipping Label
            </button>
            <button className="flex items-center justify-center gap-2 border border-white/10 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
              <Truck size={14} />
              Manifest Pickup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FulfillmentCard;