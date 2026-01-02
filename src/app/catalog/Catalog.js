"use client";

import { useState, useMemo } from 'react';
import CatalogCard from '@/components/CatalogCard';

export default function Catalog({ cars }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [scaleFilter, setScaleFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  
  // NEW: State to manage "Show More" toggle
  const [showAllScales, setShowAllScales] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Constants
  const VISIBLE_LIMIT = 5; // How many tiles to show before hiding the rest

  // Dynamically get unique options
  const brands = useMemo(() => ['All', ...new Set(cars.map(car => car.brand))], [cars]);
  const scales = useMemo(() => ['All', ...new Set(cars.map(car => car.scale))], [cars]);

  // Filter Logic
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            car.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesScale = scaleFilter === 'All' || car.scale === scaleFilter;
      const matchesBrand = brandFilter === 'All' || car.brand === brandFilter;
      return matchesSearch && matchesScale && matchesBrand;
    });
  }, [searchTerm, scaleFilter, brandFilter, cars]);

  // Helper Component for Filter Groups to keep JSX clean
  const FilterGroup = ({ title, items, selected, setSelected, isExpanded, setExpanded }) => {
    const visibleItems = isExpanded ? items : items.slice(0, VISIBLE_LIMIT);
    const hiddenCount = items.length - VISIBLE_LIMIT;

    return (
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</h3>
          {/* Optional: Clear selection if something is selected */}
          {selected !== 'All' && (
            <button onClick={() => setSelected('All')} className="text-[9px] text-red-500 underline">Clear</button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {visibleItems.map(item => (
            <button
              key={item}
              onClick={() => setSelected(item)}
              className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider border rounded-sm transition-all duration-200
                ${selected === item 
                  ? 'bg-black text-white border-black shadow-md' 
                  : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:text-black'
                }`}
            >
              {item === 'All' ? 'View All' : item}
            </button>
          ))}
          
          {/* The "Expand" Button (Only shows if there are hidden items) */}
          {!isExpanded && hiddenCount > 0 && (
            <button
              onClick={() => setExpanded(true)}
              className="px-4 py-2.5 text-[10px] font-mono text-gray-400 border border-transparent hover:text-black transition-colors flex items-center gap-1"
            >
              <span>+ {hiddenCount} More</span>
            </button>
          )}

          {/* The "Collapse" Button (Only shows if expanded) */}
          {isExpanded && items.length > VISIBLE_LIMIT && (
            <button
              onClick={() => setExpanded(false)}
              className="px-4 py-2.5 text-[10px] font-mono text-gray-400 border border-transparent hover:text-black transition-colors"
            >
              Show Less
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-black selection:text-white pb-20">
      
      {/* 1. Header */}
      <div className="bg-white border-b border-black/5 pt-32 pb-12 px-6 md:px-12 mb-10">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-4">
            The_Catalog
          </h1>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-[0.3em]">
            Curated Index // {filteredCars.length} Exhibits
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12">
        
        {/* 2. SMART FILTER DASHBOARD */}
        <div className="mb-16">
          
          {/* A. Large Search Bar */}
          <div className="relative mb-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Search specific models..."
              className="w-full pl-12 pr-4 py-4 bg-transparent border-b-2 border-gray-100 focus:border-black focus:outline-none text-xl font-mono placeholder-gray-200 transition-colors"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-12 border-b border-gray-100 pb-12">
            
            {/* B. Scale Section with Expand Logic */}
            <FilterGroup 
              title="Filter by Scale" 
              items={scales} 
              selected={scaleFilter} 
              setSelected={setScaleFilter} 
              isExpanded={showAllScales}
              setExpanded={setShowAllScales}
            />

            {/* C. Brand Section with Expand Logic */}
            <FilterGroup 
              title="Filter by Brand" 
              items={brands} 
              selected={brandFilter} 
              setSelected={setBrandFilter} 
              isExpanded={showAllBrands}
              setExpanded={setShowAllBrands}
            />

          </div>
        </div>

        {/* 3. The Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredCars.map(car => (
              <CatalogCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
            <p className="text-4xl text-gray-300 font-black italic mb-2">0_RESULTS</p>
            <p className="text-xs font-mono text-gray-400 uppercase">Adjust filters to reveal inventory.</p>
            <button 
                onClick={() => {setSearchTerm(''); setScaleFilter('All'); setBrandFilter('All');}}
                className="mt-6 px-6 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-gray-800"
            >
                Reset All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
