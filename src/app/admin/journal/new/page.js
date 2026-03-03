"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { UploadButton } from "@/components/UploadButton";
import JournalMediaDisplay from "@/components/JournalMediaDisplay"; 
import { Camera, Zap, ChevronLeft, Layers } from "lucide-react";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

const GENRES = ["CLASSIC_VINTAGE", "RACE_COURSE", "CITY_LIFE", "SUPERPOWERS", "LUXURY_REDEFINED", "OFF_ROAD", "FUTURE_PROOF"];

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [hasExistingFeatured, setHasExistingFeatured] = useState(false);
  const [existingFeaturedTitle, setExistingFeaturedTitle] = useState("");

  const [formData, setFormData] = useState({
    title: "", slug: "", content: "", author: "",
    genre: "CLASSIC_VINTAGE", isPublished: false, isFeatured: false,
    readTime: 0, imageUrl: "", videoUrl: "",
  });

  useEffect(() => {
    const checkFeatured = async () => {
      try {
        const res = await fetch('/api/journal?featured=true');
        const data = await res.json();
        if (data && data.length > 0) {
          setHasExistingFeatured(true);
          setExistingFeaturedTitle(data[0].title);
        }
      } catch (err) {
        console.error("Error checking featured status:", err);
      }
    };
    checkFeatured();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Destructure to remove internal UI state fields before sending to API
    const { imageUrl, videoUrl, images, video, ...rest } = formData;

    const response = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...rest, 
        images: imageUrl ? [imageUrl] : [],
        video: videoUrl 
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Force Next.js to refresh server-side data so the new exhibit 
      // appears in the inventory/manifest lists immediately.
      router.refresh();

      // STEP_FORWARD: Redirect to preview instead of dashboard
      router.push(`/admin/journal/preview/${data.id}`);
    } else {
      // Provide feedback if the submit button "doesn't work"
      const errorData = await response.json();
      console.error("Submission failed:", errorData);
      alert(`Failed to create exhibit: ${errorData.message || 'Check server logs'}`);
    }
  };

  return (
    <div className="p-12 text-white font-geist max-w-6xl mx-auto">
      <header className="mb-12 border-b-4 border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">New_Journal_Entry</h2>
          <p className="font-geist-mono text-[10px] uppercase tracking-[0.3em] opacity-40 mt-2">{"// SYSTEM_LOG_INITIATED"}</p>
        </div>
        <Link href="/admin/journal" className="font-geist-mono text-[10px] opacity-40 hover:opacity-100 uppercase italic">
          <ChevronLeft size={12} className="inline mr-1"/> Back_to_Manifest
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Media Staging Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="grid grid-cols-2 gap-4">
            {/* Image Staging Slot */}
            <div className="aspect-video border border-white/10 bg-white/5 relative overflow-hidden flex items-center justify-center group">
              {formData.imageUrl && !/\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(formData.imageUrl) ? (
                <Image src={formData.imageUrl} fill className="object-cover opacity-80" alt="Cover Preview" />
              ) : (
                <span className="text-[8px] font-geist-mono opacity-20 uppercase tracking-widest">No_Cover_Staged</span>
              )}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 text-[7px] font-black uppercase italic border border-white/10">01_Static_Cover</div>
              {formData.imageUrl && (
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))} className="absolute bottom-2 right-2 bg-red-500/20 hover:bg-red-500 text-white text-[7px] font-black px-2 py-1 uppercase transition-all border border-red-500/50">Remove</button>
              )}
            </div>

            {/* Video Staging Slot */}
            <div className="aspect-video border border-white/10 bg-white/5 relative overflow-hidden flex items-center justify-center group">
              {formData.videoUrl ? (
                <video src={formData.videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
              ) : (
                <span className="text-[8px] font-geist-mono opacity-20 uppercase tracking-widest">No_Video_Staged</span>
              )}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 text-[7px] font-black uppercase italic border border-white/10">02_Hover_Cinematic</div>
              {formData.videoUrl && (
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, videoUrl: "" }))} className="absolute bottom-2 right-2 bg-red-500/20 hover:bg-red-500 text-white text-[7px] font-black px-2 py-1 uppercase transition-all border border-red-500/50">Remove</button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-geist-mono opacity-40 uppercase italic mb-4">Upload_Manifest_Assets</p>
              <UploadButton
                endpoint="mediaUploader"
                onClientUploadComplete={(res) => {
                  if (!res || res.length === 0) return;
                  const file = res[0];
                  const url = file.url;
                  // Robust check: check file name extension OR URL extension (ignoring query params)
                  const isVideo = /\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name) || 
                                  /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(url);
                  if (isVideo) {
                    setFormData(prev => ({ ...prev, videoUrl: url }));
                  } else {
                    setFormData(prev => ({ ...prev, imageUrl: url }));
                  }
                }}
              />
              <p className="text-[8px] font-geist-mono opacity-20 uppercase mt-4 italic">{"// AUTO_ROUTING: Images to Slot_01, Videos to Slot_02."}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-5 border border-white/10 bg-white/[0.02]">
                <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))} className="h-5 w-5 accent-green-500" />
                <label className="text-xs font-black uppercase italic text-white/60">Official_Release (Live)</label>
              </div>
              <div className={`p-5 border transition-all ${
                formData.isFeatured ? "border-[#FF8700] bg-[#FF8700]/10" : 
                hasExistingFeatured ? "border-white/5 bg-white/5 opacity-50" : "border-white/10 bg-white/5"
              }`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={formData.isFeatured} 
                    disabled={hasExistingFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))} 
                    className={`h-5 w-5 ${hasExistingFeatured ? 'cursor-not-allowed' : 'accent-[#FF8700]'}`} 
                  />
                  <label className="text-xs font-black uppercase italic text-[#FF8700]">
                    Pole_Position_Exhibit
                  </label>
                </div>
                
                {/* Hard Lock Disclaimer */}
                {hasExistingFeatured && (
                  <p className="mt-3 pl-9 text-[9px] font-mono text-[#FF8700] uppercase leading-tight opacity-80">
                    ! Locked: &quot;{existingFeaturedTitle}&quot; is currently featured. Delete or un-feature it to enable this slot.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Data Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <InputField label="Title" value={formData.title} onChange={(val) => setFormData(prev => ({...prev, title: val}))} />
          <InputField label="Slug" value={formData.slug} onChange={(val) => setFormData(prev => ({...prev, slug: val}))} />
          <InputField label="Author" value={formData.author} onChange={(val) => setFormData(prev => ({...prev, author: val}))} />
          <div className="space-y-2 font-geist-mono">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Editorial_Genre</label>
            <select value={formData.genre} onChange={(e) => setFormData(prev => ({...prev, genre: e.target.value}))} className="w-full bg-white/5 border border-white/10 p-4 text-xs outline-none uppercase italic text-white appearance-none">
              {GENRES.map(g => <option key={g} value={g} className="bg-zinc-900">{g}</option>)}
            </select>
          </div>
        </div>

        <RichTextEditor content={formData.content} onUpdate={(html, stats) => setFormData(prev => ({...prev, content: html, readTime: stats.readTime}))} />

        <div className="flex justify-end gap-6 pt-10 border-t border-white/10">
          <button type="submit" className="bg-white text-black px-10 py-3 font-black text-[10px] uppercase italic hover:bg-[#FF8700] hover:text-white transition-all">
            Stage_Exhibit_for_Preview
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div className="space-y-2 font-geist-mono">
      <label className="text-[10px] font-black uppercase opacity-40">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 text-xs focus:border-[#FF8700] outline-none text-white italic" />
    </div>
  );
}