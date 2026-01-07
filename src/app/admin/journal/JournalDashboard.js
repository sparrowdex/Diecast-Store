"use client";
import { useState } from "react";
import Link from "next/link";

export default function JournalDashboard({ initialEntries }) {
  const [entries, setEntries] = useState(initialEntries);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      });
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  return (
    <div className="p-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
           <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Journal</h2>
           <p className="text-xs font-mono text-gray-500">System Status: <span className="text-green-500">ONLINE</span></p>
        </div>
        <Link href="/admin/journal/new" className="bg-white text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
          + New Entry
        </Link>
      </div>

      {/* Journal Table */}
      <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
           <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">All Entries</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[9px] font-mono uppercase text-gray-500">
             <tr>
               <th className="px-6 py-3 font-normal">ID</th>
               <th className="px-6 py-3 font-normal">Title</th>
               <th className="px-6 py-3 font-normal">Author</th>
               <th className="px-6 py-3 font-normal">Status</th>
               <th className="px-6 py-3 font-normal">Created At</th>
               <th className="px-6 py-3 font-normal text-right">Action</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
             {entries.map(entry => (
               <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                 <td className="px-6 py-4 text-xs font-mono text-gray-500">#{entry.id}</td>
                 <td className="px-6 py-4">
                   <span className="text-xs font-bold uppercase tracking-tight">{entry.title}</span>
                 </td>
                 <td className="px-6 py-4 text-xs font-mono">{entry.author}</td>
                 <td className="px-6 py-4">
                    {entry.isPublished ? (
                      <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                        Published
                      </span>
                    ) : (
                      <span className="bg-gray-800 text-gray-400 border border-white/10 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                        Draft
                      </span>
                    )}
                 </td>
                 <td className="px-6 py-4 text-xs font-mono">{new Date(entry.createdAt).toLocaleDateString()}</td>
                 <td className="px-6 py-4 text-right">
                   <Link href={`/admin/journal/preview/${entry.id}`} className="text-[10px] font-bold uppercase hover:text-white text-gray-500 mr-4">Preview</Link>
                   <Link href={`/admin/journal/edit/${entry.id}`} className="text-[10px] font-bold uppercase hover:text-white text-gray-500 mr-4">Edit</Link>
                   <button onClick={() => handleDelete(entry.id)} className="text-[10px] font-bold uppercase hover:text-red-500 text-gray-500">Delete</button>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
