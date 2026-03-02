"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Inventory({ initialCars = [] }) {
  const [cars, setCars] = useState(initialCars);
  const [filter, setFilter] = useState("all");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exhibit?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete exhibit');
      
      setCars(prev => prev.filter(car => car.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete the exhibit. Please try again.");
    }
  };

  const filteredAndSortedCars = useMemo(() => {
    let result = [...cars];
    
    if (filter === "sold_out") {
      result = result.filter(car => car.stock === 0);
    } else if (filter === "featured") {
      result = result.filter(car => car.collectionStatus === "FEATURED_EXHIBIT");
    } else if (filter === "new_arrival") {
      result = result.filter(car => car.collectionStatus === "NEW_ARRIVAL" && !car.featured);
    } else if (filter === "na_featured") {
      result = result.filter(car => car.collectionStatus === "NEW_ARRIVAL" && car.featured);
    }

    return result.sort((a, b) => {
      if (a.stock === 0 && b.stock !== 0) return -1;
      if (a.stock !== 0 && b.stock === 0) return 1;
      return 0;
    });
  }, [cars, filter]);

  return (
    // ROOT: Locked firmly to max-w-[100vw]
    <div className="min-h-screen bg-black text-white w-full max-w-[100vw] overflow-x-hidden font-sans box-border">
      
      {/* Inner Wrapper: standard padding on desktop, tight padding on mobile */}
      <div className="w-full px-3 py-4 md:p-8">
        
        {/* HEADER: Stacked layout with smaller text as suggested */}
        <div className="flex flex-col items-start mb-6 border-b border-white/10 pb-5 w-full">
          {/* Scaled down to text-2xl on mobile */}
          <h2 className="text-2xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
            Inventory
          </h2>
          <p className="text-[10px] font-mono text-green-500 mt-1.5 tracking-widest uppercase">
            System: Online
          </p>
          
          {/* Upload Button: w-fit ensures it never forces the container wider than its text */}
          <Link href="/admin/inventory/new" className="mt-4 w-fit bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-none">
            + UPLOAD
          </Link>
        </div>

        {/* FILTER TABS: flex-wrap to let "NA_FEATURED" drop to a new line natively */}
        <div className="flex flex-wrap gap-2 mb-6 w-full">
          <FilterTab active={filter === "all"} onClick={() => setFilter("all")}>All</FilterTab>
          <FilterTab active={filter === "sold_out"} onClick={() => setFilter("sold_out")}>
            Sold ({cars.filter(c => c.stock === 0).length})
          </FilterTab>
          <FilterTab active={filter === "featured"} onClick={() => setFilter("featured")}>Featured</FilterTab>
          <FilterTab active={filter === "new_arrival"} onClick={() => setFilter("new_arrival")}>New</FilterTab>
          <FilterTab active={filter === "na_featured"} onClick={() => setFilter("na_featured")}>NA_Ftr</FilterTab>
        </div>

        {/* MAIN LIST */}
        <div className="flex flex-col gap-2 w-full">
          {filteredAndSortedCars.map(car => (
            <div key={car.id} className="w-full bg-[#0a0a0a] border border-white/5 p-3 flex flex-col gap-3 min-w-0">
              
              {/* Top Half: Details */}
              <div className="flex items-start gap-3 w-full min-w-0">
                <Image 
                  src={car.images?.[0] || '/fallback.png'} 
                  className="w-12 h-12 object-contain bg-white/5 border border-white/10 shrink-0 p-1" 
                  alt="" 
                  width={48}
                  height={48}
                />
                
                <div className="flex flex-col flex-1 min-w-0">
                  <h3 className="text-[11px] font-black uppercase truncate text-white tracking-tight w-full">
                    {car.name}
                  </h3>
                  {/* flex-wrap added here just in case the ID and price get too long */}
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-1.5">
                    <span className="text-[10px] font-mono font-bold text-white">{car.price}</span>
                    <span className="text-[10px] font-mono text-gray-600">|</span>
                    <span className="text-[9px] font-mono text-gray-500 truncate">#{car.id?.slice(-4) || 'N/A'}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right pl-2">
                  {car.stock === 0 ? (
                      <span className="text-[9px] font-black text-red-500 italic uppercase">OUT</span>
                  ) : (
                      <span className="text-[9px] font-mono text-gray-400">Qty: {car.stock}</span>
                  )}
                </div>
              </div>

              {/* Bottom Half: Action Bar */}
              <div className="flex justify-between items-center bg-white/[0.03] border border-white/5 px-2 py-1.5 w-full min-w-0">
                <div className="shrink-0 pr-2">
                  {renderStatus(car)}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Link href={`/admin/inventory/edit/${car.id}`} className="text-[8px] font-black uppercase tracking-widest text-gray-400 bg-white/5 px-3 py-1.5 hover:text-white transition-colors">Edit</Link>
                  <button onClick={() => handleDelete(car.id)} className="text-[8px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1.5 hover:text-red-400 transition-colors">Del</button>
                </div>
              </div>

            </div>
          ))}
          
          {filteredAndSortedCars.length === 0 && (
            <div className="p-8 text-center font-mono text-[10px] text-gray-600 uppercase tracking-widest italic border border-white/5">
              -- No exhibits found --
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterTab({ children, active, onClick }) {
    return (
        <button 
            onClick={onClick} 
            // h-fit prevents flexbox from stretching the button vertically into a giant block
            className={`h-fit shrink-0 whitespace-nowrap px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-colors ${
                active ? 'bg-white text-black border-white' : 'text-gray-500 border-white/10 hover:text-white hover:border-white/30'
            }`}
        >
            {children}
        </button>
    )
}

function renderStatus(car) {
  const style = "h-fit text-[7px] font-black uppercase tracking-widest px-1.5 py-1 shrink-0";
  if (car.collectionStatus === "FEATURED_EXHIBIT") {
    return <span className={`${style} bg-yellow-500/10 text-yellow-500`}>Featured</span>;
  }
  if (car.collectionStatus === "NEW_ARRIVAL") {
    if (car.featured) {
      return <span className={`${style} bg-red-500/10 text-red-500`}>NA Featured</span>;
    }
    return <span className={`${style} bg-blue-500/10 text-blue-500`}>New Arrival</span>;
  }
  return <span className={`${style} bg-white/5 text-gray-400`}>Archive</span>;
}