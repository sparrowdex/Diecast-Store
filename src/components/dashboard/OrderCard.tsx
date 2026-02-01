import Link from "next/link";
import Image from "next/image";
import { Order, OrderItem } from "@prisma/client"; // Adjust based on your Prisma types
//This component displays an order summary card with dynamic styling for recent acquistions based on the isDark prop.
// Helper type to include relation
type OrderWithItems = Order & { items: OrderItem[] };

interface OrderCardProps {
  order: OrderWithItems;
  isDark?: boolean;
}

export default function OrderCard({ order, isDark }: OrderCardProps) {
  // Safe access to the first item for the "Hero" image
  const mainItem = order.items?.[0];
  const itemCount = order.items?.length || 0;

  return (
    <div className={`group relative w-full transition-all hover:-translate-y-1 ${
      isDark 
        ? 'bg-zinc-900 hover:shadow-[4px_4px_0px_0px_#ffffff]' 
        : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
    }`}>
      
      {/* 1. The "Blueprint" Border (The outer container border) */}
      <div className={`absolute inset-0 border transition-colors ${isDark ? 'border-white/10 group-hover:border-white' : 'border-black/10 group-hover:border-black'}`} />

      {/* 2. Technical Corner Brackets (The "HUD" look) */}
      <div className={`absolute left-0 top-0 h-1.5 w-1.5 border-l-2 border-t-2 opacity-0 transition-opacity group-hover:opacity-100 ${isDark ? 'border-white' : 'border-black'}`} />
      <div className={`absolute right-0 top-0 h-1.5 w-1.5 border-r-2 border-t-2 opacity-0 transition-opacity group-hover:opacity-100 ${isDark ? 'border-white' : 'border-black'}`} />
      <div className={`absolute bottom-0 left-0 h-1.5 w-1.5 border-b-2 border-l-2 opacity-0 transition-opacity group-hover:opacity-100 ${isDark ? 'border-white' : 'border-black'}`} />
      <div className={`absolute bottom-0 right-0 h-1.5 w-1.5 border-b-2 border-r-2 opacity-0 transition-opacity group-hover:opacity-100 ${isDark ? 'border-white' : 'border-black'}`} />

      <div className="relative p-5">
        {/* Header: Reference Number & Date */}
        <div className={`mb-4 flex items-center justify-between border-b pb-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
          isDark ? 'border-white/5 text-zinc-500 group-hover:border-white/10 group-hover:text-white' : 'border-black/5 text-gray-400 group-hover:border-black/10 group-hover:text-black'
        }`}>
          <span>REF: {order.id?.slice(-6) || "N/A"}</span>
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex gap-5">
          {/* Main Image Container */}
          <div className={`relative flex h-20 w-20 shrink-0 items-center justify-center p-2 ${isDark ? 'bg-zinc-800' : 'bg-gray-50'}`}>
            {/* Dashed border that turns solid on hover */}
            <div className={`absolute inset-0 border border-dashed transition-all group-hover:border-solid ${
              isDark ? 'border-white/20 group-hover:border-white' : 'border-black/20 group-hover:border-black'
            }`} />
            
            {mainItem?.image ? (
              <Image 
                src={mainItem.image} 
                alt={mainItem.name} 
                width={80}
                height={80}
                className={`relative z-10 h-full w-full object-contain grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0 ${!isDark ? 'mix-blend-multiply' : ''}`} 
              />
            ) : (
              <div className={`text-[10px] ${isDark ? 'text-zinc-600' : 'text-gray-300'}`}>NO IMG</div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex grow flex-col justify-between py-1">
            <div>
              <h4 className={`font-bold uppercase leading-none tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                {mainItem?.name || "Unknown Asset"}
              </h4>
              <p className={`mt-1 font-mono text-[10px] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                TOTAL_UNITS: {itemCount.toString().padStart(2, '0')}
              </p>
            </div>

            <div className="flex items-end justify-between">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  order.paymentStatus === 'PAID' 
                    ? (isDark ? 'bg-white' : 'bg-black') 
                    : (isDark ? 'bg-zinc-700' : 'bg-gray-300')
                }`} />
                <span className={`font-mono text-[10px] font-bold uppercase ${isDark ? 'text-white' : 'text-black'}`}>
                  {order.paymentStatus}
                </span>
              </div>

              {/* Action Link */}
              <Link 
                href={`/access/orders/${order.id}`} 
                className={`group/link flex items-center gap-1 font-mono text-[10px] uppercase underline underline-offset-4 transition-all ${
                  isDark ? 'text-white decoration-zinc-700 hover:decoration-white' : 'text-black decoration-gray-300 hover:decoration-black'
                }`}
              >
                Inspect
                <span className="transition-transform group-hover/link:translate-x-0.5">-&gt;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}