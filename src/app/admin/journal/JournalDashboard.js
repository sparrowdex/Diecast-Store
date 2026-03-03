"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Eye, Edit3, Trash2 } from "lucide-react";

export default function JournalDashboard({ initialEntries = [] }) {
  const [entries, setEntries] = useState(initialEntries);

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  const handleDelete = async (id) => {
    if (window.confirm("CONFIRM_DELETION: This action cannot be undone.")) {
      await fetch(`/api/journal/${id}`, { method: 'DELETE' });
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-full overflow-x-hidden font-geist">
      
      {/* Header: Stacked for better sidebar compatibility */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="min-w-0">
           <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-2">Journal</h2>
           <p className="text-[9px] md:text-[10px] font-geist-mono text-white/40 uppercase tracking-[0.3em] leading-none">
             // System_Status: <span className="text-green-500">OPTIMAL</span>
           </p>
        </div>
        
        <Link href="/admin/journal/new" className="bg-white text-black px-6 py-3 font-black text-[10px] uppercase italic tracking-widest hover:bg-[#FF8700] hover:text-white transition-all w-fit rounded-none">
          + New_Manifest_Entry
        </Link>
      </div>

      <div className="bg-[#111]/50 border border-white/5 rounded-none overflow-hidden">
        
        {/* DESKTOP TABLE: Keeping your original structure for wide screens */}
        <table className="w-full text-left hidden lg:table">
          <thead className="bg-white/5 text-[9px] font-geist-mono uppercase text-white/40 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-normal">Pos</th>
                <th className="px-6 py-4 font-normal">Manifest_Title</th>
                <th className="px-6 py-4 font-normal">Pilot</th>
                <th className="px-6 py-4 font-normal">Genre</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal text-right">Telemetry</th>
              </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
              {entries.map((entry, index) => (
                <tr key={entry.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-[10px] font-geist-mono text-white/20">{(index + 1).toString().padStart(2, '0')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black uppercase italic tracking-tight">{entry.title}</span>
                      {entry.isFeatured && <Star size={10} className="text-[#FF8700] fill-[#FF8700] shrink-0" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-geist-mono opacity-60 uppercase">{entry.author || 'DR_01'}</td>
                  <td className="px-6 py-4 text-[10px] font-geist-mono opacity-60 uppercase">
                    {entry.genre?.replace(/_/g, ' ') || 'GENERAL'}
                  </td>
                  <td className="px-6 py-4">
                     <StatusBadge entry={entry} />
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <Link href={`/admin/journal/preview/${entry.id}`} className="text-white/40 hover:text-white inline-block"><Eye size={14}/></Link>
                    <Link href={`/admin/journal/edit/${entry.id}`} className="text-white/40 hover:text-[#FF8700] inline-block"><Edit3 size={14}/></Link>
                    <button onClick={() => handleDelete(entry.id)} className="text-white/20 hover:text-red-500"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* TABLET & MOBILE: Card Layout (Prevents Stretch & Icon Wrap) */}
        <div className="lg:hidden divide-y divide-white/5">
          {entries.map((entry, index) => (
            <div key={entry.id} className="p-4 flex flex-col gap-4 group hover:bg-white/[0.02]">
              
              {/* Top Row: Pos & Title Only */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="text-[10px] font-geist-mono text-white/20 shrink-0 mt-1">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black uppercase italic tracking-tight text-white truncate">
                      {entry.title}
                    </h3>
                    {entry.isFeatured && <Star size={10} className="text-[#FF8700] fill-[#FF8700] shrink-0" />}
                  </div>
                  <p className="text-[9px] font-geist-mono text-white/30 uppercase mt-1">Pilot: {entry.author || 'DR_01'}</p>
                </div>
              </div>

              {/* Bottom Row: Status (Left) and Actions (Right) */}
              <div className="flex justify-between items-center bg-white/[0.03] border border-white/5 p-3">
                <div>
                   <StatusBadge entry={entry} />
                </div>
                
                {/* Fixed Telemetry Row: Icons won't wrap here */}
                <div className="flex gap-5 items-center shrink-0">
                  <Link href={`/admin/journal/preview/${entry.id}`} className="text-white/40 hover:text-white transition-colors">
                    <Eye size={16}/>
                  </Link>
                  <Link href={`/admin/journal/edit/${entry.id}`} className="text-white/40 hover:text-[#FF8700] transition-colors">
                    <Edit3 size={16}/>
                  </Link>
                  <button onClick={() => handleDelete(entry.id)} className="text-white/20 hover:text-red-500 transition-colors">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="p-12 text-center font-geist-mono text-[10px] text-white/20 uppercase tracking-[0.5em] italic">
            -- Manifest_Empty --
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Status Badge to match Inventory style
function StatusBadge({ entry }) {
  if (entry.isPublished) {
    return (
      <span className="text-green-500 text-[8px] font-black uppercase italic tracking-[0.2em] border border-green-500/20 px-2 py-1 bg-green-500/5">
        Live
      </span>
    );
  }
  return (
    <span className="text-white/20 text-[8px] font-black uppercase italic tracking-[0.2em] border border-white/10 px-2 py-1 bg-white/5">
      Draft
    </span>
  );
}