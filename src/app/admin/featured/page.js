"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// --- Layout Configurations for Mini-Maps and Main Grid ---
const layoutConfigs = [
  {
    name: "hero",
    label: "Hero Layout",
    miniMapGrid: "grid-cols-3 grid-rows-2",
    miniMapSlots: ["col-span-2 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-1"],
    mainGrid: "grid-cols-12 grid-rows-2",
    mainSlots: ["col-span-8 row-span-2", "col-span-4 row-span-1", "col-span-4 row-span-1"],
  },
  {
    name: "panorama",
    label: "Panorama Layout",
    miniMapGrid: "grid-cols-2 grid-rows-2",
    miniMapSlots: ["col-span-2 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1"],
    mainGrid: "grid-cols-12 grid-rows-2",
    mainSlots: ["col-span-12 row-span-1", "col-span-6 row-span-1", "col-span-6 row-span-1"],
  },
  {
    name: "columns",
    label: "Columns Layout",
    miniMapGrid: "grid-cols-3 grid-rows-1",
    miniMapSlots: ["col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1"],
    mainGrid: "grid-cols-12 grid-rows-2",
    mainSlots: ["col-span-4 row-span-2", "col-span-4 row-span-2", "col-span-4 row-span-2"],
  },
  {
    name: "mosaic",
    label: "Mosaic Layout",
    miniMapGrid: "grid-cols-2 grid-rows-2",
    miniMapSlots: ["col-span-1 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-1"],
    mainGrid: "grid-cols-12 grid-rows-2",
    mainSlots: ["col-span-6 row-span-2", "col-span-6 row-span-1", "col-span-6 row-span-1"],
  },
];

export default function FeaturedManagerPage() {
  const [featuredExhibits, setFeaturedExhibits] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState("hero");
  const [isLoading, setIsLoading] = useState(true);

  // Drag & Drop State
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const fetchConfiguration = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch the saved configuration
      const configResponse = await fetch('/api/featured');
      const config = await configResponse.json();
      setSelectedLayout(config.layout || 'hero');

      // 2. Fetch the product details for the saved exhibit IDs
      if (config.exhibitIds && config.exhibitIds.length > 0) {
        const productPromises = config.exhibitIds.map(id =>
          fetch(`/api/products/${id}`).then(res => res.json())
        );
        const products = await Promise.all(productPromises);
        // Ensure the order is preserved
        setFeaturedExhibits(products.filter(p => p)); // Filter out any nulls from failed fetches
      } else {
          // If no IDs, fetch all products marked as featured as a fallback
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

  const handleLayoutSelect = (name) => {
    setSelectedLayout(name);
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset the featured layout to automatic? This will clear your current manual configuration.")) {
      return;
    }

    try {
      const response = await fetch('/api/featured', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to reset configuration');
      }

      alert("Configuration reset successfully! The grid will now update automatically.");
      
      // Re-fetch the default configuration
      await fetchConfiguration();

    } catch (error) {
      console.error("Error resetting configuration:", error);
      alert("Error: Could not reset configuration.");
    }
  };

  const handleSave = async () => {
    const exhibitIds = featuredExhibits.map(exhibit => exhibit.id);
    const payload = {
      layout: selectedLayout,
      exhibitIds: exhibitIds
    };
    
    try {
      const response = await fetch('/api/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      alert("Configuration saved successfully!");
      
    } catch (error) {
      console.error("Error saving configuration:", error);
      alert("Error: Could not save configuration.");
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

  return (
    <div className="p-12 text-white">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
            Featured Exhibits Manager
          </h2>
          <p className="text-xs font-mono text-gray-500">
            Select a layout and drag to arrange your featured exhibits.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleReset} className="bg-red-600 text-white px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-red-700">
            Reset to Automatic
          </button>
          <button onClick={handleSave} className="bg-white text-black px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200">
            Save Configuration
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-24">Loading configuration...</div>
      ) : (
        <div className="bg-[#111] border border-white/5 rounded-lg p-8">
          <h3 className="text-xl font-bold mb-6 text-white">1. Select a Layout Template</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {layoutConfigs.map((config) => (
              <button 
                key={config.name}
                onClick={() => handleLayoutSelect(config.name)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${selectedLayout === config.name ? 'border-yellow-500 bg-white/5' : 'border-gray-800 hover:border-gray-600'}`}
              >
                <span className="block text-sm font-bold mb-2">{config.label}</span>
                <div className={`grid h-12 gap-1 p-1 bg-black/50 rounded ${config.miniMapGrid}`}>
                  {config.miniMapSlots.map((cls, i) => <div key={i} className={`bg-gray-600 rounded-sm ${cls}`} />)}
                </div>
              </button>
            ))}
          </div>

          <h3 className="text-xl font-bold mb-6 text-white mt-12">2. Arrange Exhibits</h3>

          <div className="bg-black/30 p-8 rounded-xl border border-white/5">
            <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Layout Preview</h4>
            <div className={`grid gap-4 w-full aspect-video ${layoutConfigs.find(l => l.name === selectedLayout)?.mainGrid}`}>
              {layoutConfigs.find(l => l.name === selectedLayout)?.mainSlots.slice(0, featuredExhibits.length).map((cls, idx) => {
                  const exhibit = featuredExhibits[idx];
                  return (
                      <div 
                        key={exhibit ? exhibit.id : idx} 
                        draggable
                        onDragStart={() => (dragItem.current = idx)}
                        onDragEnter={() => (dragOverItem.current = idx)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                        className={`relative rounded-xl overflow-hidden cursor-grab transition-all border-2 border-gray-800 hover:border-yellow-500 ${cls}`}
                      >
                        {exhibit ? (
                            <>
                              <img src={exhibit.images[0]} className="w-full h-full object-cover opacity-50" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                              <span className="absolute bottom-4 left-4 text-sm font-bold">{exhibit.name}</span>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-bold uppercase tracking-widest">Empty Slot</div>
                        )}
                      </div>
                  )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}