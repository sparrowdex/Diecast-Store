"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard({ initialCars, initialOrders = [], dbError = false }) {
  const [cars, setCars] = useState(initialCars);

  // Stats Calculation
  const totalValue = cars.reduce((acc, car) => acc + parseInt(car.price.replace(/[^\d]/g, "")), 0);
  const featuredCount = cars.filter(c => c.featured).length;
  const lowStockCars = cars.filter(c => c.stock < 3 && c.stock > 0);
  const outOfStockCount = cars.filter(c => c.stock === 0).length;

  // Genre Distribution Telemetry
  const genreStats = useMemo(() => {
    const stats = {};
    cars.forEach(car => {
      if (car.genre) {
        stats[car.genre] = (stats[car.genre] || 0) + 1;
      }
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [cars]);

  // The Podium (Top 3 by Price/Value)
  const podium = [...cars].sort((a, b) => 
    parseInt(b.price.replace(/[^\d]/g, "")) - parseInt(a.price.replace(/[^\d]/g, ""))
  ).slice(0, 3);

  return (
    <div className="p-12">
      {dbError && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs font-mono flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <span>TELEMETRY_OFFLINE: Database connection interrupted. Data shown may be incomplete.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
           <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Pit_Wall_Telemetry</h2>
           <p className="text-xs font-mono text-gray-500">System Status: <span className="text-green-500">ONLINE</span></p>
        </div>
        <Link href="/admin/inventory/new" className="bg-white text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
          + Upload Exhibit
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-12">
         <StatCard label="Circuit_Value" value={`₹${totalValue.toLocaleString()}`} />
         <StatCard label="Active_Fleet" value={cars.length} />
         <StatCard label="Pole_Position" value={featuredCount} sub="Featured" />
         <StatCard label="Pit_Lane_Queue" value={initialOrders.length} highlight sub="Pending Orders" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Sector 1: Genre Performance (Bar Chart) */}
        <div className="col-span-12 lg:col-span-7 bg-[#111] border border-white/5 rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">Sector_01 // Genre_Distribution</h3>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-red-600" />
              <div className="w-2 h-2 bg-white/20" />
            </div>
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

        {/* Sector 2: The Podium (Top Value Exhibits) */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-lg p-8">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500 mb-8">Sector_02 // High_Value_Podium</h3>
            <div className="space-y-4">
              {podium.map((car, index) => (
                <div key={car.id} className="flex items-center gap-4 p-3 bg-white/5 rounded border border-white/5">
                  <span className={`text-xl font-black italic ${index === 0 ? 'text-yellow-500' : 'text-gray-500'}`}>
                    0{index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase truncate">{car.name}</p>
                    <p className="text-[8px] font-mono text-gray-500 uppercase">{car.brand} // {car.scale}</p>
                  </div>
                  <span className="text-xs font-black italic">₹{car.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sector 3: Critical Fuel (Low Stock Alerts) */}
          <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-500">Sector_03 // Critical_Fuel_Alert</h3>
            </div>
            {lowStockCars.length > 0 ? (
              <div className="space-y-3">
                {lowStockCars.slice(0, 3).map(car => (
                  <div key={car.id} className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-400 uppercase truncate max-w-[150px]">{car.name}</span>
                    <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                      {car.stock} LEFT
                    </span>
                  </div>
                ))}
                {lowStockCars.length > 3 && (
                  <p className="text-[8px] font-mono text-gray-600 text-center mt-4">+{lowStockCars.length - 3} MORE CRITICAL ITEMS</p>
                )}
              </div>
            ) : (
              <p className="text-[10px] font-mono text-gray-500 uppercase italic">All systems optimal. Stock levels stable.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Data Strip */}
      <div className="mt-12 flex justify-between items-center px-6 py-3 bg-[#111] border border-white/5 rounded font-mono text-[9px] text-white/30 uppercase italic">
        <div className="flex gap-6">
          <span>DRS: <span className="text-green-500">ENABLED</span></span>
          <span>Out_of_Stock: <span className={outOfStockCount > 0 ? "text-red-500" : ""}>{outOfStockCount}</span></span>
        </div>
        <span className="animate-pulse">--- Telemetry Stream Active ---</span>
        <span>Temp: 24°C // Optimal</span>
      </div>
    </div>
  );
}

// Simple KPI Component
function StatCard({ label, value, highlight, sub }) {
  return (
    <div className={`p-6 border rounded-lg transition-all hover:scale-[1.02] ${highlight ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-[#111] border-white/5 text-white'}`}>
       <p className={`text-[9px] font-mono uppercase tracking-widest mb-2 ${highlight ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
       <div className="flex items-baseline gap-2">
         <p className="text-3xl font-black italic tracking-tighter">{value}</p>
         {sub && <span className="text-[8px] font-mono text-gray-500 uppercase">{sub}</span>}
       </div>
    </div>
  )
}
