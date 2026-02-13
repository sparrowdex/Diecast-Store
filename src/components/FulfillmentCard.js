'use client';

import { useState, useEffect } from 'react';
import { Truck, Package, Printer, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { createShipment, generateLabel, manifestPickup } from '@/lib/actions/shiprocket';

const FulfillmentCard = ({ order, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isShipped, setIsShipped] = useState(!!order.trackingNumber);
  const [urgency, setUrgency] = useState({ label: 'Standard', color: 'text-zinc-500', ping: false });

  useEffect(() => {
    const orderDate = new Date(order.createdAt || Date.now());
    const hoursElapsed = Math.floor((new Date() - orderDate) / (1000 * 60 * 60));

    if (hoursElapsed < 1) setUrgency({ label: 'NEW ORDER', color: 'text-green-500', ping: true });
    else if (hoursElapsed > 48) setUrgency({ label: 'CRITICAL SLA', color: 'text-red-500', ping: false });
    else if (hoursElapsed > 12) setUrgency({ label: 'URGENT', color: 'text-yellow-500', ping: false });
  }, [order.createdAt]);

  const handleCreateShipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createShipment(order.id);

      if (result.success) {
        setIsShipped(true);
        if (onUpdate) onUpdate(result.data.awbCode, result.data.shipmentId);
      } else {
        setError(result.error || "An unknown error occurred.");
      }
    } catch (err) {
      console.error("Fulfillment Error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintLabel = async () => {
    const response = await generateLabel(order.shipmentId || 12345);
    if (response.success) {
      window.open(response.label_url, '_blank');
    }
  };

  const handleManifestPickup = async () => {
    setLoading(true);
    try {
      const response = await manifestPickup(order.shipmentId || 12345);
      if (response.success) {
        alert(`PICKUP_MANIFESTED\nAgent: ${response.courier_agent}\nWindow: ${response.pickup_window}`);
      }
    } catch (err) {
      console.error("Manifest Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-white/10 p-6 rounded-sm font-sans relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 text-yellow-500"><Truck size={20} /></div>
          <h3 className="text-lg font-black uppercase italic tracking-tight text-white">Logistics Fulfillment</h3>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full ${urgency.color}`}>
          {urgency.ping && <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
          <span className="text-[10px] font-black uppercase tracking-widest">{urgency.label}</span>
        </div>
      </div>

      {!isShipped ? (
        <div className="space-y-4 text-center py-4">
          <Package size={40} className="mx-auto text-zinc-500 mb-2" />
          <p className="text-sm text-zinc-300">Ready to generate Shiprocket AWB for this exhibit?</p>
          <p className="text-xs text-zinc-500">Package dimensions and weight will be auto-calculated.</p>

          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-2 rounded-sm text-xs text-left flex gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            onClick={handleCreateShipment}
            className="w-full bg-yellow-500 text-black font-black py-3 uppercase italic text-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Generate Shipping Label'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 p-4 flex items-center gap-3">
            <CheckCircle2 className="text-green-500" size={20} />
            <div>
              <p className="text-[10px] text-green-500 uppercase font-black">Shipment Active</p>
              <p className="font-mono text-sm text-white">{order.trackingNumber || 'SR_MOCK_7721'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={handlePrintLabel}
              className="flex items-center justify-center gap-2 border border-white/10 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer"
            >
              <Printer size={14} />
              Print Shipping Label
            </button>
            <button 
              onClick={handleManifestPickup}
              disabled={loading}
              className="flex items-center justify-center gap-2 border border-white/10 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : <Truck size={14} />}
              {loading ? 'Processing...' : 'Manifest Pickup'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FulfillmentCard;