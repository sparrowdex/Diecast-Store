import Link from "next/link";

const OrderHistoryItem = ({ order, isDark }) => {
  const items = order.items || [];
  const accentColor = isDark ? 'border-yellow-500' : 'border-orange-600';
  const statusColor = isDark ? 'text-yellow-500' : 'text-orange-600';

  return (
    <div className={`
      w-full mb-8 border-l-4 ${accentColor} 
      ${isDark ? 'bg-[#0c0c0c] shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'bg-white shadow-xl'}
      transition-all duration-300 overflow-hidden
    `}>
      
      {/* 1. TOP MANIFEST HEADER */}
      <div className={`
        flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 border-b
        ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/2'}
      `}>
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-40">Order Manifest</span>
          <h3 className="font-black italic text-lg tracking-tighter uppercase">
            #{order.id.slice(-12).toUpperCase()}
          </h3>
        </div>
        
        <div className="flex gap-8 mt-4 md:mt-0">
          <div className="text-left md:text-right">
            <p className="font-mono text-[9px] uppercase opacity-40">Status</p>
            <p className={`font-black italic text-sm uppercase ${statusColor}`}>{order.status}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="font-mono text-[9px] uppercase opacity-40">Grand Total</p>
            <p className="font-black italic text-lg">₹{order.total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC ITEM GRID */}
      <div className="p-6 space-y-4">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className={`flex items-center gap-6 p-3 group transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
          >
            {/* Product Image Node */}
            <div className={`
              h-20 w-28 shrink-0 flex items-center justify-center p-2 border
              ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-zinc-100 border-black/5'}
            `}>
              <img 
                src={item.image || '/placeholder.png'} 
                alt={item.name} 
                className="max-h-full max-w-full object-contain transition-transform group-hover:scale-110" 
              />
            </div>

            {/* Product Details Node */}
            <div className="grow">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[8px] px-1 bg-current/10 opacity-50 uppercase">Item 0{idx + 1}</span>
                {item.scale && (
                  <span className={`font-black text-[9px] italic ${statusColor}`}>{item.scale} SCALE</span>
                )}
              </div>
              <h4 className="font-black text-sm md:text-base uppercase italic tracking-tight opacity-90 line-clamp-1">
                {item.name}
              </h4>
              <p className="font-mono text-[10px] opacity-40 uppercase">Serial: {item.sku || 'N/A'}</p>
            </div>

            {/* Unit Price */}
            <div className="hidden md:block text-right">
              <p className="font-mono text-[9px] opacity-40">Unit Price</p>
              <p className="font-bold italic">₹{item.price?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. ACTION FOOTER */}
      <div className={`
        flex flex-col-reverse md:flex-row-reverse gap-4 p-6 pt-0
      `}>
        <div className="flex flex-col sm:flex-row-reverse gap-2 w-full md:w-auto">
          <Link 
            href={`/access/orders/${order.id}`}
            className={`
              px-8 py-3 text-[10px] text-center font-black uppercase italic tracking-widest
              transition-all duration-200
              ${isDark ? 'bg-white text-black hover:bg-zinc-300' : 'bg-black text-white hover:bg-zinc-800'}
            `}
          >
            Inspect Details
          </Link>
          <Link 
            href={`/access/orders/track/${order.id}`}
            className={`
              px-8 py-3 text-[10px] text-center font-black uppercase italic tracking-widest border-2
              transition-all duration-200
              ${isDark 
                ? 'border-white/10 text-white hover:border-yellow-500 hover:text-yellow-500' 
                : 'border-black/10 text-black hover:border-orange-600 hover:text-orange-600'
              }
            `}
          >
            Track Shipment
          </Link>
        </div>
        <div className="grow flex items-center font-mono text-[8px] md:text-[9px] opacity-30 italic uppercase tracking-wider border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
          Telemetry_Log: {new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryItem;