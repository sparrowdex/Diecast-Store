"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard({ initialCars = [], initialOrders = [], dbError = false }) {
  const [cars, setCars] = useState(initialCars);

  // Stats Calculation
  const totalValue = cars.reduce((acc, car) => {
    const price = car.price || (car.variants && car.variants.length > 0 ? car.variants[0].price : 0);
    return acc + parseInt(String(price).replace(/[^\d]/g, "") || 0);
  }, 0);

  const featuredCount = cars.filter(c => c.featured || c.collectionStatus === 'FEATURED_EXHIBIT').length;
  
  // Refined Stock Logic
  const outOfStockCars = cars.filter(c => c.stock === 0);
  const lowStockCars = cars.filter(c => c.stock < 3 && c.stock > 0);
  
  // Combine them for the Red Box display (Out of stock first, then low stock)
  const criticalItems = [...outOfStockCars, ...lowStockCars];

  const genreStats = useMemo(() => {
    const stats = {};
    cars.forEach(car => {
      if (car.genre) {
        stats[car.genre] = (stats[car.genre] || 0) + 1;
      }
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [cars]);

  const podium = [...cars].sort((a, b) => {
    const priceA = a.price || (a.variants && a.variants.length > 0 ? a.variants[0].price : 0);
    const priceB = b.price || (b.variants && b.variants.length > 0 ? b.variants[0].price : 0);
    return parseInt(String(priceB).replace(/[^\d]/g, "") || 0) - parseInt(String(priceA).replace(/[^\d]/g, "") || 0);
  }).slice(0, 3);

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
      {dbError && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs font-mono flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <span>TELEMETRY_OFFLINE: Database connection interrupted.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
        <div>
           <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-2">Pit Wall Telemetry</h2>
           <p className="text-xs font-mono text-gray-500">System Status: <span className="text-green-500 font-bold">ONLINE</span></p>
        </div>
        <Link href="/admin/inventory/new" className="bg-white text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors text-center shrink-0">
          + Upload Exhibit
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
         <StatCard label="Circuit Value" value={`₹${totalValue.toLocaleString()}`} />
         <StatCard label="Active Fleet" value={cars.length} />
         <StatCard label="Pole Position" value={featuredCount} sub="Featured" />
         <StatCard label="Pit Lane Queue" value={initialOrders.length} highlight sub="Pending Orders" />
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-8">
        
        {/* Sector 01: Genre Performance */}
        <div className="col-span-12 xl:col-span-7 bg-[#111] border border-white/5 rounded-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">{"Sector 01 // Genre Distribution"}</h3>
            <div className="flex gap-2 text-red-600 font-mono text-[10px] animate-pulse">LIVE_FEED</div>
          </div>
          <div className="space-y-6">
            {genreStats.map(([genre, count]) => (
              <div key={genre} className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono uppercase">
                  <span className="text-gray-300">{genre.replace(/_/g, ' ')}</span>
                  <span className="text-red-500">{count} Units</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / cars.length) * 100}%` }}
                    className="h-full bg-red-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector 02 & 03 */}
        <div className="col-span-12 xl:col-span-5 flex flex-col gap-6">
          {/* High Value Podium */}
          <div className="bg-[#111] border border-white/5 rounded-lg p-6 md:p-8 flex-1">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500 mb-8">{"Sector 02 // High Value Podium"}</h3>
            <div className="space-y-4">
              {podium.map((car, index) => (
                <div key={car.id} className="flex items-center gap-4 p-3 bg-white/5 rounded border border-white/5">
                  <span className={`text-xl md:text-2xl font-black italic shrink-0 w-10 ${index === 0 ? 'text-yellow-500' : 'text-gray-500'}`}>
                    0{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase truncate">{car.name}</p>
                    <p className="text-[8px] font-mono text-gray-500 uppercase truncate">
                      {car.brand}{" // "}{car.scale || (car.variants && car.variants.length > 0 ? car.variants[0].scale : 'N/A')}
                    </p>
                  </div>
                  <span className="text-xs font-black italic shrink-0 pr-1">₹{car.price || (car.variants && car.variants.length > 0 ? car.variants[0].price : 0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sector 03: CRITICAL STATUS (Out of stock + Low stock) */}
          <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-500">{"Sector 03 // Critical Stock Alert"}</h3>
            </div>
            
            {criticalItems.length > 0 ? (
              <div className="space-y-4">
                {criticalItems.slice(0, 5).map(car => (
                  <div key={car.id} className="space-y-1">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-[10px] font-mono text-gray-400 uppercase truncate">{car.name}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded shrink-0 ${
                        car.stock === 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {car.stock === 0 ? 'SOLD OUT' : `${car.stock} LEFT`}
                      </span>
                    </div>
                    {car.stock === 0 && (
                      <p className="text-[8px] font-mono text-gray-600 lowercase italic">
                        Not restocking? You may delete this exhibit from inventory.
                      </p>
                    )}
                  </div>
                ))}
                {criticalItems.length > 5 && (
                  <p className="text-[8px] font-mono text-gray-600 text-center uppercase tracking-widest pt-2">
                    + {criticalItems.length - 5} more critical units
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[10px] font-mono text-gray-500 uppercase italic">Stock levels stable. All systems GO.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Data Strip */}
      <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 bg-[#111] border border-white/5 rounded font-mono text-[9px] text-white/30 uppercase italic">
        <div className="flex gap-6">
          <span>DRS: <span className="text-green-500 font-bold">ENABLED</span></span>
          <span>Latency: <span className="text-green-500">14ms</span></span>
        </div>
        <span className="hidden sm:inline animate-pulse">{"--- Telemetry Stream Active ---"}</span>
        <span>{"Temp: 24°C // Optimal"}</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight, sub }) {
  return (
    <div className={`p-6 border rounded-lg transition-all hover:scale-[1.02] ${highlight ? 'bg-white text-black border-white shadow-xl' : 'bg-[#111] border-white/5 text-white'}`}>
       <p className={`text-[9px] font-mono uppercase tracking-widest mb-2 ${highlight ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
       <div className="flex flex-wrap items-baseline gap-2">
         <p className="text-2xl md:text-3xl font-black italic tracking-tighter pr-2 whitespace-nowrap overflow-visible">
            {value}
         </p>
         {sub && <span className="text-[8px] font-mono text-gray-500 uppercase shrink-0">{sub}</span>}
       </div>
    </div>
  )
}