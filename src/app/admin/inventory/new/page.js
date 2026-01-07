"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExhibitPreview from "@/components/ExhibitPreview";
import { UploadButton } from "@uploadthing/react";

const isMediaVideo = (media) => {
  if (!media || !media.type) return false;
  return media.type.startsWith("video/");
};

export default function NewExhibitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    scale: "",
    material: "",
    condition: "",
    description: "",
    editorsNote: "",
    featured: false,
    category: "Archive",
    stock: 1,
  });

  // Drag & Drop State
  const [reorderedImages, setReorderedImages] = useState([]);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        featured: value === 'Featured'
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleMediaUpload = (res) => {
    if (!res) return;

    const newMediaObjects = res.map(file => ({ url: file.ufsUrl, type: file.type }));
    
    setReorderedImages(prev => {
      const newImages = newMediaObjects.filter(f => !isMediaVideo(f));
      const newVideo = newMediaObjects.find(f => isMediaVideo(f));

      const existingImages = prev.filter(f => !isMediaVideo(f));
      const existingVideo = prev.find(f => isMediaVideo(f));

      let finalMedia = [...existingImages, ...newImages];
      const finalVideo = newVideo || existingVideo;
      if (finalVideo) {
        finalMedia.push(finalVideo);
      }
      return finalMedia;
    });

    const imageCount = newMediaObjects.filter(f => !isMediaVideo(f)).length;
    const videoCount = newMediaObjects.find(f => isMediaVideo(f)) ? 1 : 0;
    if (imageCount > 0) alert(`${imageCount} image(s) uploaded.`);
    if (videoCount > 0) alert("Video uploaded successfully.");
  };

  const handleSort = useCallback(() => {
    let _reorderedImages = [...reorderedImages];
    const draggedItemContent = _reorderedImages.splice(dragItem.current, 1)[0];
    _reorderedImages.splice(dragOverItem.current, 0, draggedItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    
    setReorderedImages(_reorderedImages);
  }, [reorderedImages]);

  const handleDeleteMedia = (indexToDelete) => {
    setReorderedImages(prev => prev.filter((_, i) => i !== indexToDelete));
  };

  // Navigation Logic
  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Step 3 is removed, so we always submit from step 2
      handleSubmit();
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const images = reorderedImages.filter(media => !isMediaVideo(media)).map(m => m.url);
    const videoObj = reorderedImages.find(media => isMediaVideo(media));
    const video = videoObj ? videoObj.url : "";
    
    const dataToSend = { 
      ...formData,
      images,
      video,
      stock: parseInt(formData.stock, 10) || 0,
    };
    
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

      router.push("/admin/inventory");

    } catch (error) {
      console.error("Failed to create exhibit:", error);
      alert("Failed to create exhibit. Check the console for more details.");
    }
  };
  
  const imageCount = reorderedImages.filter(m => !isMediaVideo(m)).length;
  const videoCount = reorderedImages.some(m => isMediaVideo(m)) ? 1 : 0;

  return (
    <div className="p-12 text-white">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
            {step === 1 ? "New Exhibit" : "Preview & Edit Exhibit"}
          </h2>
          <p className="text-xs font-mono text-gray-500">
            {step === 1 ? "Add a new model to the gallery database." 
            : "Visualize, edit, and confirm details."}
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
           
           <div className="md:col-span-2">
             <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Media (Images & Video)</label>
             <UploadButton 
                endpoint="mediaUploader" 
                onClientUploadComplete={handleMediaUpload} 
             />
             <p className="text-xs text-gray-500 mt-2">
                {imageCount} image(s) and {videoCount} video uploaded.
             </p>
           </div>

           <InputField name="material" label="Material" value={formData.material} onChange={handleChange} />
           <InputField name="condition" label="Condition" value={formData.condition} onChange={handleChange} />
           
           <div className="md:col-span-2">
             <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
             <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full bg-white/5 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white" />
           </div>

           <div className="md:col-span-2">
             <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Editor's Note</label>
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

      {/* --- STEP 2: PREVIEW & MANAGE --- */}
      {step === 2 && (
        <div className="space-y-12">
          
          {/* 1. Media Gallery Management */}
          <div className="bg-[#111] border border-white/5 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Media Gallery Management</h3>
              </div>
              <p className="text-xs text-gray-500 mb-6">Drag and drop to reorder images. The first image will be the cover image.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {reorderedImages.map((media, idx) => (
                  <div 
                    key={media.url} 
                    draggable 
                    onDragStart={() => (dragItem.current = idx)}
                    onDragEnter={() => (dragOverItem.current = idx)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                    className="relative aspect-square bg-black rounded-md overflow-hidden border border-white/10 cursor-move group hover:border-yellow-500/50 transition-colors"
                  >
                    {isMediaVideo(media) ? (
                      <>
                        <video src={media.url} autoPlay loop muted className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">VIDEO</span>
                        <button onClick={() => handleDeleteMedia(idx)} className="absolute top-2 right-2 bg-red-600 text-white text-[10px] p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">✕</button>
                      </>
                    ) : (
                      <>
                        <img src={media.url} className="w-full h-full object-cover" />
                        {idx === 0 && <span className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg">COVER</span>}
                        <button onClick={() => handleDeleteMedia(idx)} className="absolute top-2 right-2 bg-red-600 text-white text-[10px] p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">✕</button>
                      </>
                    )}
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

          {/* 2. Product Page Preview */}
          <div className="bg-[#111] border border-white/5 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Live Preview & Input Fields</h3>
            <ExhibitPreview 
              formData={{
                  ...formData,
                  images: reorderedImages.filter(m => !isMediaVideo(m)).map(m => m.url),
                  video: (reorderedImages.find(m => isMediaVideo(m)) || {}).url || ""
              }}
              orderedMedia={reorderedImages} 
              handleChange={handleChange} 
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
             <button onClick={handlePrev} className="text-gray-400 px-6 py-3 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">Back to Edit</button>
             <button onClick={handleSubmit} className="bg-white text-black px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors rounded">Create Exhibit</button>
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