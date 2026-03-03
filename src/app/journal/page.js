"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from 'framer-motion';
import Link from "next/link";
import JournalMediaDisplay from "@/components/JournalMediaDisplay";
import SubPageNavbar from "@/components/SubPageNavbar";

const GENRES = ["All", "CLASSIC_VINTAGE", "RACE_COURSE", "CITY_LIFE", "SUPERPOWERS", "LUXURY_REDEFINED", "OFF_ROAD", "FUTURE_PROOF"];

export default function JournalPage() {
  const [stories, setStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/journal');
        if (!response.ok) throw new Error('Failed to fetch stories');
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
      if (!response.ok) throw new Error('Failed to search stories');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const displayedStories = useMemo(() => {
    const published = (searchQuery.trim() === "" ? stories : searchResults).filter(s => Boolean(s.isPublished));
    if (!selectedGenre || selectedGenre === "All") return published;
    return published.filter(story => story.genre?.toUpperCase() === selectedGenre.toUpperCase());
  }, [stories, searchResults, searchQuery, selectedGenre]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-black selection:text-white pb-20">
      <SubPageNavbar 
        title="Journal Ref.01"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Collection', href: '/access' },
          { name: 'Catalog', href: '/catalog' },
        ]}
      />
      
      {/* 1. Header Section */}
      <div className="bg-white border-b border-black/5 pt-12 pb-12 px-6 md:px-12 mb-16">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-4">
            THE JOURNAL
          </h1>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-[0.3em]">
            Editorial & Insights // Vol. 01
          </p>

          {/* 2. Unified Search & Filter Controls - Updated for Side-by-Side Mobile */}
          <div className="mt-12 flex flex-row gap-4 md:gap-8 items-end">
            
            {/* Search Input - Flex 1 */}
            <div className="flex-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Search Insights</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-black text-white font-mono border-2 border-neutral-800 p-4 text-sm placeholder:text-neutral-500 rounded-none outline-none focus:border-white transition-all duration-300 shadow-sm"
              />
            </div>

            {/* Filter Section - Flex 1 */}
            <div className="flex-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Category</span>
              
              {/* Desktop: Pill Filter */}
              <div className="hidden md:flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className={`px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${
                      selectedGenre === g 
                      ? 'bg-black text-white border-black shadow-lg' 
                      : 'bg-white text-black border-gray-200 hover:border-black'
                    }`}
                  >
                    {g === 'All' ? 'View All' : g.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              {/* Mobile: Genre Dropdown to match Search Bar length */}
              <div className="md:hidden relative">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full appearance-none bg-black text-white font-mono border-2 border-neutral-800 p-4 text-sm rounded-none outline-none focus:border-white transition-colors duration-300 pr-10 uppercase tracking-widest"
                >
                  {GENRES.map(g => (
                    <option key={g} value={g}>{g === 'All' ? 'View All' : g.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
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
        ) : (
          <div className="text-center py-32 border-2 border-dashed border-black/5">
            <p className="text-2xl font-black italic uppercase opacity-20 tracking-tighter mb-2">0_ENTRIES_FOUND</p>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Adjust search parameters to reveal archive.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function JournalCard({ story, index }) {
    const isFeature = index === 0;

    return (
        <Link href={`/journal/${story.slug}`} className={`group cursor-pointer flex flex-col ${isFeature ? 'md:col-span-2' : 'md:col-span-1'}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`flex flex-col ${isFeature ? 'border-b border-black/5 pb-16 mb-8' : ''}`}
            >
                {/* Image Container */}
                <div className="overflow-hidden mb-6 relative w-full border border-black/5">
                    <div className={`w-full bg-[#f9f9f9] relative overflow-hidden transition-all duration-700 ${isFeature ? 'aspect-video' : 'aspect-[3/2]'}`}>
                        {(story.images?.[0] || story.video) ? (
                            <JournalMediaDisplay 
                                imageUrl={story.images?.[0]} 
                                videoUrl={story.video} 
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200"></div>
                        )}
                    </div>
                </div>

                {/* Content Container */}
                <div className={`flex flex-col items-start ${isFeature ? 'max-w-4xl' : ''}`}>
                    {/* Headline */}
                    <h2 className={`font-black italic uppercase tracking-tighter mb-4 leading-[0.9] group-hover:text-red-600 transition-colors
                        ${isFeature ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'}
                    `}>
                        {story.title}
                    </h2>

                    {/* Meta Data - Moved below title and added Read Time */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                            {new Date(story.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        {story.author && (
                            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest border-l border-black/10 pl-3">BY: {story.author}</span>
                        )}
                        {story.genre && (
                            <span className="text-[9px] font-mono text-red-600 uppercase tracking-widest border-l border-black/10 pl-3">
                                {story.genre.replace(/_/g, ' ')}
                            </span>
                        )}
                    </div>
                    
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