"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function Inventory({ initialCars = [] }) {
  const [cars, setCars] = useState(initialCars);
  const [filter, setFilter] = useState("all");

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exhibit?")) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setCars(cars.filter(car => car.id !== id));
    }
  };

  const filteredAndSortedCars = useMemo(() => {
    let result = [...cars];
    
    // Updated Filter Logic
    if (filter === "sold_out") {
      result = result.filter(car => car.stock === 0);
    } else if (filter === "featured") {
      result = result.filter(car => car.collectionStatus === "FEATURED_EXHIBIT");
    } else if (filter === "new_arrival") {
      result = result.filter(car => car.collectionStatus === "NEW_ARRIVAL" && !car.featured);
    } else if (filter === "na_featured") {
      result = result.filter(car => car.collectionStatus === "NEW_ARRIVAL" && car.featured);
    }

    // Always bubble 0 stock to the top
    return result.sort((a, b) => {
      if (a.stock === 0 && b.stock !== 0) return -1;
      if (a.stock !== 0 && b.stock === 0) return 1;
      return 0;
    });
  }, [cars, filter]);

  return (
    <div className="p-4 md:p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
           <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-2">Inventory</h2>
           <p className="text-xs font-mono text-gray-500">System Status: <span className="text-green-500 font-bold tracking-widest">ONLINE</span></p>
        </div>
        <Link href="/admin/inventory/new" className="bg-white text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors w-full md:w-auto text-center shrink-0">
          + Upload Exhibit
        </Link>
      </div>

      {/* Filter Tabs - Scrollable on Mobile */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
        <FilterTab active={filter === "all"} onClick={() => setFilter("all")}>All</FilterTab>
        <FilterTab active={filter === "sold_out"} onClick={() => setFilter("sold_out")}>
          Sold_Out ({cars.filter(c => c.stock === 0).length})
        </FilterTab>
        <FilterTab active={filter === "featured"} onClick={() => setFilter("featured")}>Featured</FilterTab>
        <FilterTab active={filter === "new_arrival"} onClick={() => setFilter("new_arrival")}>New_Arrivals</FilterTab>
        <FilterTab active={filter === "na_featured"} onClick={() => setFilter("na_featured")}>NA_Featured</FilterTab>
      </div>

      {/* Main Container */}
      <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden">
        
        {/* DESKTOP TABLE HEAD (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-12 bg-white/5 text-[9px] font-mono uppercase text-gray-500 px-6 py-4 tracking-widest border-b border-white/5">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">Exhibit Name</div>
          <div className="col-span-1">Scale</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-center">Stock</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredAndSortedCars.map(car => (
            <div key={car.id} className={`group hover:bg-white/[0.02] transition-colors ${car.stock === 0 ? 'bg-red-500/[0.01]' : ''}`}>
              
              {/* DESKTOP ROW (md and up) */}
              <div className="hidden md:grid grid-cols-12 items-center px-6 py-4">
                <div className="col-span-1 text-xs font-mono text-gray-500">#{car.id.slice(-4)}</div>
                <div className="col-span-4 flex items-center gap-3">
                  <img src={car.images[0]} className="w-8 h-8 object-contain bg-white/5 rounded-sm shrink-0" alt="" />
                  <span className="text-xs font-bold uppercase tracking-tight text-white group-hover:text-red-500 transition-colors">{car.name}</span>
                </div>
                <div className="col-span-1 text-xs font-mono text-gray-400">{car.scale}</div>
                <div className="col-span-2 text-xs font-mono text-center tracking-tighter">{car.price}</div>
                <div className="col-span-2 flex justify-center">{renderStatus(car)}</div>
                <div className="col-span-1 text-xs font-mono text-center">
                   <span className={car.stock === 0 ? "text-red-500 font-bold" : "text-white"}>{car.stock}</span>
                </div>
                <div className="col-span-1 text-right text-[10px] font-bold uppercase space-x-4">
                  <Link href={`/admin/inventory/edit/${car.id}`} className="text-gray-500 hover:text-white transition-colors">Edit</Link>
                  <button onClick={() => handleDelete(car.id)} className="text-gray-500 hover:text-red-600 transition-colors">Delete</button>
                </div>
              </div>

              {/* MOBILE CARD (Below md) */}
              <div className="md:hidden p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    <img src={car.images[0]} className="w-14 h-14 object-contain bg-white/5 rounded p-1 border border-white/5 shrink-0" alt="" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-tight leading-tight text-white break-words">{car.name}</p>
                      <p className="text-[10px] font-mono text-gray-500 mt-1">ID: #{car.id.slice(-6)} // {car.scale}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono font-bold text-white tracking-tighter">{car.price}</p>
                    <div className="mt-1">
                        {car.stock === 0 ? (
                            <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded italic uppercase">Out_Of_Stock</span>
                        ) : (
                            <span className="text-[9px] font-mono text-gray-400">STOCK: {car.stock}</span>
                        )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center bg-white/[0.04] p-3 rounded-md border border-white/5">
                  <div className="shrink-0 scale-90 origin-left">{renderStatus(car)}</div>
                  <div className="flex gap-5 text-[10px] font-black uppercase tracking-widest">
                    <Link href={`/admin/inventory/edit/${car.id}`} className="text-blue-400 hover:text-blue-300">Edit</Link>
                    <button onClick={() => handleDelete(car.id)} className="text-red-500 hover:text-red-400">Delete</button>
                  </div>
                </div>
              </div>

            </div>
          ))}
          {filteredAndSortedCars.length === 0 && (
             <div className="p-12 text-center font-mono text-xs text-gray-600 uppercase tracking-widest italic">
                -- No exhibits found in this sector --
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for Tabs
function FilterTab({ children, active, onClick }) {
    return (
        <button 
            onClick={onClick} 
            className={`px-5 py-2.5 text-[10px] font-mono uppercase tracking-widest border transition-all whitespace-nowrap rounded-sm ${
                active ? 'bg-white text-black border-white shadow-lg' : 'text-gray-500 border-white/10 hover:border-white/20 hover:text-gray-300'
            }`}
        >
            {children}
        </button>
    )
}

// Global Helper for Status Logic
function renderStatus(car) {
  if (car.collectionStatus === "FEATURED_EXHIBIT") {
    return <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Featured</span>;
  }
  if (car.collectionStatus === "NEW_ARRIVAL") {
    if (car.featured) {
      return <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">NA Featured</span>;
    }
    return <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">New Arrival</span>;
  }
  return <span className="bg-gray-800 text-gray-400 border border-white/10 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Archive</span>;
}