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
    <div className="p-6 md:p-12 font-geist">
      <div className="flex justify-between items-end mb-12">
        <div>
           <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Archive_Manifest</h2>
           <p className="text-[10px] font-geist-mono text-white/40 uppercase tracking-widest">// System_Status: <span className="text-green-500">OPTIMAL</span></p>
        </div>
        <Link href="/admin/journal/new" className="bg-white text-black px-8 py-3 font-black text-[10px] uppercase italic tracking-widest hover:bg-[#FF8700] hover:text-white transition-all">
          + New_Exhibit
        </Link>
      </div>

      <div className="bg-[#111]/50 border border-white/5 rounded-sm overflow-hidden">
        <table className="w-full text-left">
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
                   <div className="flex items-center gap-3">
                     <span className="text-xs font-black uppercase italic tracking-tight">{entry.title}</span>
                     {entry.isFeatured && <Star size={10} className="text-[#FF8700] fill-[#FF8700]" title="Featured Exhibit" />}
                   </div>
                 </td>
                 <td className="px-6 py-4 text-[10px] font-geist-mono opacity-60 uppercase">{entry.author || 'DR_01'}</td>
                 <td className="px-6 py-4">
                    {entry.isPublished ? (
                      <span className="text-green-500 text-[8px] font-black uppercase italic tracking-widest border border-green-500/20 px-2 py-0.5">Live</span>
                    ) : (
                      <span className="text-white/20 text-[8px] font-black uppercase italic tracking-widest border border-white/10 px-2 py-0.5">Draft</span>
                    )}
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
      </div>
    </div>
  );
}