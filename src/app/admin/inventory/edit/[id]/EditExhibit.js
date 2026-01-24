"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExhibitPreview from "@/components/ExhibitPreview";

export default function EditExhibit({ car }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: car?.name || "",
    brand: car?.brand || "",
    price: car?.price || "",
    scale: car?.scale || "1:64",
    images: car?.images || [],
    video: car?.video || "",
    material: car?.material || "",
    condition: car?.condition || "",
    description: car?.description || "",
    editorsNote: car?.editorsNote || "",
    featured: car?.featured || false,
    collectionStatus: car?.collectionStatus || "ARCHIVE_CATALOG",
    genre: car?.genre || "CITY_LIFE",
    modelYear: car?.modelYear || new Date().getFullYear(),
    stock: car?.stock || 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    // Ensure numeric fields are sent as integers for Prisma
    if (name === 'modelYear' || name === 'stock') {
      val = parseInt(value) || 0;
    }

    setFormData(prev => ({ ...prev, [name]: val }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/products/${car.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    router.push("/admin/inventory");
  };

  return (
    <div className="p-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Edit Exhibit</h2>
          <p className="text-xs font-mono text-gray-500">Editing <span className="font-bold text-white">#{car.id} - {car.name}</span></p>
        </div>
      </div>

      {/* Form & Preview */}
      <form onSubmit={handleSubmit}>
        <ExhibitPreview formData={formData} handleChange={handleChange} carId={car.id} />
        
        {/* Form Actions */}
        <div className="px-8 py-4 bg-[#111] border border-white/5 flex justify-end gap-4 mt-[-8px] rounded-b-lg">
            <Link href="/admin/inventory" className="text-gray-400 px-6 py-2 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
                Cancel
            </Link>
            <button type="submit" className="bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
                Update Exhibit
            </button>
        </div>
      </form>
    </div>
  );
}