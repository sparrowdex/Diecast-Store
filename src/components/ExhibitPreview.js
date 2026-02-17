"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CatalogCard from "./CatalogCard";
import StandardCard from "./StandardCard";
import BentoCard from "./BentoCard";
import { UploadButton } from "@uploadthing/react";

// This new helper checks the media object's type property, which is reliable.
const isMediaVideo = (media) => {
  if (!media || !media.type) return false;
  return media.type.startsWith("video/");
};

function InputField({ name, label, value, onChange, placeholder, required = false, type = "text" }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </label>
      <input
        type={type}
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


export default function ExhibitPreview({ formData, orderedMedia, handleChange, carId }) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // The component now expects `orderedMedia` to be an array of {url, type} objects.
  // The fallback to formData is kept for robustness, though it contains only URLs.
  const media = orderedMedia ? orderedMedia : [...(formData.images || []).map(url => ({url, type: 'image'})), ...(formData.video ? [{url: formData.video, type: 'video'}] : [])];

  const previewCar = {
    ...formData,
    id: 'preview',
    images: formData.images,
    image: (formData.images && formData.images.length > 0) ? formData.images[0] : '/cars/maybach.jpg',
    video: formData.video,
  };

  const activeMedia = media[activeMediaIndex] || null;
  const isVideo = isMediaVideo(activeMedia);

  const placeholderCars = [
    { id: 'p1', name: 'Placeholder', brand: 'Brand', price: '₹–––', image: '/cars/maybach.jpg', scale: '1:64' },
    { id: 'p2', name: 'Placeholder', brand: 'Brand', price: '₹–––', image: '/cars/maybach.jpg', scale: '1:32' },
    { id: 'p3', name: 'Placeholder', brand: 'Brand', price: '₹–––', image: '/cars/maybach.jpg', scale: '1:24' },
  ];




  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Left side: Edit Form */}
      <div className="bg-[#111] border border-white/5 rounded-lg p-8 h-fit">
        <h3 className="text-xl font-bold mb-6 text-white">Edit Details</h3>
        <div className="space-y-4">
            <InputField name="name" label="Exhibit Name" value={formData.name} onChange={handleChange} placeholder="e.g., Red Bull Racing RB19" required />
            <InputField name="brand" label="Brand" value={formData.brand} onChange={handleChange} placeholder="e.g., Bburago" required />
            <InputField name="price" label="Price" value={formData.price} onChange={handleChange} placeholder="e.g., 1,400" required />
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Scale</label>
              <select name="scale" value={formData.scale} onChange={handleChange} className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white">
                {['1:64', '1:32', '1:24', '1:18'].map(s => (
                  <option key={s} value={s} className="bg-[#111]">{s}</option>
                ))}
              </select>
            </div>
            <InputField name="modelYear" label="Model Year" type="number" value={formData.modelYear} onChange={handleChange} placeholder="e.g., 2023" />
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Images
              </label>
              <UploadButton
                  endpoint="mediaUploader"
                  onClientUploadComplete={(res) => {
                      if (res) {
                          const newImageUrls = res.map(file => file.ufsUrl || file.url);
                          const updatedImages = [...formData.images, ...newImageUrls];
                          handleChange({ target: { name: 'images', value: updatedImages } });
                      }
                  }}
                  onUploadError={(error) => {
                      alert(`ERROR! ${error.message}`);
                  }}
              />
              {formData.images && formData.images.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-400">Existing Images:</p>
                  {formData.images.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white/5 p-2 rounded">
                      <img src={url} className="w-8 h-8 object-cover rounded" />
                      <span className="text-xs text-gray-300 truncate flex-1">{url.split('/').pop()}</span>
                      <button
                        onClick={() => {
                          const updatedImages = formData.images.filter((_, i) => i !== index);
                          handleChange({ target: { name: 'images', value: updatedImages } });
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Video
              </label>
              <UploadButton
                  endpoint="mediaUploader"
                  onClientUploadComplete={(res) => {
                      if (res) {
                        const newVideoUrls = res.map(file => file.ufsUrl || file.url);
                        const updatedVideo = newVideoUrls[0]
                        handleChange({ target: { name: 'video', value: updatedVideo } });
                      }
                  }}
                  onUploadError={(error) => {
                      alert(`ERROR! ${error.message}`);
                  }}
              />
              {formData.video && (
                <div className="mt-4">
                  <p className="text-xs text-gray-400">Existing Video:</p>
                  <div className="flex items-center gap-2 bg-white/5 p-2 rounded">
                    <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-300 truncate flex-1">{formData.video.split('/').pop()}</span>
                    <button
                      onClick={() => handleChange({ target: { name: 'video', value: '' } })}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
            <InputField name="material" label="Material" value={formData.material} onChange={handleChange} placeholder="e.g., Diecast Metal / ABS" />
            <InputField name="condition" label="Condition" value={formData.condition} onChange={handleChange} placeholder="e.g., Mint (Boxed)" />
            <TextareaField name="description" label="Description" value={formData.description} onChange={handleChange} />
            <TextareaField name="editorsNote" label="Editor's Note" value={formData.editorsNote} onChange={handleChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Collection Status</label>
                <select name="collectionStatus" value={formData.collectionStatus} onChange={handleChange} className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white">
                  <option value="ARCHIVE_CATALOG" className="bg-[#111]">Archive Catalog</option>
                  <option value="NEW_ARRIVAL" className="bg-[#111]">New Arrival</option>
                  <option value="FEATURED_EXHIBIT" className="bg-[#111]">Featured Exhibit</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Genre</label>
                <select name="genre" value={formData.genre} onChange={handleChange} className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white">
                  <option value="CLASSIC_VINTAGE" className="bg-[#111]">Classic & Vintage</option>
                  <option value="RACE_COURSE" className="bg-[#111]">Race Course</option>
                  <option value="CITY_LIFE" className="bg-[#111]">City Life</option>
                  <option value="SUPERPOWERS" className="bg-[#111]">Superpowers</option>
                  <option value="LUXURY_REDEFINED" className="bg-[#111]">Luxury Redefined</option>
                  <option value="OFF_ROAD" className="bg-[#111]">Off-Road</option>
                  <option value="FUTURE_PROOF" className="bg-[#111]">Future Proof</option>
                </select>
              </div>
            </div>
            {formData.collectionStatus === "NEW_ARRIVAL" && (
              <CheckboxField name="featured" label="Mark as Featured in Grid" checked={formData.featured} onChange={handleChange} />
            )}
        </div>
      </div>

      {/* Right side: Live Previews */}
      <div className="space-y-8">
        
        {/* Product Detail Page Preview */}
        <div className="bg-white text-black rounded-lg overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 p-4 bg-gray-50 border-b border-gray-100"> Product Page Preview</h3>
            <div className="h-[40vh] bg-white flex flex-col md:flex-row overflow-hidden relative selection:bg-black selection:text-white">
                <motion.section layout className="w-full md:w-[60%] h-full relative bg-[#f8f8f8] flex items-center justify-center">
                    <AnimatePresence mode="wait">{isVideo ? ( <motion.video
  key={activeMedia.url}
  src={activeMedia.url}
  className="w-full h-full object-contain"
  autoPlay
  loop
  muted
  playsInline
  onError={(e) => console.error('Video Error:', e, e.target.error)}
  onCanPlay={() => console.log('Video can play for src:', activeMedia.url)}
  onStalled={() => console.log('Video stalled for src:', activeMedia.url)}
  onLoadStart={() => console.log('Video load start for src:', activeMedia.url)}
/> ) : ( <motion.img key={activeMedia ? activeMedia.url : 'placeholder'} src={activeMedia ? activeMedia.url : '/cars/maybach.jpg'} className="w-full h-full p-8 object-contain drop-shadow-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /> )}</AnimatePresence>
                    {/* Media Gallery Management */}
                    {media.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-full z-10">
                        {media.map((item, index) => (
                          <button
                            key={item.url}
                            onClick={() => setActiveMediaIndex(index)}
                            className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-colors ${
                              index === activeMediaIndex ? 'border-yellow-500' : 'border-transparent hover:border-black/20'
                            }`}
                          >
                            {isMediaVideo(item) ? (
                              <div className="w-full h-full bg-black flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                              </div>
                            ) : (
                              <img src={item.url} className="w-full h-full object-cover" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                </motion.section>
                <motion.section key={formData.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full md:w-[40%] h-auto md:h-full overflow-y-auto bg-white border-l border-black/5 p-4 flex flex-col text-xs">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 border border-black/10 rounded-full text-[8px] font-mono uppercase text-gray-500">{formData.brand || "Brand"}</span>
                            <span className="px-2 py-0.5 border border-black/10 rounded-full text-[8px] font-mono uppercase text-gray-500">Scale {formData.scale || "1:--"}</span>
                            <span className="px-2 py-0.5 border border-black/10 rounded-full text-[8px] font-mono uppercase text-gray-500">{formData.modelYear || "Year"}</span>
                        </div>
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
                        <div className="flex gap-2">
                          <div className="flex items-center border border-black/10 rounded-md px-3 bg-gray-50">
                            <span className="text-[10px] font-mono text-gray-400 mr-2">QTY</span>
                            <span className="text-xs font-bold">1</span>
                          </div>
                          <button disabled className="flex-1 bg-gray-300 text-gray-500 py-3 font-black text-xs uppercase tracking-[0.3em] rounded-md">Acquire Exhibit</button>
                        </div>
                        <p className="text-[8px] text-center text-gray-400 mt-2 uppercase font-mono tracking-widest">Preview Mode: Acquisition Disabled</p>
                    </div>
                </motion.section>
            </div>
        </div>

        {formData.collectionStatus === 'FEATURED_EXHIBIT' && (
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 my-4">Featured Exhibit Hover Preview</h3>
                <div className="rounded-lg p-8 bg-[#1B1B1B] grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-sm text-center text-gray-400 mb-4 font-mono">Default State</p>
                        <BentoCard car={previewCar} layout="aspect-video" isPreview={true} />
                    </div>
                    <div>
                        <p className="text-sm text-center text-gray-400 mb-4 font-mono">Hover State</p>
                        <BentoCard car={previewCar} layout="aspect-video" isPreview={true} forceHover={true} />
                    </div>
                </div>
            </div>
        )}

        


        {/* HOMEPAGE NEW ARRIVALS PREVIEW */}
        {formData.collectionStatus !== 'FEATURED_EXHIBIT' && (
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

        {/* CATALOG CARD PREVIEW */}
        <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Master Catalog (Dictionary) Preview</h3>
            <div className="rounded-lg p-8 bg-white flex justify-center items-center">
                <div className="w-full max-w-xs">
                  <CatalogCard car={previewCar} isPreview={true} />
                </div>
            </div>
        </div>
        
      </div>
    </div>
  );
}
