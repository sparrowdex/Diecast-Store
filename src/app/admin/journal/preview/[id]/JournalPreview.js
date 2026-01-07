"use client";
import Link from "next/link";

export default function JournalPreview({ entry }) {
  if (!entry) {
    return (
      <div className="p-12 text-white">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Entry not found</h2>
        <Link href="/admin/journal" className="text-yellow-500 hover:underline">Return to Journal Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="p-12 bg-[#0a0a0a] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Preview Mode</h1>
        <Link href={`/admin/journal/edit/${entry.id}`} className="bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200">
          Edit This Entry
        </Link>
      </div>
      
      <div className="max-w-4xl mx-auto bg-[#111] border border-white/10 rounded-lg p-8">
        <article className="prose prose-invert">
          <h1 className="text-4xl font-bold mb-4">{entry.title}</h1>
          <p className="text-sm text-gray-400 mb-8">By {entry.author || "Anonymous"} on {new Date(entry.createdAt).toLocaleDateString()}</p>
          <div dangerouslySetInnerHTML={{ __html: entry.content.replace(/\\n/g, '<br />') }} />
        </article>
      </div>
    </div>
  );
}
