"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { FEATURED_EXHIBITS } from "@/data"; // Import live data
import CatalogCard from "./CatalogCard";
import StandardCard from "./StandardCard";
import BentoGrid from "./BentoGrid";

const FilterButton = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`px-4 py-1.5 text-[10px] font-mono rounded-full border transition-all uppercase tracking-widest ${active ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'}`}>
        {label}
    </button>
);

// ... (Reusable components remain the same)
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


export default function ExhibitPreview({ formData, handleChange, handleImageReorder, carId }) {
  const [draggedItem, setDraggedItem] = useState(null);

  // ... (drag and drop handlers remain the same)
  const images = formData.image ? formData.image.split(',').map(img => img.trim()).filter(img => img) : [];
  const videos = formData.video ? formData.video.split(',').map(vid => vid.trim()).filter(vid => vid) : [];
  const mediaItems = [...images, ...videos];
  const handleDragStart = (e, index) => { setDraggedItem(mediaItems[index]); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e, index) => { e.preventDefault(); const draggedOverItem = mediaItems[index]; if (draggedItem === draggedOverItem) { return; } let items = mediaItems.filter(item => item !== draggedItem); items.splice(index, 0, draggedItem); const newImages = items.filter(item => !item.endsWith('.mp4')).join(', '); const newVideos = items.filter(item => item.endsWith('.mp4')).join(', '); handleChange({ target: { name: 'image', value: newImages } }); handleChange({ target: { name: 'video', value: newVideos } }); };
  const handleDragEnd = () => { setDraggedItem(null); };

  const previewCar = {
    ...formData,
    id: 'preview',
    image: images[0] || '/cars/placeholder.jpg',
    images: images.length > 0 ? images : ['/cars/placeholder.jpg'],
    video: videos[0] || null,
    isFeatured: formData.isFeatured,
    isNew: true,
  };

  const primaryMedia = mediaItems[0] || null;
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
            {/* ... (input fields remain the same) ... */}
            <InputField name="name" label="Exhibit Name" value={formData.name} onChange={handleChange} placeholder="e.g., Red Bull Racing RB19" required />
            <InputField name="brand" label="Brand" value={formData.brand} onChange={handleChange} placeholder="e.g., Bburago" required />
            <InputField name="price" label="Price" value={formData.price} onChange={handleChange} placeholder="e.g., ₹1,400" required />
            <InputField name="scale" label="Scale" value={formData.scale} onChange={handleChange} placeholder="e.g., 1:43" required />
            <TextareaField name="image" label="Image URL(s)" value={formData.image} onChange={handleChange} placeholder="e.g., /cars/rb19.jpg, /cars/rb19_2.jpg" />
            <TextareaField name="video" label="Video URL(s)" value={formData.video} onChange={handleChange} placeholder="e.g., /videos/rb19-demo.mp4" />
            <InputField name="material" label="Material" value={formData.material} onChange={handleChange} placeholder="e.g., Diecast Metal / ABS" />
            <InputField name="condition" label="Condition" value={formData.condition} onChange={handleChange} placeholder="e.g., Mint (Boxed)" />
            <TextareaField name="description" label="Description" value={formData.description} onChange={handleChange} />
            <TextareaField name="disclaimer" label="Editor's Note (Disclaimer)" value={formData.disclaimer} onChange={handleChange} rows={3} />
            <div>
              <label htmlFor="size" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Homepage Placement
              </label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all appearance-none"
              >
                <option value="large">Featured Exhibit (Main)</option>
                <option value="medium">Featured Exhibit (Other)</option>
                <option value="small">New Arrivals & Featured Grid</option>
              </select>
            </div>
            {formData.size === 'small' && (
                <CheckboxField name="isFeatured" label="Mark as Featured in Grid" checked={formData.isFeatured} onChange={handleChange} />
            )}
        </div>
      </div>

      {/* Right side: Live Previews */}
      <div className="space-y-8">
        
        {/* Product Detail Page Preview */}
        <div className="bg-white text-black rounded-lg overflow-hidden">
            {/* ... (this section is unchanged) ... */}
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 p-4 bg-gray-50 border-b border-gray-100">Product Page Preview</h3>
            <div className="h-[40vh] bg-white flex flex-col md:flex-row overflow-hidden relative selection:bg-black selection:text-white">
                <motion.section layout className="w-full md:w-[60%] h-full relative bg-[#f8f8f8] flex items-center justify-center">
                    <AnimatePresence mode="wait">{isVideo ? ( <motion.video key={primaryMedia} layoutId="car-image-preview" src={primaryMedia} className="w-full h-full object-contain" autoPlay loop muted playsInline initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}/> ) : ( <motion.img key={primaryMedia || 'placeholder'} layoutId="car-image-preview" src={primaryMedia || '/cars/placeholder.jpg'} className="w-[70%] h-[70%] p-8 object-contain drop-shadow-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /> )}</AnimatePresence>
                </motion.section>
                <motion.section key={formData.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full md:w-[40%] h-auto md:h-full overflow-y-auto bg-white border-l border-black/5 p-4 flex flex-col text-xs">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3"><span className="px-2 py-0.5 border border-black/10 rounded-full text-[8px] font-mono uppercase text-gray-500">{formData.brand || "Brand"}</span><span className="px-2 py-0.5 border border-black/10 rounded-full text-[8px] font-mono uppercase text-gray-500">Scale {formData.scale || "1:--"}</span></div>
                        <h1 className="text-lg font-black italic tracking-tighter uppercase leading-[0.9] mb-4">{formData.name || "Exhibit Name"}</h1>
                        <div className="h-[1px] w-full bg-black/5 my-4" />
                        <div className="space-y-4">
                            <div><h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</h3><p className="text-xs font-light leading-relaxed text-gray-600">{formData.description || "Description preview..."}</p></div>
                            <div className="grid grid-cols-2 gap-2"><div className="p-2 bg-gray-50 rounded-sm"><p className="text-[8px] uppercase text-gray-400 tracking-widest mb-1">Material</p><p className="text-xs font-bold">{formData.material || "N/A"}</p></div><div className="p-2 bg-gray-50 rounded-sm"><p className="text-[8px] uppercase text-gray-400 tracking-widest mb-1">Condition</p><p className="text-xs font-bold">{formData.condition || "N/A"}</p></div></div>
                            <div><h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Editor's Note</h3><p className="text-xs font-light leading-relaxed text-gray-500 bg-gray-50 p-2 rounded-md border border-gray-100">{formData.disclaimer || "No note provided."}</p></div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-black/5 sticky bottom-0 bg-white/95 backdrop-blur">
                        <div className="flex justify-between items-end mb-2"><span className="text-[10px] uppercase text-gray-400 tracking-widest">Valuation</span><span className="text-2xl font-black italic tracking-tighter">{formData.price || "₹0"}</span></div>
                        <button disabled className="w-full bg-gray-300 text-gray-500 py-3 font-black text-xs uppercase tracking-[0.3em] rounded-md">Acquire Exhibit</button>
                    </div>
                </motion.section>
            </div>
        </div>
        
        {/* HOMEPAGE BENTO GRID PREVIEW LINK */}
        {(formData.size === 'large' || formData.size === 'medium') && (
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Homepage Featured Grid Preview</h3>
                <div className="rounded-lg p-8 bg-[#fafafa] text-center">
                    <p className="text-gray-600 mb-6">Preview how this exhibit will appear in the homepage featured grid with different layouts.</p>
                    <Link
                        href={`/admin/inventory/edit/${carId}/grid-preview`}
                        onClick={() => localStorage.setItem('previewFormData', JSON.stringify(formData))}
                        className="inline-block px-8 py-4 bg-yellow-500 text-black font-bold text-sm uppercase tracking-widest rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        Open Full Grid Preview →
                    </Link>
                </div>
            </div>
        )}

        {/* HOMEPAGE NEW ARRIVALS PREVIEW */}
        {formData.size === 'small' && (
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
        )}

        {/* CATALOG PAGE PREVIEW */}
        <div>
           <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Catalog Page Preview</h3>
            <div className="rounded-lg p-8 flex items-center justify-center bg-[#fafafa]">
                <div className="w-64">
                    <CatalogCard car={previewCar} />
                </div>
           </div>
        </div>


        {/* MEDIA ORDER PREVIEW */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Media Order</h3>
          <div className="bg-[#111] border border-white/5 rounded-lg p-4">
            <div className="flex justify-start gap-2 flex-wrap">
              {mediaItems.map((item, index) => (
                <div key={index} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className="w-20 h-20 rounded-md bg-white p-1 border border-gray-700 cursor-grab active:cursor-grabbing" >
                  {item.endsWith('.mp4') ? ( <div className="w-full h-full bg-black flex items-center justify-center rounded-sm"> <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 011.45.89v2.22a1 1 0 01-1.45.89L15 12M4 6h11a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" /></svg> </div> ) 
                  : ( <img src={item} className="w-full h-full object-cover rounded-sm" /> )}
                </div>
              ))}
              {mediaItems.length === 0 && <p className="text-xs text-gray-500">No media provided.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
