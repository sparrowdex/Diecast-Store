"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Inventory({ initialCars = [] }) {
  const [cars, setCars] = useState(initialCars);
  const [activeFilter, setActiveFilter] = useState("ACTIVE");
  const router = useRouter();

  const filters = [
    { id: "ACTIVE", label: "All Active" },
    { id: "CATALOG", label: "Catalog" },
    { id: "NEW_ARRIVAL", label: "New Arrivals" },
    { id: "FEATURED", label: "Featured" },
    { id: "ARCHIVED", label: "Archived" },
  ];

  const filteredCars = cars.filter(car => {
    if (activeFilter === "ACTIVE") return car.collectionStatus !== "ARCHIVED";
    if (activeFilter === "ARCHIVED") return car.collectionStatus === "ARCHIVED";
    if (activeFilter === "CATALOG") return car.collectionStatus === "CATALOG";
    if (activeFilter === "NEW_ARRIVAL") return car.collectionStatus === "NEW_ARRIVAL";
    if (activeFilter === "FEATURED") return car.collectionStatus === "FEATURED_EXHIBIT";
    return true;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to archive this exhibit?")) {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCars(cars.map(car => car.id === id ? { ...car, collectionStatus: 'ARCHIVED' } : car));
        router.refresh();
      }
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm("WARNING: This will permanently remove this exhibit from the database. This action cannot be undone. Proceed?")) {
      const res = await fetch(`/api/products/${id}?permanent=true`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCars(cars.filter(car => car.id !== id));
        router.refresh();
      }
    }
  };

  const handleRestore = async (id) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collectionStatus: 'CATALOG' }),
    });
    if (res.ok) {
      const updatedCar = await res.json();
      // Update local state and switch view to Catalog to show the restored item
      setCars(cars.map(car => car.id === id ? updatedCar : car));
      setActiveFilter("CATALOG");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white w-full max-w-[100vw] overflow-x-hidden">
      {/* Container: Matches your original p-12 on desktop, tighter on mobile */}
      <div className="p-4 lg:p-12">
        
        {/* Header: Original Design */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2 leading-none">Inventory</h2>
            <p className="text-xs font-mono text-gray-500">System Status: <span className="text-green-500">ONLINE</span></p>
          </div>
          <Link href="/admin/inventory/new" className="bg-white text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors shrink-0">
            + Upload Exhibit
          </Link>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3 mb-10">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${
                activeFilter === filter.id
                  ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  : "bg-white/5 text-gray-500 border-white/5 hover:border-white/20 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* --- DESKTOP VIEW: Your Original Table --- */}
        <div className="hidden lg:block bg-[#111] border border-white/5 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">All Exhibits</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[9px] font-mono uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3 font-normal">ID</th>
                <th className="px-6 py-3 font-normal">Exhibit Name</th>
                <th className="px-6 py-3 font-normal">Scale</th>
                <th className="px-6 py-3 font-normal">Price</th>
                <th className="px-6 py-3 font-normal">Status</th>
                <th className="px-6 py-3 font-normal">Stock</th>
                <th className="px-6 py-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCars.map(car => (
                <tr key={car.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">#{car.id?.slice(-6)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image src={car.images?.[0] || "/placeholder.png"} alt={car.name} width={32} height={32} className="object-contain bg-white/5 rounded-sm" />
                      <span className="text-xs font-bold uppercase tracking-tight">{car.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">{car.scale}</td>
                  <td className="px-6 py-4 text-xs font-mono">{car.price}</td>
                  <td className="px-6 py-4">
                    <StatusBadge car={car} />
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">
                    {car.stock > 0 ? <span>{car.stock}</span> : <span className="text-red-500 font-bold">{car.stock}</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/inventory/edit/${car.id}`} className="text-[10px] font-bold uppercase hover:text-white text-gray-500 mr-4">Edit</Link>
                    {car.collectionStatus === "ARCHIVED" ? (
                      <>
                        <button onClick={() => handleRestore(car.id)} className="text-[10px] font-bold uppercase hover:text-green-500 text-emerald-500 mr-4">Restore</button>
                        <button onClick={() => handlePermanentDelete(car.id)} className="text-[10px] font-bold uppercase hover:text-red-500 text-red-900/50">Purge</button>
                      </>
                    ) : (
                      <button onClick={() => handleDelete(car.id)} className="text-[10px] font-bold uppercase hover:text-red-500 text-gray-500">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCars.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <p className="text-xs font-mono text-gray-600 uppercase tracking-widest italic">// No exhibits found in this sector</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE VIEW: Card Layout (Prevents Stretching) --- */}
        <div className="lg:hidden flex flex-col gap-3">
          {filteredCars.map(car => (
            <div key={car.id} className="bg-[#111] border border-white/5 p-4 rounded-lg">
              <div className="flex gap-4 mb-4">
                <Image src={car.images?.[0] || "/placeholder.png"} alt={car.name} width={48} height={48} className="object-contain bg-white/5 rounded-sm shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-[11px] font-bold uppercase tracking-tight truncate">{car.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-gray-400">{car.price}</span>
                    <span className="text-[10px] font-mono text-gray-600">|</span>
                    <span className="text-[10px] font-mono text-gray-600">#{car.id?.slice(-4)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <StatusBadge car={car} />
                <div className="flex gap-4">
                  <Link href={`/admin/inventory/edit/${car.id}`} className="text-[10px] font-bold uppercase text-gray-500">Edit</Link>
                  {car.collectionStatus === "ARCHIVED" ? (
                    <>
                      <button onClick={() => handleRestore(car.id)} className="text-[10px] font-bold uppercase text-emerald-500">Restore</button>
                      <button onClick={() => handlePermanentDelete(car.id)} className="text-[10px] font-bold uppercase text-red-900/50">Purge</button>
                    </>
                  ) : (
                    <button onClick={() => handleDelete(car.id)} className="text-[10px] font-bold uppercase text-gray-500">Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredCars.length === 0 && (
            <div className="py-20 text-center border border-white/5 rounded-lg bg-[#111]">
              <p className="text-xs font-mono text-gray-600 uppercase tracking-widest italic">// Sector Empty</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Extracted the status logic to keep the main code clean
function StatusBadge({ car }) {
  if (car.collectionStatus === "FEATURED_EXHIBIT") {
    return (
      <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
        Featured
      </span>
    );
  }
  if (car.collectionStatus === "NEW_ARRIVAL") {
    return car.featured ? (
      <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
        NA Featured
      </span>
    ) : (
      <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
        New Arrival
      </span>
    );
  }
  if (car.collectionStatus === "ARCHIVED") {
    return (
      <span className="bg-red-900/20 text-red-500/50 border border-red-900/30 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
        Archived
      </span>
    );
  }
  return (
    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
      Catalog
    </span>
  );
}