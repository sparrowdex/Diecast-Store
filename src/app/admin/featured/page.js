"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

// --- Layout Configurations with Mobile Overrides ---
const layoutConfigs = [
  {
    name: "hero",
    label: "Hero Layout",
    miniMapGrid: "grid-cols-3 grid-rows-2",
    miniMapSlots: ["col-span-2 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-1"],
    // Mobile: Stacked | Desktop: 12-col grid
    mainGrid: "grid-cols-1 md:grid-cols-12 md:grid-rows-2",
    mainSlots: [
      "col-span-1 md:col-span-8 md:row-span-2 min-h-[300px]", 
      "col-span-1 md:col-span-4 md:row-span-1 min-h-[150px]", 
      "col-span-1 md:col-span-4 md:row-span-1 min-h-[150px]"
    ],
  },
  {
    name: "panorama",
    label: "Panorama Layout",
    miniMapGrid: "grid-cols-2 grid-rows-2",
    miniMapSlots: ["col-span-2 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1"],
    mainGrid: "grid-cols-1 md:grid-cols-12 md:grid-rows-2",
    mainSlots: [
      "col-span-1 md:col-span-12 md:row-span-1 min-h-[200px]", 
      "col-span-1 md:col-span-6 md:row-span-1 min-h-[150px]", 
      "col-span-1 md:col-span-6 md:row-span-1 min-h-[150px]"
    ],
  },
  {
    name: "columns",
    label: "Columns Layout",
    miniMapGrid: "grid-cols-3 grid-rows-1",
    miniMapSlots: ["col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1"],
    mainGrid: "grid-cols-1 md:grid-cols-12 md:grid-rows-2",
    mainSlots: [
      "col-span-1 md:col-span-4 md:row-span-2 min-h-[250px]", 
      "col-span-1 md:col-span-4 md:row-span-2 min-h-[250px]", 
      "col-span-1 md:col-span-4 md:row-span-2 min-h-[250px]"
    ],
  },
  {
    name: "mosaic",
    label: "Mosaic Layout",
    miniMapGrid: "grid-cols-2 grid-rows-2",
    miniMapSlots: ["col-span-1 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-1"],
    mainGrid: "grid-cols-1 md:grid-cols-12 md:grid-rows-2",
    mainSlots: [
      "col-span-1 md:col-span-6 md:row-span-2 min-h-[300px]", 
      "col-span-1 md:col-span-6 md:row-span-1 min-h-[150px]", 
      "col-span-1 md:col-span-6 md:row-span-1 min-h-[150px]"
    ],
  },
];

export default function FeaturedManagerPage() {
  const [featuredExhibits, setFeaturedExhibits] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState("hero");
  const [isLoading, setIsLoading] = useState(true);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const fetchConfiguration = useCallback(async () => {
    setIsLoading(true);
    try {
      const configResponse = await fetch('/api/featured');
      const config = await configResponse.json();
      setSelectedLayout(config.layout || 'hero');

      if (config.exhibitIds && config.exhibitIds.length > 0) {
        const productPromises = config.exhibitIds.map(id =>
          fetch(`/api/products/${id}`).then(res => res.json())
        );
        const products = await Promise.all(productPromises);
        setFeaturedExhibits(products.filter(p => p));
      } else {
        const response = await fetch('/api/products?featured=true');
        const featuredProducts = await response.json();
        setFeaturedExhibits(featuredProducts);
      }
    } catch (error) {
      console.error("Error fetching configuration:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfiguration();
  }, [fetchConfiguration]);

  const handleLayoutSelect = (name) => setSelectedLayout(name);

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset to automatic?")) return;
    try {
      await fetch('/api/featured', { method: 'DELETE' });
      alert("Configuration reset!");
      await fetchConfiguration();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    const payload = { layout: selectedLayout, exhibitIds: featuredExhibits.map(e => e.id) };
    try {
      const response = await fetch('/api/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) alert("Saved successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSort = useCallback(() => {
    let _featuredExhibits = [...featuredExhibits];
    const draggedItemContent = _featuredExhibits.splice(dragItem.current, 1)[0];
    _featuredExhibits.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFeaturedExhibits(_featuredExhibits);
  }, [featuredExhibits]);

  const currentLayout = layoutConfigs.find(l => l.name === selectedLayout);

  return (
    <div className="p-6 md:p-12 text-white max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-2">
            Featured Exhibits Manager
          </h2>
          <p className="text-[10px] md:text-xs font-mono text-gray-500">
            Select a layout and drag to arrange your featured exhibits.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={handleReset} className="flex-1 md:flex-none bg-red-600/20 border border-red-600 text-red-500 px-4 py-2 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors">
            Reset
          </button>
          <button onClick={handleSave} className="flex-1 md:flex-none bg-white text-black px-4 py-2 font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-24 animate-pulse">Loading configuration...</div>
      ) : (
        <div className="space-y-12">
          {/* Section 1: Template Selection */}
          <section className="bg-[#111] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-bold mb-6 uppercase tracking-widest text-gray-400">1. Select Template</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {layoutConfigs.map((config) => (
                <button 
                  key={config.name}
                  onClick={() => handleLayoutSelect(config.name)}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${selectedLayout === config.name ? 'border-yellow-500 bg-yellow-500/5' : 'border-gray-800 hover:border-gray-700'}`}
                >
                  <span className="block text-[10px] font-bold mb-3 uppercase tracking-tight">{config.label}</span>
                  <div className={`grid h-10 gap-1 p-1 bg-black/50 rounded-sm ${config.miniMapGrid}`}>
                    {config.miniMapSlots.map((cls, i) => <div key={i} className={`bg-gray-700 rounded-[1px] ${cls}`} />)}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Section 2: Interactive Preview */}
          <section className="bg-[#111] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-bold mb-6 uppercase tracking-widest text-gray-400">2. Arrange & Preview</h3>
            <div className={`grid gap-3 md:gap-4 ${currentLayout?.mainGrid}`}>
              {currentLayout?.mainSlots.slice(0, 3).map((cls, idx) => {
                const exhibit = featuredExhibits[idx];
                return (
                  <div 
                    key={exhibit?.id || idx} 
                    draggable
                    onDragStart={() => (dragItem.current = idx)}
                    onDragEnter={() => (dragOverItem.current = idx)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                    className={`group relative rounded-lg overflow-hidden cursor-grab active:cursor-grabbing transition-all border border-white/10 hover:border-yellow-500/50 ${cls}`}
                  >
                    {exhibit ? (
                      <>
                        <Image src={exhibit.images[0]} alt={exhibit.name} fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                           <p className="text-[10px] text-yellow-500 font-mono mb-1 uppercase tracking-widest">Slot {idx + 1}</p>
                           <p className="text-xs md:text-sm font-bold truncate">{exhibit.name}</p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full min-h-[150px] flex items-center justify-center bg-white/5 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                        Empty Slot
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}