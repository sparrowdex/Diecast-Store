"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExhibitPreview from "@/components/ExhibitPreview";
import Image from "next/image";
import { UploadButton } from "@/components/UploadButton"; 
import { ChevronLeft } from "lucide-react";

// Robust media checker
const isMediaVideo = (media) => {
  if (!media) return false;
  if (media.type) return media.type.startsWith("video/");
  if (media.url) return /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(media.url);
  return false;
};

export default function EditExhibit({ car }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Initialize with existing car data
  const [formData, setFormData] = useState({
    name: car?.name || "",
    brand: car?.brand || "",
    material: car?.material || "",
    condition: car?.condition || "",
    description: car?.description || "",
    editorsNote: car?.editorsNote || "",
    featured: car?.featured || false,
    collectionStatus: car?.collectionStatus || "CATALOG",
    genre: car?.genre || "CITY_LIFE",
    modelYear: car?.modelYear || new Date().getFullYear(),
    variants: car?.variants || [{ scale: car?.scale || "1:64", price: car?.price || "", stock: car?.stock || 1 }],
  });

  // Pre-load existing media into the sequencer
  const [reorderedImages, setReorderedImages] = useState(() => {
    const existingImages = (car?.images || []).map(url => ({ url, type: 'image' }));
    const existingVideo = car?.video ? [{ url: car.video, type: 'video' }] : [];
    return [...existingImages, ...existingVideo];
  });

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = field === 'price' ? parseFloat(value) || 0 : field === 'stock' ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { scale: "1:43", price: "", stock: 1 }]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleMediaUpload = (res) => {
    if (!res) return;
    const newMediaObjects = res.map(file => ({ url: file.ufsUrl || file.url, type: file.type }));
    setReorderedImages(prev => {
      const newImages = newMediaObjects.filter(f => !isMediaVideo(f));
      const newVideo = newMediaObjects.find(f => isMediaVideo(f));
      const existingImages = prev.filter(f => !isMediaVideo(f));
      const existingVideo = prev.find(f => isMediaVideo(f));
      let finalMedia = [...existingImages, ...newImages];
      const finalVideo = newVideo || existingVideo;
      if (finalVideo) finalMedia.push(finalVideo);
      return finalMedia;
    });
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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const images = reorderedImages.filter(media => !isMediaVideo(media)).map(m => m.url);
    const videoObj = reorderedImages.find(media => isMediaVideo(media));
    
    // Formatting data for Prisma Update
    const dataToSend = { 
      ...formData,
      images,
      video: videoObj?.url || "",
    };
    
    try {
      const response = await fetch(`/api/products/${car.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      router.refresh();
      router.push("/admin/inventory");

    } catch (error) {
      console.error("Failed to update exhibit:", error);
      alert(`Failed to update exhibit: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // STRICT WRAPPER: overflow-x-hidden and w-full box-border prevent the white bar on the right
    <div className="p-4 md:p-12 text-white font-geist max-w-6xl mx-auto w-full overflow-x-hidden box-border">
      
      <header className="mb-8 md:mb-12 border-b-4 border-white/10 pb-6 flex justify-between items-end">
        <div className="min-w-0 overflow-hidden">
          <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter truncate">
            {step === 1 ? "Edit_Exhibit_Data" : "Preview_Edits"}
          </h2>
          <p className="font-geist-mono text-[8px] md:text-[10px] uppercase tracking-[0.3em] opacity-40 mt-2 truncate">
            {"// TARGET_ID: "}{car?.id || "UNKNOWN"}
          </p>
        </div>
        <button onClick={() => step === 2 ? setStep(1) : router.push("/admin/inventory")} className="font-geist-mono text-[10px] opacity-40 hover:opacity-100 uppercase italic whitespace-nowrap ml-4">
          <ChevronLeft size={12} className="inline mr-1"/> {step === 2 ? "Back" : "Cancel"}
        </button>
      </header>

      {step === 1 ? (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-8 w-full max-w-full box-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-full items-start">
            
            {/* LEFT COLUMN: Media Staging */}
            <div className="space-y-6 w-full max-w-full">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl w-full max-w-full overflow-hidden box-border">
                <p className="text-[10px] font-geist-mono opacity-40 uppercase italic mb-4 truncate">Modify_Assets</p>
                
                {/* THE UPLOAD FIX: This strictly forces the input to stay within the box */}
                <div className="w-full max-w-full overflow-hidden [&_input[type=file]]:max-w-full [&_input[type=file]]:overflow-hidden [&_input[type=file]]:text-ellipsis">
                  <UploadButton
                    endpoint="mediaUploader"
                    onUploadBegin={() => setIsUploading(true)}
                    onClientUploadComplete={(res) => { setIsUploading(false); handleMediaUpload(res); }}
                    onUploadError={() => setIsUploading(false)}
                  />
                </div>
                
                <p className="text-[8px] font-geist-mono opacity-20 uppercase mt-4 italic truncate">
                  {"// "}{reorderedImages.length} ASSETS STAGED {isUploading && "- UPLOADING..."}
                </p>
              </div>

              {reorderedImages.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 w-full">
                  {reorderedImages.map((m, i) => (
                    <div key={i} className="aspect-square bg-white/5 border border-white/10 relative overflow-hidden rounded-md">
                      {isMediaVideo(m) ? <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-[8px]">VIDEO</div> : <Image src={m.url} fill className="object-cover" alt="prev" />}
                      <button type="button" onClick={() => handleDeleteMedia(i)} className="absolute top-0.5 right-0.5 bg-red-500 p-0.5 text-[8px] rounded-sm z-10">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Core Data */}
            <div className="space-y-6 w-full box-border">
              <InputField name="name" label="Exhibit Name" value={formData.name} onChange={handleChange} required />
              <InputField name="brand" label="Brand" value={formData.brand} onChange={handleChange} required />
              
              {/* VARIANT MANAGER */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Scale Configurations</label>
                  <button type="button" onClick={addVariant} className="text-[10px] font-bold text-yellow-500 hover:underline">+ ADD SCALE</button>
                </div>
                {formData.variants.map((v, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 items-end bg-white/5 p-3 rounded-sm relative group">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase opacity-30">Scale</label>
                      <select value={v.scale} onChange={(e) => handleVariantChange(idx, 'scale', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-xs py-1 outline-none">
                        {['1:64', '1:43', '1:24', '1:18'].map(s => <option key={s} value={s} className="bg-zinc-900">{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase opacity-30">Price</label>
                      <input type="number" value={v.price} onChange={(e) => handleVariantChange(idx, 'price', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-xs py-1 outline-none" placeholder="0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase opacity-30">Stock</label>
                      <input type="number" value={v.stock} onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-xs py-1 outline-none" placeholder="0" />
                    </div>
                    {formData.variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(idx)} className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full box-border">
                <InputField name="modelYear" label="Model Year" value={formData.modelYear} onChange={handleChange} type="number" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full box-border">
            <InputField name="material" label="Material" value={formData.material} onChange={handleChange} />
            <InputField name="condition" label="Condition" value={formData.condition} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full box-border">
             <div className="space-y-2 font-geist-mono w-full overflow-hidden">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block truncate">Collection Status</label>
                <select name="collectionStatus" value={formData.collectionStatus} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-4 text-xs outline-none uppercase italic text-white appearance-none rounded-lg box-border">
                  <option value="CATALOG" className="bg-[#111]">Catalog</option>
                  <option value="NEW_ARRIVAL" className="bg-[#111]">New Arrival</option>
                  <option value="FEATURED_EXHIBIT" className="bg-[#111]">Featured Exhibit</option>
                  <option value="ARCHIVED" className="bg-[#111]">Archived</option>
                </select>
             </div>
             <div className="space-y-2 font-geist-mono w-full overflow-hidden">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block truncate">Genre</label>
                <select name="genre" value={formData.genre} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-4 text-xs outline-none uppercase italic text-white appearance-none rounded-lg box-border">
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

          <div className="space-y-2 font-geist-mono w-full overflow-hidden box-border">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block truncate">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-4 rounded-lg text-xs outline-none text-white italic min-h-[100px] box-border" />
          </div>

          <div className="space-y-2 font-geist-mono w-full overflow-hidden box-border">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block truncate">Editor's Note</label>
            <textarea name="editorsNote" value={formData.editorsNote} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-4 rounded-lg text-xs outline-none text-white italic min-h-[60px] box-border" />
          </div>

          <div className="flex justify-end pt-8 border-t border-white/10 w-full box-border">
            <button type="submit" disabled={!formData.name} className="w-full md:w-auto bg-white text-black px-10 py-4 font-black text-[10px] uppercase italic hover:bg-yellow-500 transition-all rounded-lg disabled:opacity-30">
              Proceed_to_Curation
            </button>
          </div>
        </form>
      ) : (
        /* STEP 2: PREVIEW */
        <div className="space-y-12 w-full box-border">
          <section className="bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-xl w-full box-border">
            <p className="text-[10px] font-geist-mono opacity-40 uppercase italic mb-6">Drag_to_Reorder_Manifest</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 w-full box-border">
              {reorderedImages.map((m, idx) => (
                <div 
                  key={m.url} draggable onDragStart={() => (dragItem.current = idx)} onDragEnter={() => (dragOverItem.current = idx)}
                  onDragEnd={handleSort} onDragOver={(e) => e.preventDefault()}
                  className="aspect-square relative border border-white/10 cursor-move group rounded-md overflow-hidden box-border"
                >
                  {isMediaVideo(m) ? <video src={m.url} className="w-full h-full object-cover" muted /> : <Image src={m.url} fill className="object-cover" alt="sort" />}
                  <button onClick={() => handleDeleteMedia(idx)} className="absolute top-1 right-1 bg-red-500 p-1 text-[8px] rounded-sm">✕</button>
                  {idx === 0 && <span className="absolute bottom-0 left-0 bg-yellow-500 text-black text-[7px] font-black px-1 uppercase w-full text-center">Cover</span>}
                </div>
              ))}
            </div>
          </section>

          <div className="w-full box-border">
            <ExhibitPreview 
              formData={{
                ...formData,
                images: reorderedImages.filter(m => !isMediaVideo(m)).map(m => m.url),
                video: reorderedImages.find(m => isMediaVideo(m))?.url || "" 
              }} 
              orderedMedia={reorderedImages}
              handleChange={handleChange}
              handleVariantChange={handleVariantChange}
              addVariant={addVariant}
              removeVariant={removeVariant}
            />
          </div>

          <div className="flex justify-end gap-6 pt-10 border-t border-white/10 w-full box-border">
            <button onClick={handleSubmit} disabled={isSubmitting} className="w-full md:w-auto bg-yellow-500 text-black px-12 py-4 rounded-lg font-black text-[11px] uppercase italic hover:bg-white transition-all shadow-xl box-border">
              {isSubmitting ? "Updating..." : "Update_Database"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ name, label, value, onChange, type = "text", required = false }) {
  return (
    <div className="space-y-2 font-geist-mono w-full max-w-full box-border">
      <label className="text-[10px] font-black uppercase opacity-40 tracking-widest block truncate">{label}</label>
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange} 
        required={required} 
        className="w-full bg-white/5 border border-white/10 p-4 rounded-lg text-xs focus:border-yellow-500 outline-none text-white italic transition-all box-border" 
      />
    </div>
  );
}