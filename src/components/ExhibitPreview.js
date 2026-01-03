"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CatalogCard from "./CatalogCard";
import StandardCard from "./StandardCard";
import BentoCard from "./BentoCard";
import { UploadButton } from "@uploadthing/react";

function InputField({ name, label, value, onChange, placeholder, required = false }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
function CheckboxField({ name, label, checked, onChange }) {
    return (
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-md">
            <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} className="h-4 w-4 rounded bg-white/10 border-gray-600 text-yellow-500 focus:ring-yellow-500" />
            <label htmlFor={name} className="text-sm text-gray-300">{label}</label>
        </div>
    );
}
function TextareaField({ name, label, value, onChange, placeholder, rows = 4 }) {
    return (
      <div className="md:col-span-2">
        <label htmlFor={name} className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          {label}
        </label>
        <textarea id={name} name={name} rows={rows} value={value} onChange={onChange} className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder={placeholder}></textarea>
      </div>
    );
}


export default function ExhibitPreview({ formData, handleChange, handleImageChange, carId }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const previewCar = {
    ...formData,
    id: 'preview',
    images: formData.images,
    image: formData.images[0] || '/cars/placeholder.jpg', // Primary image for CatalogCard
    isNew: formData.category === 'New Arrival',
    isFeatured: formData.featured,
  };

  const primaryMedia = formData.images[activeImageIndex] || null;
  const isVideo = primaryMedia && primaryMedia.endsWith('.mp4');

  const placeholderCars = [
    { id: 'p1', name: 'Placeholder', brand: 'Brand', price: '₹–––', image: '/cars/placeholder.jpg', scale: '1:43' },
    { id: 'p2', name: 'Placeholder', brand: 'Brand', price: '₹–––', image: '/cars/placeholder.jpg', scale: '1:18' },
    { id: 'p3', name: 'Placeholder', brand: 'Brand', price: '₹–––', image: '/cars/placeholder.jpg', scale: '1:43' },
  ];




  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Left side: Edit Form */}
      <div className="bg-[#111] border border-white/5 rounded-lg p-8 h-fit">
        <h3 className="text-xl font-bold mb-6 text-white">Edit Details</h3>
        <div className="space-y-4">
            <InputField name="name" label="Exhibit Name" value={formData.name} onChange={handleChange} placeholder="e.g., Red Bull Racing RB19" required />
            <InputField name="brand" label="Brand" value={formData.brand} onChange={handleChange} placeholder="e.g., Bburago" required />
            <InputField name="price" label="Price" value={formData.price} onChange={handleChange} placeholder="e.g., ₹1,400" required />
            <InputField name="scale" label="Scale" value={formData.scale} onChange={handleChange} placeholder="e.g., 1:43" required />
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Images
              </label>
              <UploadButton
                  endpoint="mediaUploader"
                  onClientUploadComplete={(res) => {
                      if (res) {
                          const newImageUrls = res.map(file => file.ufsUrl);
                          const updatedImages = [...formData.images, ...newImageUrls];
                          handleImageChange({ target: { value: updatedImages.join(', ') } });
                      }
                  }}
                  onUploadError={(error) => {
                      alert(`ERROR! ${error.message}`);
                  }}
              />

            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Video
              </label>
              <UploadButton
                  endpoint="mediaUploader"
                  onClientUploadComplete={(res) => {
                      if (res) {
                        const newVideoUrls = res.map(file => file.ufsUrl);
                        const updatedVideo = newVideoUrls[0]
                        handleChange({ target: { name: 'video', value: updatedVideo } });
                      }
                  }}
                  onUploadError={(error) => {
                      alert(`ERROR! ${error.message}`);
                  }}
              />
            </div>
            <InputField name="material" label="Material" value={formData.material} onChange={handleChange} placeholder="e.g., Diecast Metal / ABS" />
            <InputField name="condition" label="Condition" value={formData.condition} onChange={handleChange} placeholder="e.g., Mint (Boxed)" />
            <TextareaField name="description" label="Description" value={formData.description} onChange={handleChange} />
            <TextareaField name="editorsNote" label="Editor's Note" value={formData.editorsNote} onChange={handleChange} />
            <CheckboxField name="featured" label="Mark as Featured in Grid" checked={formData.featured} onChange={handleChange} />
        </div>
      </div>

      {/* Right side: Live Previews */}
      <div className="space-y-8">
        
        {/* Product Detail Page Preview */}
        <div className="bg-white text-black rounded-lg overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 p-4 bg-gray-50 border-b border-gray-100"> Product Page Preview</h3>
            <div className="h-[40vh] bg-white flex flex-col md:flex-row overflow-hidden relative selection:bg-black selection:text-white">
                <motion.section layout className="w-full md:w-[60%] h-full relative bg-[#f8f8f8] flex items-center justify-center">
                    <AnimatePresence mode="wait">{isVideo ? ( <motion.video key={primaryMedia} layoutId="car-image-preview" src={primaryMedia} className="w-full h-full object-contain" autoPlay loop muted playsInline initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}/> ) : ( <motion.img key={primaryMedia || 'placeholder'} layoutId="car-image-preview" src={primaryMedia || '/cars/placeholder.jpg'} className="w-[70%] h-[70%] p-8 object-contain drop-shadow-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /> )}</AnimatePresence>
                    {/* Image Navigation Dots */}
                    {formData.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {formData.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === activeImageIndex ? 'bg-yellow-500' : 'bg-white/50 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                </motion.section>
                <motion.section key={formData.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full md:w-[40%] h-auto md:h-full overflow-y-auto bg-white border-l border-black/5 p-4 flex flex-col text-xs">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3"><span className="px-2 py-0.5 border border-black/10 rounded-full text-[8px] font-mono uppercase text-gray-500">{formData.brand || "Brand"}</span><span className="px-2 py-0.5 border border-black/10 rounded-full text-[8px] font-mono uppercase text-gray-500">Scale {formData.scale || "1:--"}</span></div>
                        <h1 className="text-lg font-black italic tracking-tighter uppercase leading-[0.9] mb-4">{formData.name || "Exhibit Name"}</h1>
                        <div className="h-px w-full bg-black/5 my-4" />
                        <div className="space-y-4">
                            <div><h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</h3><p className="text-xs font-light leading-relaxed text-gray-600">{formData.description || "Description preview..."}</p></div>
                            <div className="grid grid-cols-2 gap-2"><div className="p-2 bg-gray-50 rounded-sm"><p className="text-[8px] uppercase text-gray-400 tracking-widest mb-1">Material</p><p className="text-xs font-bold">{formData.material || "N/A"}</p></div><div className="p-2 bg-gray-50 rounded-sm"><p className="text-[8px] uppercase text-gray-400 tracking-widest mb-1">Condition</p><p className="text-xs font-bold">{formData.condition || "N/A"}</p></div></div>
                            <div><h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Editor&apos;s Note</h3><p className="text-xs font-light leading-relaxed text-gray-600">{formData.editorsNote || "Editor's Note preview..."}</p></div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-black/5 sticky bottom-0 bg-white/95 backdrop-blur">
                        <div className="flex justify-between items-end mb-2"><span className="text-[10px] uppercase text-gray-400 tracking-widest">Valuation</span><span className="text-2xl font-black italic tracking-tighter">₹{formData.price || "0"}</span></div>
                        <button disabled className="w-full bg-gray-300 text-gray-500 py-3 font-black text-xs uppercase tracking-[0.3em] rounded-md">Acquire Exhibit</button>
                    </div>
                </motion.section>
            </div>
        </div>
        
        {/* HOMEPAGE NEW ARRIVALS PREVIEW */}
        <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Homepage New Arrivals Grid Preview</h3>
            <div className="rounded-lg p-8 bg-[#fafafa]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <StandardCard car={previewCar} isPreview={true} />
                    {placeholderCars.map(car => (
                        <StandardCard key={car.id} car={car} isPreview={true} />
                    ))}
                </div>
            </div>
        </div>

        {/* CATALOG CARD PREVIEW */}
        <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Catalog Card Preview</h3>
            <div className="rounded-lg p-8 bg-white flex justify-center items-center">
                <div className="w-full max-w-xs">
                  <CatalogCard car={previewCar} />
                </div>
            </div>
        </div>
        
      </div>
    </div>
  );
}
