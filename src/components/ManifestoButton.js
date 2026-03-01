"use client";

import { useEffect } from "react";

export default function ManifestoButton({ order }) {
  const orderId = order?.id || "UNASSIGNED";
  
  // FIX 1: Safely grab the correct total property (order.total instead of order.totalAmount)
  const orderTotal = order?.total || order?.amount || 0;

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        /* Hide everything else */
        body * {
          visibility: hidden;
        }
        
        /* Make manifesto visible */
        #printable-manifesto, #printable-manifesto * {
          visibility: visible;
        }
        
        /* FIX 2: Fit perfectly to A4 without pixel overflow */
        #printable-manifesto {
          position: absolute;
          left: 0;
          top: 0;
          width: 100vw;
          height: 100vh;
          padding: 15mm !important; /* Safe print margins */
          box-sizing: border-box;
          transform: none !important;
        }

        /* FIX 3: Aggressively force color printing */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        @page {
          size: A4 portrait;
          margin: 0; /* Let the padding on #printable-manifesto handle margins */
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const triggerPrint = () => {
    window.print();
  };

  if (!order) return null;

  return (
    <>
      <button 
        onClick={triggerPrint}
        className="group flex items-center gap-2 font-mono text-[9px] font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-all mt-2"
      >
        <svg className="w-3 h-3 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Generate_Technical_Manifesto.pdf
      </button>

      {/* Changed w-[800px] to w-full so it respects the print margins */}
      <div id="printable-manifesto" className="hidden print:flex flex-col w-full bg-white font-mono text-black">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-8 border-black pb-8 mb-12">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter leading-none mb-2">THE_DIECAST_STORE</h1>
            <p className="text-[10px] tracking-[0.6em] text-gray-400 uppercase">Curated_Exhibition_Core_System</p>
          </div>
          <div className="text-right">
            <div className="bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-[0.3em]" style={{ backgroundColor: 'black', color: 'white' }}>
              Technical_Manifesto_v2.0
            </div>
            <p className="text-[8px] mt-3 text-gray-400 font-bold">UPLINK_STAMP: {new Date().toISOString()}</p>
          </div>
        </div>
        
        {/* Section 1: Transaction & Logistics Grid */}
        <div className="grid grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">// Order_Reference</p>
              <p className="text-sm font-black truncate">{orderId}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">// Payment_Protocol</p>
              <p className="text-sm font-black uppercase">{order.paymentMethod || "RAZORPAY_SECURE_GATEWAY"}</p>
            </div>
          </div>
          <div className="space-y-6 border-l-2 border-gray-100 pl-12">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">// Logistics_Node_ID</p>
              <p className="text-sm font-black">{order.trackingNumber || "PENDING_ALLOCATION"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">// Carrier_Service</p>
              <p className="text-sm font-black uppercase">{order.shippingProvider || "SHIPROCKET_EXPRESS_LOGISTICS"}</p>
            </div>
          </div>
        </div>
        
        {/* Section 2: The Manifest (Items Table) */}
        <div className="flex-1">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-6 border-b-2 border-gray-200 pb-3">Exhibit_Allocation_Manifest</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="py-4 font-black">Item_Description</th>
                <th className="py-4 font-black text-center">Scale</th>
                <th className="py-4 font-black text-right">Valuation</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {(order.items || []).map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-6">
                    <p className="font-black uppercase text-sm">{item.name}</p>
                    <p className="text-[9px] text-gray-500 uppercase mt-1">{item.brand} // {item.genre?.replace(/_/g, ' ')}</p>
                  </td>
                  <td className="py-6 text-center font-black">{item.scale}</td>
                  <td className="py-6 text-right font-black italic">₹{Number(item.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Financial Summary */}
        <div className="mt-16 pt-8 border-t-4 border-black flex justify-end">
          <div className="w-72 space-y-3">
            <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold">
              <span>Subtotal_Valuation</span>
              <span>₹{Number(orderTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold">
              <span>Logistics_Fee</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between items-end pt-6">
              <span className="text-sm font-black uppercase tracking-[0.2em]">Total_Valuation</span>
              <span className="text-3xl font-black italic tracking-tighter">₹{Number(orderTotal).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Contact & Footer */}
        <div className="mt-24 grid grid-cols-2 items-end">
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-3" style={{ color: '#dc2626' }}>Contact_Center</h4>
              <p className="text-[11px] font-bold text-gray-600">support@diecaststore.com</p>
              <p className="text-[11px] font-bold text-gray-600">+91 123-456-7890</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-4">
              <p className="text-[9px] text-gray-400 max-w-xs leading-relaxed uppercase font-bold">
                This manifest serves as official proof of acquisition. All exhibits are verified for authenticity and scale precision against Gallery_OS standards.
              </p>
            </div>
          </div>

          {/* The Stamp: Scaled down slightly and tucked in to prevent edge-clipping */}
          <div className="flex justify-end relative pr-4">
            {/* Added inline style color overrides to ensure the printer does not strip Tailwind colors */}
            <div 
              className="relative transform rotate-[-8deg] border-[8px] border-red-600 text-red-600 px-8 py-3 font-black text-3xl uppercase tracking-tighter italic opacity-90 origin-right"
              style={{ borderColor: '#dc2626', color: '#dc2626' }}
            >
              <div className="absolute inset-0 border-[3px] border-red-600 m-1" style={{ borderColor: '#dc2626' }} />
              PURCHASE_COMPLETED
              <div className="text-[10px] text-center mt-2 tracking-[0.4em] font-black">VERIFIED_BY_THE_DIECAST_STORE</div>
            </div>
          </div>
        </div>

        {/* Bottom Telemetry Strip */}
        <div className="mt-auto pt-16 flex justify-between items-center text-[8px] text-gray-300 uppercase tracking-[0.5em] font-bold">
          <span>System_Node: {orderId.substring(0, 6)}</span>
          <span>--- Secure_Manifest_Protocol_Active ---</span>
          <span>Page_01_of_01</span>
        </div>
      </div>
    </>
  );
}