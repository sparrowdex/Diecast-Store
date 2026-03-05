// src/components/NewArrivalCardPreview.js
import React from 'react';
import Image from 'next/image';

export default function NewArrivalCardPreview({ car }) {
  if (!car) return null;

  const imageUrl = car.images && car.images.length > 0 ? car.images[0] : '/cars/placeholder.jpg';
  const isOutOfStock = !(car.stock > 0);

  return (
    <div className="relative w-64 h-auto rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white border border-gray-700">
      <div className="relative w-full h-40">
        <Image 
          src={imageUrl} 
          alt={car.name || "New Arrival"} 
          fill 
          className={`object-cover ${isOutOfStock ? 'opacity-40 grayscale' : ''}`} 
        />
        {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="border-2 border-red-500 text-red-500 px-3 py-1 font-black italic uppercase text-sm -rotate-12 bg-gray-800/50 backdrop-blur-[2px]">
                OUT OF STOCK
              </span>
            </div>
        )}
      </div>
      <div className="p-4">
        <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold uppercase">New</span>
        <h3 className="text-lg font-bold truncate mb-1">{car.name || "New Exhibit Title"}</h3>
        <p className="text-sm text-gray-400 mb-2">{car.brand || "Brand"} - {car.scale || "1:--"}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-md font-semibold text-yellow-500">₹{car.price || "0"}</p>
          <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
              isOutOfStock 
                ? 'text-red-400 bg-red-900/50' 
                : 'text-green-400 bg-green-900/50'
            }`}>
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
          </span>
        </div>
      </div>
    </div>
  );
}