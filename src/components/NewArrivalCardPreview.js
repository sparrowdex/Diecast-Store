// src/components/NewArrivalCardPreview.js
import React from 'react';

export default function NewArrivalCardPreview({ car }) {
  const imageUrl = car.images && car.images.length > 0 ? car.images[0] : '/cars/placeholder.jpg';

  return (
    <div className="relative w-64 h-auto rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white border border-gray-700">
      <img src={imageUrl} alt={car.name || "New Arrival"} className="w-full h-40 object-cover" />
      <div className="p-4">
        <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold uppercase">New</span>
        <h3 className="text-lg font-bold truncate mb-1">{car.name || "New Exhibit Title"}</h3>
        <p className="text-sm text-gray-400 mb-2">{car.brand || "Brand"} - {car.scale || "1:--"}</p>
        <p className="text-md font-semibold text-yellow-500">₹{car.price || "0"}</p>
      </div>
    </div>
  );
}