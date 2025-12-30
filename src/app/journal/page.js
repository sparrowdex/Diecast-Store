"use client";

import { motion } from 'framer-motion';

// Mock Data - I updated the images to match your likely file paths from 'data.js'
// so they actually show up instead of breaking.
const STORIES = [
  {
    id: 1,
    category: "Feature_Story",
    date: "DEC 28, 2025",
    title: "The Rise of Red Bull Racing",
    excerpt: "From a party brand to a Formula 1 powerhouse. We explore the meteoric rise of the team that changed the grid forever, featuring the iconic RB15 chassis.",
    image: "/cars/rb15.jpg", // RB15 Image
    readTime: "4 MIN READ"
  },
  {
    id: 2,
    category: "Collector_Guide",
    date: "DEC 15, 2025",
    title: "Why 1:43 is the Perfect Scale",
    excerpt: "Detail, size, and affordability. Discover why the 1:43 scale has become the gold standard for serious collectors who want a garage on their desk.",
    image: "/cars/mclaren.jpg", // McLaren Image
    readTime: "3 MIN READ"
  },
  {
    id: 3,
    category: "Design_Study",
    date: "NOV 02, 2025",
    title: "The Allure of Maybach",
    excerpt: "A symbol of ultimate luxury and craftsmanship. We delve into the history of Maybach's V12 legacy and the pursuit of silence.",
    image: "/cars/maybach.jpg", // Maybach Image
    readTime: "6 MIN READ"
  },
];

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-black selection:text-white pb-20">
      
      {/* 1. Header (Consistent with Catalog) */}
      <div className="bg-white border-b border-black/5 pt-32 pb-12 px-6 md:px-12 mb-16">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-4">
            The_Journal
          </h1>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-[0.3em]">
            Editorial & Insights // Vol. 01
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {STORIES.map((story, i) => (
                <JournalCard key={story.id} story={story} index={i} />
            ))}
        </div>
      </div>
    </div>
  );
}

// 2. The Editorial Card Component
function JournalCard({ story, index }) {
    // Logic: First item is "Feature" (Full Width), others are grid columns
    const isFeature = index === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={`group cursor-pointer flex flex-col ${isFeature ? 'md:col-span-2 border-b border-black/5 pb-16 mb-8' : 'md:col-span-1'}`}
        >
            {/* Image Container */}
            <div className="overflow-hidden mb-6 relative w-full">
                <div className={`w-full bg-gray-100 relative overflow-hidden ${isFeature ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
                    <img 
                        src={story.image} 
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            </div>

            {/* Content Container */}
            <div className={`flex flex-col items-start ${isFeature ? 'max-w-4xl' : ''}`}>
                {/* Meta Data */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-black text-white px-2 py-1">
                        {story.category}
                    </span>
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                        {story.date}
                    </span>
                    <span className="text-[9px] font-mono text-gray-300 uppercase tracking-widest">
                         • {story.readTime}
                    </span>
                </div>
                
                {/* Headline */}
                <h2 className={`font-black italic uppercase tracking-tighter mb-4 leading-[0.9] group-hover:text-red-600 transition-colors
                    ${isFeature ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'}
                `}>
                    {story.title}
                </h2>
                
                {/* Excerpt */}
                <p className={`text-gray-500 font-serif leading-relaxed mb-6
                    ${isFeature ? 'text-lg md:text-xl max-w-2xl' : 'text-sm'}
                `}>
                    {story.excerpt}
                </p>

                {/* 'Read More' Link */}
                <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all border-b border-transparent group-hover:border-black pb-0.5">
                    <span>Read_Entry</span>
                    <span>→</span>
                </div>
            </div>
        </motion.div>
    )
}