// src/components/CatalogCard.js
"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CatalogCard({ car }) {
  const { addToCart } = useCart();

  return (
    <Link href={`/product/${car.id}`} className="group block h-full">
      <div className="h-full bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-black/10 hover:shadow-xl transition-all duration-500 flex flex-col relative">
        
        {/* Image Container with Zoom Effect */}
        <div className="relative aspect-[4/3] bg-[#f9f9f9] p-8 flex items-center justify-center overflow-hidden">
          <img
            src={car.images && car.images.length > 0 ? car.images[0] : ''}
            alt={car.name}
            className="w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className="inline-block bg-white/80 backdrop-blur-sm border border-gray-200 rounded px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest text-gray-500">
              {car.scale}
            </span>
            {car.modelYear && (
              <span className="inline-block bg-black/80 backdrop-blur-sm border border-white/10 rounded px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest text-white">
                {car.modelYear}
              </span>
            )}
          </div>

          {/* Quick Add Overlay Button */}
          <button
            onClick={(e) => {
              e.preventDefault(); // Stop navigation
              addToCart(car);
            }}
            className="absolute bottom-3 right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110 shadow-lg translate-y-2 group-hover:translate-y-0"
            title="Quick Add to Vault"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        {/* Details Section */}
        <div className="p-5 flex flex-col flex-1 border-t border-gray-50">
          <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-1">
            {car.brand}
          </p>
          {car.genre && (
            <p className="text-[8px] font-bold uppercase tracking-widest text-red-600 mb-1">
              {car.genre.replace(/_/g, ' ')}
            </p>
          )}
          <h3 className="text-sm font-black uppercase tracking-tight italic truncate mb-4 group-hover:text-red-600 transition-colors">
            {car.name}
          </h3>
          
          <div className="mt-auto flex justify-between items-end">
            <p className="text-lg font-black italic tracking-tighter">
              ₹{car.price}
            </p>
            <span className="text-[8px] font-bold uppercase text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
              In Stock
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}