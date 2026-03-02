"use client";
import { useState } from "react";
import Link from "next/link";
import { Star, Eye, Edit3, Trash2 } from "lucide-react";

export default function JournalDashboard({ initialEntries }) {
  const [entries, setEntries] = useState(initialEntries);

  const handleDelete = async (id) => {
    if (window.confirm("CONFIRM_DELETION: This action cannot be undone.")) {
      await fetch(`/api/journal/${id}`, { method: 'DELETE' });
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  return (
    // FIXED: Added max-w-full and overflow-x-hidden to clamp page width
    <div className="p-4 md:p-8 lg:p-12 max-w-full overflow-x-hidden font-geist">
      
      {/* Header - Compacted for Mobile */}
      <div className="flex flex-row justify-between items-center md:items-end gap-3 mb-6 md:mb-12">
        <div className="min-w-0">
           <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-1">Archive_Manifest</h2>
           <p className="text-[9px] md:text-[10px] font-geist-mono text-white/40 uppercase tracking-widest leading-none">
             // System_Status: <span className="text-green-500">OPTIMAL</span>
           </p>
        </div>
        
        {/* SHARP BUTTON - padding adjusted for mobile */}
        <Link href="/admin/journal/new" className="bg-white text-black px-4 py-2 md:px-8 md:py-3 font-black text-[9px] md:text-[10px] uppercase italic tracking-widest hover:bg-[#FF8700] hover:text-white transition-all shrink-0 rounded-none">
          + New<span className="hidden sm:inline">_Exhibit</span>
        </Link>
      </div>

      <div className="bg-[#111]/50 border border-white/5 rounded-none overflow-hidden">
        
        {/* TIER 1: DESKTOP TABLE (Hidden on Mobile) */}
        <table className="w-full text-left hidden md:table">
          <thead className="bg-white/5 text-[9px] font-geist-mono uppercase text-white/40">
             <tr>
               <th className="px-6 py-4 font-normal">Pos</th>
               <th className="px-6 py-4 font-normal">Manifest_Title</th>
               <th className="px-6 py-4 font-normal">Pilot</th>
               <th className="px-6 py-4 font-normal">Status</th>
               <th className="px-6 py-4 font-normal text-right">Telemetry</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
             {entries.map((entry, index) => (
               <tr key={entry.id} className="hover:bg-white/5 transition-colors group">
                 <td className="px-6 py-4 text-[10px] font-geist-mono text-white/20">{(index + 1).toString().padStart(2, '0')}</td>
                 <td className="px-6 py-4">
                   <div className="flex items-center gap-3 pr-4">
                     <span className="text-xs font-black uppercase italic tracking-tight truncate max-w-[300px]">{entry.title}</span>
                     {entry.isFeatured && <Star size={10} className="text-[#FF8700] fill-[#FF8700] shrink-0" title="Featured Exhibit" />}
                   </div>
                 </td>
                 <td className="px-6 py-4 text-[10px] font-geist-mono opacity-60 uppercase">{entry.author || 'DR_01'}</td>
                 <td className="px-6 py-4">
                    {entry.isPublished ? (
                      <span className="text-green-500 text-[8px] font-black uppercase italic tracking-widest border border-green-500/20 px-2 py-0.5 rounded-none">Live</span>
                    ) : (
                      <span className="text-white/20 text-[8px] font-black uppercase italic tracking-widest border border-white/10 px-2 py-0.5 rounded-none">Draft</span>
                    )}
                 </td>
                 <td className="px-6 py-4 text-right space-x-4">
                   <Link href={`/admin/journal/preview/${entry.id}`} className="text-white/40 hover:text-white inline-block transition-colors"><Eye size={14}/></Link>
                   <Link href={`/admin/journal/edit/${entry.id}`} className="text-white/40 hover:text-[#FF8700] inline-block transition-colors"><Edit3 size={14}/></Link>
                   <button onClick={() => handleDelete(entry.id)} className="text-white/20 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>

        {/* TIER 2 & 3: MOBILE COMPACT CARDS (Hidden on Desktop) */}
        <div className="md:hidden divide-y divide-white/5">
          {entries.map((entry, index) => (
            <div key={entry.id} className="p-3 sm:p-4 flex flex-col gap-3 group hover:bg-white/[0.02] transition-colors">
              
              {/* Card Top: Pos, Title, Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 items-center min-w-0">
                  <div className="text-[10px] font-geist-mono text-white/20 shrink-0 mt-0.5">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] sm:text-xs font-black uppercase italic tracking-tight text-white truncate leading-none mt-1">
                        {entry.title}
                      </p>
                      {entry.isFeatured && <Star size={10} className="text-[#FF8700] fill-[#FF8700] shrink-0 mt-1" />}
                    </div>
                    <p className="text-[9px] font-geist-mono text-white/40 uppercase mt-1.5 leading-none">
                      Pilot: {entry.author || 'DR_01'}
                    </p>
                  </div>
                </div>
                
                <div className="shrink-0 text-right mt-1">
                  {entry.isPublished ? (
                    <span className="text-green-500 text-[8px] font-black uppercase italic tracking-widest border border-green-500/20 px-1.5 py-0.5 rounded-none">LIVE</span>
                  ) : (
                    <span className="text-white/20 text-[8px] font-black uppercase italic tracking-widest border border-white/10 px-1.5 py-0.5 rounded-none">DRAFT</span>
                  )}
                </div>
              </div>

              {/* Card Bottom: Action Bar */}
              <div className="flex justify-between items-center bg-white/[0.02] px-2 py-2 border border-white/5 mt-1">
                <div className="text-[8px] font-geist-mono text-white/20 uppercase tracking-widest pl-1">
                  Telemetry
                </div>
                <div className="flex gap-4 items-center pr-1">
                  <Link href={`/admin/journal/preview/${entry.id}`} className="text-white/40 hover:text-white transition-colors">
                    <Eye size={13}/>
                  </Link>
                  <Link href={`/admin/journal/edit/${entry.id}`} className="text-white/40 hover:text-[#FF8700] transition-colors">
                    <Edit3 size={13}/>
                  </Link>
                  <button onClick={() => handleDelete(entry.id)} className="text-white/20 hover:text-red-500 transition-colors">
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>

            </div>
          ))}
          {entries.length === 0 && (
             <div className="p-8 text-center font-geist-mono text-[10px] text-white/40 uppercase tracking-widest italic">
               -- Manifest Empty --
             </div>
          )}
        </div>

      </div>
    </div>
  );
}