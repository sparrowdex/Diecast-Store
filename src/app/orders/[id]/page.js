import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getOrder(id) {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export default async function OrderStatusPage({ params }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  const steps = [
    { label: "Order Placed", status: "PENDING" },
    { label: "Processing", status: "PROCESSING" },
    { label: "Shipped", status: "SHIPPED" },
    { label: "Delivered", status: "DELIVERED" },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="mb-12">
        <Link href="/catalog" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
          ← Back to Catalog
        </Link>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mt-4">
          Order Status
        </h1>
        <p className="text-sm text-gray-500 font-mono mt-2">ID: {order.id}</p>
      </div>

      {/* Status Tracker */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 shadow-sm">
        <div className="relative flex justify-between">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 -z-10" />
          <div 
            className="absolute top-4 left-0 h-0.5 bg-black transition-all duration-1000 -z-10" 
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, index) => (
            <div key={step.status} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-colors duration-500 ${
                index <= currentStepIndex ? 'bg-black border-black text-white' : 'bg-white border-gray-100 text-gray-300'
              }`}>
                {index < currentStepIndex ? "✓" : index + 1}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest mt-4 ${
                index <= currentStepIndex ? 'text-black' : 'text-gray-300'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {order.trackingNumber && (
          <div className="mt-12 p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-[8px] uppercase text-gray-400 tracking-widest mb-1">Tracking Number</p>
              <p className="text-sm font-mono font-bold">{order.trackingNumber}</p>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest bg-white border border-black/5 px-4 py-2 rounded hover:bg-black hover:text-white transition-all">
              Track Package
            </button>
          </div>
        )}
      </div>

      {/* Order Details Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Shipping Address</h3>
          <div className="text-sm leading-relaxed">
            <p className="font-bold">{order.firstName} {order.lastName}</p>
            <p className="text-gray-600">{order.address}</p>
            <p className="text-gray-600">{order.city}, {order.postalCode}</p>
            <p className="text-gray-600">{order.country}</p>
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping ({order.shippingMethod})</span><span>₹{order.shippingCost}</span></div>
            <div className="flex justify-between text-lg font-black italic border-t border-gray-100 pt-2"><span>Total</span><span>₹{order.total}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}