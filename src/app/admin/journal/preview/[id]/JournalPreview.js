"use client";
import Link from "next/link";
import JournalHero from "@/components/journal/JournalHero";
import JournalMediaDisplay from "@/components/JournalMediaDisplay";
import { Terminal, ChevronLeft, CheckCircle, ExternalLink } from 'lucide-react';

export default function JournalPreview({ entry }) {
  if (!entry) return null;

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-geist relative">
      {/* PREVIEW HUD: Redesigned for better navigation */}
      <div className="sticky top-0 z-[100] w-full bg-black/90 border-b border-[#FF8700]/30 px-6 py-4 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-4 text-[#FF8700]">
            <div className="p-2 bg-[#FF8700]/10 border border-[#FF8700]/20">
                <Terminal size={14} />
            </div>
            <div>
                <span className="text-[10px] font-black uppercase italic tracking-tighter text-white block">SYSTEM_PREVIEW_MODE</span>
                <p className="text-[8px] font-geist-mono opacity-40 uppercase tracking-widest italic">// VISUALIZING_LIVE_MANIFEST</p>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <Link href={`/admin/journal/edit/${entry.id}`} className="text-white/40 hover:text-white px-4 py-2 font-black text-[10px] uppercase italic tracking-widest border border-white/5 transition-all">
              Modify_Entry
            </Link>
            <Link href={`/journal/${entry.slug}`} target="_blank" className="text-[#FF8700] hover:bg-[#FF8700]/10 px-4 py-2 font-black text-[10px] uppercase italic tracking-widest border border-[#FF8700]/20 transition-all flex items-center gap-2">
              <ExternalLink size={12} /> View_Live_Site
            </Link>
            <Link href="/admin/journal" className="bg-white text-black px-6 py-2 font-black text-[10px] uppercase italic hover:bg-[#FF8700] hover:text-white transition-all flex items-center gap-2">
              <CheckCircle size={12} /> Confirm_&_Exit
            </Link>
        </div>
      </div>

      {/* COVER PREVIEW: See how it looks in the list/grid */}
      <section className="py-20 px-6 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">// Manifest_Card_Preview</h3>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          
          <Link href={`/journal/${entry.slug}`} className="block w-full max-w-md mx-auto group">
            <div className="bg-[#111] border border-white/10 rounded-sm overflow-hidden transition-all duration-500 group-hover:border-[#FF8700]/50 group-hover:shadow-[0_0_30px_rgba(255,135,0,0.1)]">
              <div className="aspect-video relative">
                <JournalMediaDisplay imageUrl={entry.images?.[0]} videoUrl={entry.video} />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-geist-mono text-[#FF8700] uppercase tracking-widest">{entry.genre}</span>
                  <span className="text-[9px] font-geist-mono text-white/20 uppercase">{entry.readTime} MIN_LAP</span>
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white group-hover:text-[#FF8700] transition-colors">{entry.title}</h3>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* DYNAMIC RENDER: Hero vs Standard */}
      <div className="relative">
        {entry.isFeatured ? (
          <JournalHero entry={entry} />
        ) : (
          <header className="relative w-full h-[70vh] overflow-hidden border-b border-white/10">
            <div className="absolute inset-0">
              <JournalMediaDisplay 
                imageUrl={entry.images?.[0]} 
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-12 md:p-20">
              <div className="max-w-5xl mx-auto">
                <p className="font-geist-mono text-[10px] uppercase text-[#FF8700] tracking-[0.5em] mb-6">// LOG_ENTRY_PROCESSED</p>
                <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.8] text-white drop-shadow-2xl">
                  {entry.title}
                </h1>
              </div>
            </div>
          </header>
        )}

        <div className="max-w-3xl mx-auto px-6 py-20">
          <article className="prose prose-invert prose-orange max-w-none tiptap-content font-geist">
             {/* Geist Typography logic ensures the content looks perfect */}
             <div 
               className="text-white/80 leading-relaxed" 
               dangerouslySetInnerHTML={{ __html: entry.content }} 
             />
          </article>
          
          <footer className="mt-20 pt-8 border-t border-white/5 flex justify-between font-geist-mono text-[8px] opacity-20 uppercase italic">
             <span>Protocol: End_of_Transmission</span>
             <span>Log_ID: {entry.id.slice(0, 12)}</span>
          </footer>
        </div>
      </div>
    </div>
  );
}