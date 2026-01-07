import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function SingleJournalEntryPage({ params }) {
  const { slug } = params;
  const entry = await prisma.journalEntry.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!entry) {
    return (
      <div className="min-h-screen bg-[#fafafa] text-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Entry not found</h1>
          <Link href="/journal" className="text-yellow-500 hover:underline">Return to Journal</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-black selection:text-white pb-20">
      <div className="bg-white border-b border-black/5 pt-32 pb-12 px-6 md:px-12">
        <div className="container mx-auto">
          <Link href="/journal" className="text-xs font-mono text-gray-400 uppercase tracking-[0.3em] hover:text-red-600 transition-colors">
            ← Back to Journal
          </Link>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mt-4 mb-2">
            {entry.title}
          </h1>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
            By {entry.author || "Anonymous"} on {new Date(entry.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-16">
        <div className="max-w-4xl mx-auto">
          {(entry.imageUrl || entry.videoUrl) && (
            <div className="mb-12">
              {entry.videoUrl ? (
                <video 
                  src={entry.videoUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full rounded-lg shadow-lg"
                />
              ) : entry.imageUrl ? (
                <img 
                  src={entry.imageUrl} 
                  alt={entry.title} 
                  className="w-full rounded-lg shadow-lg"
                />
              ) : null}
            </div>
          )}
          <article className="prose prose-lg">
            <div dangerouslySetInnerHTML={{ __html: entry.content }} />
          </article>
        </div>
      </div>
    </div>
  );
}
