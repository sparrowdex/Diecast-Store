"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExhibitPreview from "@/components/ExhibitPreview";
import CatalogCard from "@/components/CatalogCard";
import NewArrivalCardPreview from "@/components/NewArrivalCardPreview";
import { UploadButton } from "@uploadthing/react";

// --- Layout Configurations for Mini-Maps and Main Grid (Step 3) ---
const layoutConfigs = [
  {
    name: "hero",
    label: "Hero Layout",
    miniMapGrid: "grid-cols-3 grid-rows-2",
    miniMapSlots: ["col-span-2 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1"],
    mainGrid: "grid-cols-12 grid-rows-2",
    mainSlots: ["col-span-8 row-span-2", "col-span-4 row-span-1", "col-span-4 row-span-1", "col-span-4 row-span-1"],
  },
  {
    name: "panorama",
    label: "Panorama Layout",
    miniMapGrid: "grid-cols-3 grid-rows-2",
    miniMapSlots: ["col-span-3 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1"],
    mainGrid: "grid-cols-12 grid-rows-2",
    mainSlots: ["col-span-12 row-span-1", "col-span-4 row-span-1", "col-span-4 row-span-1", "col-span-4 row-span-1"],
  },
  {
    name: "quad",
    label: "Quad Layout",
    miniMapGrid: "grid-cols-2 grid-rows-2",
    miniMapSlots: ["col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1"],
    mainGrid: "grid-cols-12 grid-rows-2",
    mainSlots: ["col-span-6 row-span-1", "col-span-6 row-span-1", "col-span-6 row-span-1", "col-span-6 row-span-1"],
  },
  {
    name: "mosaic",
    label: "Mosaic Layout",
    miniMapGrid: "grid-cols-2 grid-rows-2",
    miniMapSlots: ["col-span-1 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1"],
    mainGrid: "grid-cols-12 grid-rows-2",
    mainSlots: ["col-span-6 row-span-2", "col-span-6 row-span-1", "col-span-6 row-span-1", "col-span-6 row-span-1"],
  },
];

export default function NewExhibitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [previouslyFeaturedExhibits, setPreviouslyFeaturedExhibits] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    scale: "",
    images: [],
    video: "",
    material: "",
    condition: "",
    description: "",
    editorsNote: "",
    featured: false,
    category: "Archive",
    stock: 1,
    layoutType: "hero",
    targetSlot: null,
  });

  // Bento Placement State
  const [selectedLayout, setSelectedLayout] = useState("hero");
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Drag & Drop State
  const [reorderedImages, setReorderedImages] = useState([]);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // Sync reorderedImages when formData.images changes
  useEffect(() => {
    setReorderedImages(formData.images);
  }, [formData.images]);

  // Mock Fetch for Bento Grid Context
  useEffect(() => {
    const fetchFeaturedExhibits = async () => {
      const mockFeaturedExhibits = [
        { id: 'ferrari', image: '/cars/ferrari.jpg', name: 'Ferrari SF90' },
        { id: 'porsche', image: '/cars/porsche.jpg', name: 'Porsche 911' },
      ];
      setPreviouslyFeaturedExhibits(mockFeaturedExhibits);
    };
    fetchFeaturedExhibits();
  }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = (res) => {
    if (res) {
      const newImageUrls = res.map(file => file.ufsUrl);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImageUrls] }));
      alert(`${res.length} image(s) uploaded.`);
    }
  };

  const handleImageChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, images: value.split(',').map(url => url.trim()) }));
  };

  const handleVideoUpload = (res) => {
    if (res) {
      setFormData(prev => ({ ...prev, video: res[0].ufsUrl }));
      alert(`Video uploaded.`);
    }
  };

  // Drag and Drop Logic
  const handleSort = useCallback(() => {
    let _reorderedImages = [...reorderedImages];
    const draggedItemContent = _reorderedImages.splice(dragItem.current, 1)[0];
    _reorderedImages.splice(dragOverItem.current, 0, draggedItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    
    setReorderedImages(_reorderedImages);
    setFormData(prev => ({ ...prev, images: _reorderedImages }));
  }, [reorderedImages]);

  const handleDeleteImage = (indexToDelete) => {
      const updated = reorderedImages.filter((_, i) => i !== indexToDelete);
      setReorderedImages(updated);
      setFormData(prev => ({ ...prev, images: updated }));
  };

  // Navigation Logic
  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (formData.category === "Featured") {
        setStep(3);
      } else {
        handleSubmit(null, true);
      }
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleLayoutSelect = (name) => {
      setSelectedLayout(name);
      setFormData(prev => ({...prev, layoutType: name, targetSlot: null}));
      setSelectedSlot(null);
  };

  const handleSubmit = async (e, finalSubmit = true) => {
    if (e) e.preventDefault();
    const dataToSend = { ...formData, images: reorderedImages };
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      // Invalidate the cache or refetch the data on the inventory page
      // This is a more advanced concept, for now, we'll just redirect
      if (finalSubmit) {
        router.push("/admin/inventory");
      }

    } catch (error) {
      console.error("Failed to create exhibit:", error);
      alert("Failed to create exhibit. Check the console for more details.");
    }
  };

  return (
    <div className="p-12 text-white">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
            {step === 1 ? "New Exhibit" : step === 2 ? "Preview & Edit Exhibit" : "Bento Grid Placement"}
          </h2>
          <p className="text-xs font-mono text-gray-500">
            {step === 1 ? "Add a new model to the gallery database." 
            : step === 2 ? "Visualize, edit, and confirm details." 
            : "Choose layout position for featured exhibit."}
          </p>
        </div>
      </div>

      {/* --- STEP 1: INITIAL DATA ENTRY --- */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="bg-[#111] border border-white/5 rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           <InputField name="name" label="Exhibit Name" value={formData.name} onChange={handleChange} placeholder="e.g., Red Bull RB19" required />
           <InputField name="brand" label="Brand" value={formData.brand} onChange={handleChange} placeholder="e.g., Bburago" required />
           <InputField name="price" label="Price" value={formData.price} onChange={handleChange} placeholder="e.g., 1400" required />
           <InputField name="scale" label="Scale" value={formData.scale} onChange={handleChange} placeholder="e.g., 1:43" required />
           
           <div>
             <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Images</label>
             <UploadButton endpoint="mediaUploader" onClientUploadComplete={handleImageUpload} />
             <p className="text-xs text-gray-500 mt-2">{formData.images.length} images uploaded</p>
           </div>
           
           <div>
             <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Video (Optional)</label>
             <UploadButton endpoint="mediaUploader" onClientUploadComplete={handleVideoUpload} />
           </div>

           <InputField name="material" label="Material" value={formData.material} onChange={handleChange} />
           <InputField name="condition" label="Condition" value={formData.condition} onChange={handleChange} />
           
           <div className="md:col-span-2">
             <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
             <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white" />
           </div>

           <div className="md:col-span-2">
             <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Editor&apos;s Note</label>
             <textarea name="editorsNote" rows="2" value={formData.editorsNote} onChange={handleChange} className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white" />
           </div>

           <div className="md:col-span-2">
                <InputField name="stock" label="Stock" value={formData.stock} onChange={handleChange} type="number" />
           </div>

           <div className="md:col-span-2">
             <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Category</label>
             <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white">
               <option value="Archive">Archive Collection</option>
               <option value="Featured">Featured Exhibit</option>
               <option value="New Arrival">New Arrival</option>
             </select>
           </div>

           <div className="md:col-span-2 flex justify-end gap-4 mt-4 border-t border-white/5 pt-4">
             <Link href="/admin/inventory" className="text-gray-400 px-6 py-2 font-bold text-xs uppercase tracking-widest">Cancel</Link>
             <button type="submit" className="bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200">Next: Preview</button>
           </div>
        </form>
      )}

      {/* --- STEP 2: PREVIEW & MANAGE (Full Width / Stretched) --- */}
                    {step === 2 && (
                      <div className="space-y-12">
                        
                        {/* 1. Media Gallery Management (Full Width) */}
                        <div className="bg-[#111] border border-white/5 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                              <h3 className="text-xl font-bold text-white">Media Gallery Management</h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-6">Drag and drop to reorder images. The first image will be the cover image.</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                              {reorderedImages.map((img, idx) => (
                                <div 
                                  key={img} 
                                  draggable 
                                  onDragStart={(e) => (dragItem.current = idx)}
                                  onDragEnter={(e) => (dragOverItem.current = idx)}
                                  onDragEnd={handleSort}
                                  onDragOver={(e) => e.preventDefault()}
                                  className="relative aspect-square bg-black rounded-md overflow-hidden border border-white/10 cursor-move group hover:border-yellow-500/50 transition-colors"
                                >
                                  <img src={img} className="w-full h-full object-cover" />
                                  {idx === 0 && <span className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg">COVER</span>}
                                  <button onClick={() => handleDeleteImage(idx)} className="absolute top-2 right-2 bg-red-600 text-white text-[10px] p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">✕</button>
                                </div>
                              ))}
                              {reorderedImages.length === 0 && (
                                 <div className="col-span-full text-center text-xs text-gray-600 py-12 border border-dashed border-gray-700 rounded bg-black/20">
                                    <p className="mb-2">No media uploaded yet.</p>
                                    <button onClick={handlePrev} className="text-yellow-500 hover:text-white transition-colors underline">Go back to Step 1 to upload</button>
                                 </div>
                              )}
                            </div>
                        </div>
              
                        {/* 2. Product Page Preview (Full Width) */}
                        <div className="bg-[#111] border border-white/5 rounded-lg p-6">
                          <h3 className="text-xl font-bold text-white mb-6">Live Preview & Input Fields</h3>
                          <ExhibitPreview formData={{...formData, images: reorderedImages}} handleChange={handleChange} handleImageChange={handleImageChange} />
                        </div>
              
                        {/* Navigation */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                           <button onClick={handlePrev} className="text-gray-400 px-6 py-3 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">Back to Edit</button>
                           {formData.category === "Featured" ? (
                               <button onClick={handleNext} className="bg-white text-black px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors rounded">Next: Bento Placement</button>
                           ) : (
                               <button onClick={() => handleSubmit(null, true)} className="bg-white text-black px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors rounded">Create Exhibit</button>
                           )}
                        </div>
                      </div>
                    )}      {/* --- STEP 3: BENTO PLACEMENT (Featured Only) --- */}
      {step === 3 && formData.category === "Featured" && (
        <div className="bg-[#111] border border-white/5 rounded-lg p-8">
           <h3 className="text-xl font-bold mb-6 text-white">Bento Grid Placement</h3>
           
           {/* Layout Selector */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {layoutConfigs.map((config) => (
                <button 
                  key={config.name}
                  onClick={() => handleLayoutSelect(config.name)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${selectedLayout === config.name ? 'border-yellow-500 bg-white/5' : 'border-gray-800 hover:border-gray-600'}`}
                >
                   <span className="block text-sm font-bold mb-2">{config.label}</span>
                   <div className={`grid h-12 gap-1 p-1 bg-black/50 rounded ${config.miniMapGrid}`}>
                      {config.miniMapSlots.map((cls, i) => <div key={i} className={`bg-gray-600 rounded-sm ${cls}`} />)}
                   </div>
                </button>
              ))}
           </div>

           {/* Large Interactive Grid */}
           <div className="bg-black/30 p-8 rounded-xl border border-white/5">
              <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Select a Slot</h4>
              <div className={`grid gap-4 w-full aspect-video ${layoutConfigs.find(l => l.name === selectedLayout)?.mainGrid}`}>
                 {layoutConfigs.find(l => l.name === selectedLayout)?.mainSlots.map((cls, idx) => {
                     const slotNum = idx + 1;
                     const isSelected = selectedSlot === slotNum;
                     const isOccupied = previouslyFeaturedExhibits[idx]; 

                     return (
                         <div 
                           key={idx} 
                           onClick={() => setSelectedSlot(slotNum)}
                           className={`relative rounded-xl overflow-hidden cursor-pointer transition-all border-2
                             ${cls}
                             ${isSelected ? 'border-yellow-500 ring-2 ring-yellow-500/20' : 'border-gray-800 hover:border-gray-600'}
                           `}
                         >
                            {isSelected && reorderedImages[0] ? (
                                <img src={reorderedImages[0]} className="w-full h-full object-cover" />
                            ) : isOccupied ? (
                                <>
                                  <img src={isOccupied.image} className="w-full h-full object-cover opacity-30 grayscale" />
                                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-500">OCCUPIED</span>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-bold uppercase tracking-widest">Open Slot</div>
                            )}
                         </div>
                     )
                 })}
              </div>
           </div>

           <div className="flex justify-end gap-4 mt-8">
              <button onClick={handlePrev} className="text-gray-400 px-6 py-2 font-bold text-xs uppercase tracking-widest">Back</button>
              <button onClick={() => handleSubmit(null, true)} className="bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200">Confirm & Create</button>
           </div>
        </div>
      )}
    </div>
  );
}

// Simple Helper Component
function InputField({ name, label, placeholder, required = false, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white" />
    </div>
  );
}