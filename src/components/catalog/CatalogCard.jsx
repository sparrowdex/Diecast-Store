'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CatalogCard({ car, isPreview = false }) {
  if (!car) return null;

  const { cart, addToCart } = useCart();
  const cartItem = cart?.find(item => item.id === car.id);
  const isOutOfStock = car.stock === 0;

  const CardContent = (
    <div className="group block h-full">
      {/* A11y: Swapped bg-white for #FAFAFA, border to #E5E5E5 */}
      <div className="h-full bg-[#FAFAFA] rounded-xl overflow-hidden border border-[#E5E5E5] hover:border-[#0A0A0A]/20 hover:shadow-xl transition-all duration-500 flex flex-col relative">
        
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-[#F3F3F3] p-4 md:p-8 flex items-center justify-center overflow-hidden">
          <Image
            src={car.images?.[0] || '/placeholder.png'}
            alt={car.name}
            fill
            className={`object-contain transform transition-all duration-700 group-hover:scale-110 group-hover:grayscale mix-blend-multiply ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
          />
          
          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1 z-20">
            {car.scale && (
              <span className="inline-block bg-[#FAFAFA]/80 backdrop-blur-sm border border-[#E5E5E5] rounded px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest text-[#666666]">
                {car.scale}
              </span>
            )}
            {car.modelYear && (
              <span className="inline-block bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/10 rounded px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest text-white">
                {car.modelYear}
              </span>
            )}
          </div>

          {/* Desktop-Only High-Speed "Race Car" Hover Tag (Keeps full "FEATURED EXHIBIT" text) */}
          {car.collectionStatus && car.collectionStatus !== 'ARCHIVE_CATALOG' && !isOutOfStock && (
            <div aria-hidden="true" className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none overflow-hidden z-10">
              <span className="inline-block bg-[#0A0A0A] text-white px-5 py-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transform -skew-x-12 -translate-x-[200%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-2xl">
                {car.collectionStatus.replace('_', ' ')}
              </span>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="border-2 border-[#D30000] text-[#D30000] px-4 py-2 font-black italic uppercase tracking-tighter text-sm -rotate-12 bg-white/10 backdrop-blur-[2px]">
                Depleted
              </span>
            </div>
          )}

          {/* Bottom Right: Vault Tag / Quick Add Button */}
          {!isPreview && !isOutOfStock && (
            <>
              {cartItem && (
                <span className="absolute bottom-3 right-3 z-20 inline-block bg-green-700 text-white rounded px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest transition-opacity duration-300 group-hover:opacity-0">
                  Vaulted x{Number(cartItem.quantity || 1)}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(car);
                }}
                className="absolute bottom-3 right-3 z-30 w-8 h-8 bg-[#0A0A0A] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#D30000] hover:scale-110 shadow-lg translate-y-2 group-hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A0A0A]"
                title="Quick Add to Vault"
                aria-label={`Add ${car.name} to vault`}
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Details Section */}
        <div className="p-3 md:p-5 flex flex-col flex-1 border-t border-[#E5E5E5] relative">
          
          {/* THE FIX: Changing the copy to just "FEATURED" saves us from overlap! */}
          {car.collectionStatus && car.collectionStatus !== 'ARCHIVE_CATALOG' && !isOutOfStock && (
            <div aria-hidden="true" className="absolute top-[18px] right-3 lg:hidden z-10 pointer-events-none">
              <span className="inline-block bg-[#0A0A0A] text-white px-2 py-1 font-black uppercase tracking-widest -rotate-10 shadow-md text-[5.7px]">
                {car.collectionStatus === 'FEATURED_EXHIBIT' ? 'FEATURED' : car.collectionStatus.replace('_', ' ')}
              </span>
            </div>
          )}

          {/* Header Row: Brand/Genre */}
          <div className="mb-1 pr-14">
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#666666] mb-1">
              {car.brand || 'PRECISION'}
            </p>
            {car.genre && (
              <p className="text-[8px] font-bold uppercase tracking-widest text-[#D30000]">
                {car.genre.replace(/_/g, ' ')}
              </p>
            )}
          </div>

          <h3 className="text-xs md:text-sm font-black uppercase tracking-tight italic truncate mb-2 md:mb-4 group-hover:text-[#D30000] text-[#0A0A0A] transition-colors mt-1 md:mt-2 pr-8">
            {car.name}
          </h3>
          
          <div className="mt-auto flex justify-between items-center gap-2 md:gap-3">
            <span className={`text-[7px] md:text-[8px] font-bold uppercase px-2 py-1 rounded-full border whitespace-nowrap ${
              isOutOfStock 
                ? 'text-[#D30000] bg-red-50 border-red-100' 
                : 'text-green-700 bg-green-50 border-green-200'
            }`}>
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </span>
            <p className="text-base md:text-lg font-black italic tracking-tighter text-[#0A0A0A]">
              ₹{car.price?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isPreview) {
    return <div className="h-full cursor-default">{CardContent}</div>;
  }

  return (
    <Link href={`/product/${car.id}`} className="group block h-full focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-[#0A0A0A] rounded-xl">
      {CardContent}
    </Link>
  );
}