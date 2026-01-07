"use client";
import BentoCard from "./BentoCard";

// --- LAYOUT DEFINITIONS (12-col grid) ---
const layouts = {
  hero: [
    "md:col-span-8 md:row-span-2", // Slot 1
    "md:col-span-4 md:row-span-1", // Slot 2
    "md:col-span-2 md:row-span-1", // Slot 3
    "md:col-span-2 md:row-span-1", // Slot 4
  ],
  panorama: [
    "md:col-span-12 md:row-span-1", // Slot 1
    "md:col-span-4 md:row-span-1",  // Slot 2
    "md:col-span-4 md:row-span-1",  // Slot 3
    "md:col-span-4 md:row-span-1",  // Slot 4
  ],
  quad: [
    "md:col-span-6 md:row-span-1", // Slot 1
    "md:col-span-6 md:row-span-1", // Slot 2
    "md:col-span-6 md:row-span-1", // Slot 3
    "md:col-span-6 md:row-span-1", // Slot 4
  ],
  mosaic: [
    "md:col-span-4 md:row-span-1", // Slot 1
    "md:col-span-8 md:row-span-1", // Slot 2
    "md:col-span-8 md:row-span-1", // Slot 3
    "md:col-span-4 md:row-span-1", // Slot 4
  ],
  // New Automatic Layouts
  'automatic-single': [
    "md:col-span-12 md:row-span-2",
  ],
  'automatic-double': [
    "md:col-span-6 md:row-span-2",
    "md:col-span-6 md:row-span-2",
  ],
  'trio-hero-left': [
    "md:col-span-6 md:row-span-2",
    "md:col-span-6 md:row-span-1",
    "md:col-span-6 md:row-span-1",
  ],
  'trio-hero-top': [
    "md:col-span-12 md:row-span-1",
    "md:col-span-6 md:row-span-1",
    "md:col-span-6 md:row-span-1",
  ],
  'trio-staggered': [
    "md:col-span-7 md:row-span-2",
    "md:col-span-5 md:row-span-1",
    "md:col-span-5 md:row-span-1",
  ]
};


export default function BentoGrid({ cars, layout = 'hero', setCursorBlocked, setHoverState, isPreview = false }) {
  const bentoLayout = layouts[layout] || layouts.hero;
  
  // We only render as many cars as the layout supports
  const carsToRender = cars.slice(0, bentoLayout.length);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[200px]`}>
      {carsToRender.map((car, index) => (
        <BentoCard 
          key={`${car.id}-${index}`}
          car={car} 
          layout={bentoLayout[index]}
          setHoverState={setHoverState} 
          setCursorBlocked={setCursorBlocked}
          isPreview={isPreview}
        />
      ))}
    </div>
  );
}
