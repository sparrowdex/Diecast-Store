// src/components/FeaturedExhibitPreviewStatic.js
import React from 'react';

export default function FeaturedExhibitPreviewStatic({ car }) {
  const imageUrl = car.images && car.images.length > 0 ? car.images[0] : '/cars/placeholder.jpg';

  return (
    <div className="relative w-full md:w-3/4 lg:w-1/2 mx-auto rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white border border-gray-700">
      <img src={imageUrl} alt={car.name || "Featured Exhibit"} className="w-full h-64 object-cover" />
      <div className="p-4">
        <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold uppercase">Featured</span>
        <h3 className="text-xl font-bold mb-2">{car.name || "Featured Exhibit Title"}</h3>
        <p className="text-md text-gray-400">{car.brand || "Brand"} - {car.scale || "1:--"}</p>
      </div>
    </div>
  );
}