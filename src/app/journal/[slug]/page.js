import JournalMediaDisplay from "@/components/JournalMediaDisplay";
import JournalHero from "@/components/journal/JournalHero";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function SingleJournalEntryPage({ params }) {
  const { slug } = await params;
  let entry = null;
  try {
    entry = await prisma.journalEntry.findUnique({
      where: {
        slug: slug,
      },
    });
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    // Let `entry` remain null, which the component already handles.
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-[#fafafa] text-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Entry_Not_Found</h1>
          <Link href="/journal" className="text-[#FF8700] font-geist-mono text-xs uppercase tracking-widest hover:underline">// Return_to_Manifest</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-geist selection:bg-[#FF8700] selection:text-white pb-20">
      {entry.isFeatured ? (
        <JournalHero entry={entry} />
      ) : (
        <header className="relative w-full h-[80vh] overflow-hidden border-b border-white/10">
          <div className="absolute inset-0">
            <JournalMediaDisplay 
              imageUrl={entry.images?.[0]} 
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
          
          <div className="absolute top-12 left-12 z-20">
            <Link href="/journal" className="text-[10px] font-geist-mono text-white/40 uppercase tracking-[0.3em] hover:text-[#FF8700] transition-colors">
              ← Back_to_Archive
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-12 md:p-20">
            <div className="max-w-5xl mx-auto">
              <p className="font-geist-mono text-[10px] uppercase text-[#FF8700] tracking-[0.5em] mb-6">
                // LOG_ENTRY_PROCESSED: {new Date(entry.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                {entry.author && <span className="ml-4 opacity-50">BY: {entry.author}</span>}
              </p>
              <h1 className="text-5xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] text-white drop-shadow-2xl">
                {entry.title}
              </h1>
            </div>
          </div>
        </header>
      )}

      <div className="container mx-auto px-6 md:px-12 mt-20">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-invert prose-orange max-w-none tiptap-content font-geist 
            prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-white
            prose-h1:text-5xl md:prose-h1:text-7xl prose-h1:mb-8
            prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6
            prose-p:text-white/70 prose-p:leading-relaxed prose-p:text-lg
            prose-li:text-white/70 prose-li:marker:text-[#FF8700] prose-ul:list-disc prose-ol:list-decimal">
            <div dangerouslySetInnerHTML={{ __html: entry.content }} />
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
