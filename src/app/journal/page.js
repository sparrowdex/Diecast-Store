"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from 'framer-motion';
import Link from "next/link";

export default function JournalPage() {
  const [stories, setStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/journal');
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStories();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/journal/search?query=${query}`);
      if (!response.ok) {
        throw new Error('Failed to search stories');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const displayedStories = useMemo(() => {
    const base = searchQuery.trim() === "" ? stories : searchResults;
    if (selectedGenre === "All") return base;
    return base.filter(story => story.genre === selectedGenre);
  }, [stories, searchResults, searchQuery, selectedGenre]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-black selection:text-white pb-20">
      
      <div className="bg-white border-b border-black/5 pt-32 pb-12 px-6 md:px-12 mb-16">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-4">
            The_Journal
          </h1>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-[0.3em]">
            Editorial & Insights // Vol. 01
          </p>
          <div className="mt-8 flex flex-wrap gap-6 items-end">
            <div className="max-w-md flex-1">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-black text-white font-mono border-2 border-neutral-800 p-3 text-sm placeholder:text-neutral-500 rounded-none outline-none focus:border-white transition-colors duration-300"
              />
            </div>
            <div className="relative">
                <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="appearance-none bg-black text-white font-mono border-2 border-neutral-800 p-3 text-sm rounded-none outline-none focus:border-white transition-colors duration-300 pr-10 uppercase tracking-widest"
                >
                    <option value="All">All Genres</option>
                    {['CLASSIC_VINTAGE', 'RACE_COURSE', 'CITY_LIFE', 'SUPERPOWERS', 'LUXURY_REDEFINED', 'OFF_ROAD', 'FUTURE_PROOF'].map(g => (
                        <option key={g} value={g}>{g.replace(/_/g, ' ')}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12">
        {displayedStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
              {displayedStories.map((story, i) => (
                  <JournalCard key={story.id} story={story} index={i} />
              ))}
          </div>
        ) : searchQuery.trim() !== "" && (
          <div className="text-center py-20">
            <p className="text-lg font-semibold text-gray-700">No stories found for your search.</p>
            <p className="text-sm text-gray-500">Try a different keyword.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. The Editorial Card Component
function JournalCard({ story, index }) {
    // Logic: First item is "Feature" (Full Width), others are grid columns
    const isFeature = index === 0;

    return (
        <Link href={`/journal/${story.slug}`} className="group cursor-pointer flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`flex flex-col ${isFeature ? 'md:col-span-2 border-b border-black/5 pb-16 mb-8' : 'md:col-span-1'}`}
            >
                {/* Image Container */}
                <div className="overflow-hidden mb-6 relative w-full">
                    <div className={`w-full bg-gray-100 relative overflow-hidden ${isFeature ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
                        {story.videoUrl ? (
                            <video 
                                src={story.videoUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : story.imageUrl ? (
                            <img 
                                src={story.imageUrl}
                                alt={story.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200"></div>
                        )}
                    </div>
                </div>

                {/* Content Container */}
                <div className={`flex flex-col items-start ${isFeature ? 'max-w-4xl' : ''}`}>
                    {/* Meta Data */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                            {new Date(story.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        {story.genre && (
                            <span className="text-[9px] font-mono text-red-600 uppercase tracking-widest border-l border-black/10 pl-3">
                                {story.genre.replace('_', ' ')}
                            </span>
                        )}
                    </div>
                    
                    {/* Headline */}
                    <h2 className={`font-black italic uppercase tracking-tighter mb-4 leading-[0.9] group-hover:text-red-600 transition-colors
                        ${isFeature ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'}
                    `}>
                        {story.title}
                    </h2>
                    
                    {/* Excerpt */}
                    <div className={`text-gray-500 font-serif leading-relaxed mb-6
                        ${isFeature ? 'text-lg md:text-xl max-w-2xl' : 'text-sm'}
                    `} dangerouslySetInnerHTML={{ __html: story.content.substring(0, 200) + '...'}} />


                    {/* 'Read More' Link */}
                    <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all border-b border-transparent group-hover:border-black pb-0.5">
                        <span>Read_Entry</span>
                        <span>→</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}