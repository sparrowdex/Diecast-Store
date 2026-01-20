import Link from "next/link";
import { Order, OrderItem } from "@prisma/client"; // Adjust based on your Prisma types

// Helper type to include relation
type OrderWithItems = Order & { items: OrderItem[] };

interface OrderCardProps {
  order: OrderWithItems;
}

export default function OrderCard({ order }: OrderCardProps) {
  // Safe access to the first item for the "Hero" image
  const mainItem = order.items[0];
  const itemCount = order.items.length;

  return (
    <div className="group relative w-full bg-white transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      
      {/* 1. The "Blueprint" Border (The outer container border) */}
      <div className="absolute inset-0 border border-black/10 transition-colors group-hover:border-black" />

      {/* 2. Technical Corner Brackets (The "HUD" look) */}
      <div className="absolute left-0 top-0 h-1.5 w-1.5 border-l-2 border-t-2 border-black opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute right-0 top-0 h-1.5 w-1.5 border-r-2 border-t-2 border-black opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b-2 border-l-2 border-black opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b-2 border-r-2 border-black opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative p-5">
        {/* Header: Reference Number & Date */}
        <div className="mb-4 flex items-center justify-between border-b border-black/5 pb-2 font-mono text-[10px] uppercase tracking-wider text-gray-400 group-hover:border-black/10 group-hover:text-black">
          <span>REF: {order.id.slice(-6)}</span>
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex gap-5">
          {/* Main Image Container */}
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center bg-gray-50 p-2">
            {/* Dashed border that turns solid on hover */}
            <div className="absolute inset-0 border border-dashed border-black/20 transition-all group-hover:border-solid group-hover:border-black" />
            
            {mainItem ? (
              <img 
                src={mainItem.image} 
                alt={mainItem.name} 
                className="relative z-10 h-full w-full object-contain mix-blend-multiply grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0" 
              />
            ) : (
              <div className="text-[10px] text-gray-300">NO IMG</div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex grow flex-col justify-between py-1">
            <div>
              <h4 className="font-bold uppercase leading-none tracking-tight text-black">
                {mainItem?.name || "Unknown Asset"}
              </h4>
              <p className="mt-1 font-mono text-[10px] text-gray-400">
                TOTAL_UNITS: {itemCount.toString().padStart(2, '0')}
              </p>
            </div>

            <div className="flex items-end justify-between">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-black' : 'bg-gray-300'}`} />
                <span className="font-mono text-[10px] font-bold uppercase text-black">
                  {order.paymentStatus}
                </span>
              </div>

              {/* Action Link */}
              <Link 
                href={`/access/orders/${order.id}`} 
                className="group/link flex items-center gap-1 font-mono text-[10px] uppercase underline decoration-gray-300 underline-offset-4 transition-all hover:decoration-black"
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