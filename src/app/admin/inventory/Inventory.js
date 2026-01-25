"use client";
import { useState } from "react";
import Link from "next/link";

export default function Inventory({ initialCars }) {
  const [cars, setCars] = useState(initialCars);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exhibit?")) {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      setCars(cars.filter(car => car.id !== id));
    }
  };

  return (
    <div className="p-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
           <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Inventory</h2>
           <p className="text-xs font-mono text-gray-500">System Status: <span className="text-green-500">ONLINE</span></p>
        </div>
        <Link href="/admin/inventory/new" className="bg-white text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
          + Upload Exhibit
        </Link>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden">
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
             {cars.map(car => (
               <tr key={car.id} className="hover:bg-white/5 transition-colors">
                 <td className="px-6 py-4 text-xs font-mono text-gray-500">#{car.id}</td>
                 <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                     <img src={car.images[0]} className="w-8 h-8 object-contain bg-white/5 rounded-sm" />
                     <span className="text-xs font-bold uppercase tracking-tight">{car.name}</span>
                   </div>
                 </td>
                 <td className="px-6 py-4 text-xs font-mono">{car.scale}</td>
                 <td className="px-6 py-4 text-xs font-mono">{car.price}</td>
                 <td className="px-6 py-4">
                    {car.collectionStatus === "FEATURED_EXHIBIT" ? (
                      <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    ) : car.collectionStatus === "NEW_ARRIVAL" ? (
                      car.featured ? (
                        <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                          NA Featured
                        </span>
                      ) : (
                        <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                          New Arrival
                        </span>
                      )
                    ) : (
                      <span className="bg-gray-800 text-gray-400 border border-white/10 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                        Archive
                      </span>
                    )}
                 </td>
                 <td className="px-6 py-4 text-xs font-mono">
                  {car.stock > 0 ? (
                    <span>{car.stock}</span>
                  ) : (
                    <span className="text-red-500 font-bold">{car.stock}</span>
                  )}
                 </td>
                 <td className="px-6 py-4 text-right">
                   <Link href={`/admin/inventory/edit/${car.id}`} className="text-[10px] font-bold uppercase hover:text-white text-gray-500 mr-4">Edit</Link>
                   <button onClick={() => handleDelete(car.id)} className="text-[10px] font-bold uppercase hover:text-red-500 text-gray-500">Delete</button>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
