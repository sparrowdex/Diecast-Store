"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CARS, FEATURED_EXHIBITS } from "@/data";
import BentoGrid from "@/components/BentoGrid";

const FilterButton = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`px-4 py-1.5 text-[10px] font-mono rounded-full border transition-all uppercase tracking-widest ${active ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'}`}>
    {label}
  </button>
);

function getInitialFormData() {
  if (typeof window === 'undefined') {
    return {
      name: "Preview Exhibit",
      brand: "Brand",
      price: "₹0",
      scale: "1:43",
      image: "",
      video: "",
      material: "",
      condition: "",
      description: "",
      disclaimer: "",
      size: "large",
    };
  }
  const previewData = localStorage.getItem('previewFormData');
  const savedData = localStorage.getItem('diecast_edit_state');
  if (previewData) {
    return JSON.parse(previewData);
  }
  if (savedData) {
    return JSON.parse(savedData);
  }
  return {
    name: "Preview Exhibit",
    brand: "Brand",
    price: "₹0",
    scale: "1:43",
    image: "",
    video: "",
    material: "",
    condition: "",
    description: "",
    disclaimer: "",
    size: "large",
  };
}

export default function GridPreviewPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const car = CARS.find(c => c.id.toString() === id);

  const [layoutPreset, setLayoutPreset] = useState('hero');
  const [previewSlot, setPreviewSlot] = useState(0);
  const [formData, setFormData] = useState(getInitialFormData);

  const layouts = ['hero', 'panorama', 'quad', 'mosaic'];
  const cycleLayout = () => {
    const currentIndex = layouts.indexOf(layoutPreset);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setLayoutPreset(layouts[nextIndex]);
  };

  const previewCar = {
    ...formData,
    id: 'preview',
    image: formData.image || '/cars/placeholder.jpg',
    images: formData.image ? formData.image.split(',').map(img => img.trim()).filter(img => img) : ['/cars/placeholder.jpg'],
    video: formData.video || null,
    isFeatured: true,
    isNew: true,
  };

  // Logic for Bento Grid Preview - ensure the car being edited is included
  const baseCars = (layoutPreset === 'quad' || layoutPreset === 'panorama' || layoutPreset === 'mosaic') ? [...FEATURED_EXHIBITS] : FEATURED_EXHIBITS.slice(0, 3);

  // If the car being edited is not in the base cars, replace one with it for preview (use previewCar if car not found)
  const bentoCars = (car && baseCars.includes(car)) ? baseCars : [...baseCars.slice(0, -1), previewCar];

  // Ensure we have the right number of cars
  const finalBentoCars = (layoutPreset === 'quad' || layoutPreset === 'panorama' || layoutPreset === 'mosaic')
    ? [...bentoCars, bentoCars[0]].slice(0, 4)
    : bentoCars.slice(0, 3);

  const previewBentoLineup = [...finalBentoCars];
  if (previewSlot !== null && previewSlot < previewBentoLineup.length) {
    previewBentoLineup[previewSlot] = previewCar;
  }

  // Allow preview even if car not found, using formData from localStorage

  return (
    <div className="min-h-screen bg-[#111] text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Grid Layout Preview</h1>
          <p className="text-sm font-mono text-gray-400 mt-2">Previewing <span className="text-yellow-500">#{id} - {formData.name}</span> in different grid layouts</p>
        </div>
        <button onClick={() => router.push(`/admin/inventory/edit/${id}?reload=${Date.now()}`)} className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-mono text-sm uppercase tracking-widest">
          ← Back to Edit
        </button>
      </div>

      {/* Layout Controls */}
      <div className="mb-8 flex flex-wrap gap-6 items-center">
        <div className="flex gap-4">
          <span className="text-gray-400 font-mono text-sm uppercase tracking-widest">Layout:</span>
          <FilterButton label="Hero" active={layoutPreset === 'hero'} onClick={() => setLayoutPreset('hero')} />
          <FilterButton label="Panorama" active={layoutPreset === 'panorama'} onClick={() => setLayoutPreset('panorama')} />
          <FilterButton label="Quad" active={layoutPreset === 'quad'} onClick={() => setLayoutPreset('quad')} />
          <FilterButton label="Mosaic" active={layoutPreset === 'mosaic'} onClick={() => setLayoutPreset('mosaic')} />
          <button onClick={cycleLayout} className="px-4 py-1.5 text-[10px] font-mono rounded-full border transition-all uppercase tracking-widest bg-yellow-500 text-black border-yellow-500 hover:bg-yellow-600">
            Cycle Layout
          </button>
        </div>
        <div className="w-[1px] h-8 bg-gray-600"></div>
        <div className="flex gap-4 items-center">
          <span className="text-gray-400 font-mono text-sm uppercase tracking-widest">Preview in Slot:</span>
          {Array.from({ length: (layoutPreset === 'quad' || layoutPreset === 'panorama' || layoutPreset === 'mosaic') ? 4 : 3 }).map((_, index) => (
            <label key={index} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="bento-slot" value={index} checked={previewSlot === index} onChange={() => setPreviewSlot(index)} className="form-radio h-4 w-4 text-yellow-500 bg-gray-800 border-gray-600 focus:ring-yellow-500" />
              <span className="text-gray-300 text-sm">Slot {index + 1}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Large Grid Preview */}
      <div className="bg-[#fafafa] rounded-2xl p-8 min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-7xl">
          <BentoGrid
            cars={previewBentoLineup}
            layout={layoutPreset}
            isPreview={true}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-gray-500 text-sm font-mono">
        <p>This preview shows how your exhibit will appear in the homepage featured grid.</p>
        <p>Use the layout buttons above to test different arrangements.</p>
      </div>
    </div>
  );
}
