"use client";
import Link from "next/link";
import JournalHero from "@/components/journal/JournalHero";
import JournalMediaDisplay from "@/components/JournalMediaDisplay";
import { Terminal, CheckCircle, ExternalLink, Settings } from 'lucide-react';

export default function JournalPreview({ entry }) {
  if (!entry) return null;

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-geist relative overflow-x-hidden">
      
      {/* PREVIEW HUD: Responsive Stack */}
      <div className="sticky top-0 z-[100] w-full bg-black/90 border-b border-[#FF8700]/30 px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-md">
        <div className="flex items-center gap-4 text-[#FF8700] self-start sm:self-center">
            <div className="p-2 bg-[#FF8700]/10 border border-[#FF8700]/20 shrink-0">
                <Terminal size={14} />
            </div>
            <div>
                <span className="text-[10px] font-black uppercase italic tracking-tighter text-white block">SYSTEM_PREVIEW_MODE</span>
                <p className="text-[8px] font-geist-mono opacity-40 uppercase tracking-widest italic whitespace-nowrap">// VISUALIZING_LIVE_MANIFEST</p>
            </div>
        </div>
        
        {/* Navigation Actions: Grid on mobile, Flex on desktop */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
            <Link href={`/admin/journal/edit/${entry.id}`} className="text-white/40 hover:text-white px-3 py-2 font-black text-[9px] uppercase italic tracking-widest border border-white/5 transition-all text-center">
              Modify
            </Link>
            <Link href={`/journal/${entry.slug}`} target="_blank" className="text-[#FF8700] hover:bg-[#FF8700]/10 px-3 py-2 font-black text-[9px] uppercase italic tracking-widest border border-[#FF8700]/20 transition-all flex items-center justify-center gap-2">
              <ExternalLink size={10} /> Live_Site
            </Link>
            <Link href="/admin/journal" className="col-span-2 bg-white text-black px-4 py-2 font-black text-[9px] uppercase italic hover:bg-[#FF8700] hover:text-white transition-all flex items-center justify-center gap-2">
              <CheckCircle size={12} /> Confirm_&_Exit
            </Link>
        </div>
      </div>

      {/* COVER PREVIEW: Responsive Sizing */}
      <section className="py-12 md:py-20 px-4 md:px-6 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8 md:mb-10">
            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/40">// Manifest_Card_Preview</h3>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          
          <div className="block w-full max-w-md mx-auto group">
            <div className="bg-[#111] border border-white/10 rounded-sm overflow-hidden transition-all duration-500 group-hover:border-[#FF8700]/50">
              <div className="aspect-video relative">
                <JournalMediaDisplay imageUrl={entry.images?.[0]} videoUrl={entry.video} />
              </div>
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[8px] md:text-[9px] font-geist-mono text-[#FF8700] uppercase tracking-widest">{entry.genre}</span>
                  <span className="text-[8px] md:text-[9px] font-geist-mono text-white/20 uppercase">{entry.readTime} MIN_LAP</span>
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-white group-hover:text-[#FF8700] transition-colors">{entry.title}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC RENDER */}
      <div className="relative w-full overflow-hidden">
        {entry.isFeatured ? (
          <JournalHero entry={entry} />
        ) : (
          <header className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden border-b border-white/10">
            <div className="absolute inset-0">
              <JournalMediaDisplay imageUrl={entry.images?.[0]} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-20">
              <div className="max-w-5xl mx-auto">
                <p className="font-geist-mono text-[8px] md:text-[10px] uppercase text-[#FF8700] tracking-[0.5em] mb-4 md:mb-6">// LOG_ENTRY_PROCESSED</p>
                {/* Fixed: text-3xl on mobile, text-8xl on desktop */}
                <h1 className="text-3xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] text-white drop-shadow-2xl break-words">
                  {entry.title}
                </h1>
              </div>
            </div>
          </header>
        )}

        {/* Content Section: Ensure images inside content don't break width */}
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <article className="prose prose-invert prose-orange max-w-full overflow-hidden tiptap-content font-geist 
            prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-white
            prose-h1:text-4xl md:prose-h1:text-7xl prose-h1:mb-6
            prose-h2:text-2xl md:prose-h2:text-4xl prose-h2:mt-10 prose-h2:mb-4
            prose-p:text-white/70 prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg
            prose-img:rounded-sm prose-img:border prose-img:border-white/10
            prose-li:text-white/70 prose-li:marker:text-[#FF8700] prose-ul:list-disc prose-ol:list-decimal">
              <div 
                dangerouslySetInnerHTML={{ __html: entry.content }} 
                className="[&_img]:max-w-full [&_img]:h-auto" 
              />
          </article>
          
          <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4 font-geist-mono text-[8px] opacity-20 uppercase italic">
              <span>Protocol: End_of_Transmission</span>
              <span>Log_ID: {entry.id?.slice(0, 12) || "N/A"}</span>
          </footer>
        </div>
      </div>
    </div>
  );
}