"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

function Tag({ text, colorClass }) {
    return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider ${colorClass}`}>
            {text}
        </span>
    );
}

export default function StandardCard({ car, isPreview = false }) {
    const router = useRouter();
    const { addToCart } = useCart(); 
    const [isHovered, setIsHovered] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    const images = car.images && car.images.length > 0 ? car.images : [car.image];

    useEffect(() => {
        let interval;
        let timeout;

        if (isHovered && images.length > 1) {
            // Start carousel after a short delay
            timeout = setTimeout(() => {
                interval = setInterval(() => {
                    setCurrentImage(prev => (prev + 1) % images.length);
                }, 2000); // Change image every 2 seconds
            }, 500); // Wait 500ms before starting carousel
        } else {
            setCurrentImage(0);
        }

        return () => {
            clearTimeout(timeout);
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isHovered, images]);

    const handleClick = () => {
        if (!isPreview) {
            router.push(`/product/${car.id}`);
        }
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!isPreview) {
            addToCart(car);
        }
    };
  
    return (
      <motion.div 
        layout
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="group cursor-pointer"
      >
        <div className="relative aspect-square bg-[#f8f8f8] rounded-sm flex items-center justify-center p-6 mb-3 border border-transparent group-hover:border-black/5 transition-colors overflow-hidden">
            <AnimatePresence>
                <motion.img
                    key={currentImage}
                    layoutId={isPreview ? null : `car-image-${car.id}`}
                    src={images[currentImage]}
                    alt={car.name}
                    className="w-full h-full object-contain absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: 1, 
                        transition: { duration: 0.7, ease: "easeInOut" } 
                    }}
                    exit={{ 
                        opacity: 0, 
                        transition: { duration: 0.7, ease: "easeInOut" } 
                    }}
                    style={{
                        filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        transition: 'filter 0.5s ease-in-out, transform 0.5s ease-in-out',
                    }}
                />
            </AnimatePresence>

          <div className="absolute top-2 left-2 z-10">
            <span className="text-[8px] font-mono border border-black/10 bg-white/50 backdrop-blur-sm px-1.5 py-0.5 rounded text-gray-500">{car.scale}</span>
          </div>
          
          {/* New Tags */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
            {car.isFeatured && <Tag text="Featured" colorClass="bg-black text-white" />}
            {car.isNew && !car.isFeatured && <Tag text="New" colorClass="bg-white text-black border border-gray-200" />}
          </div>
          
          {/* ADD TO CART OVERLAY BUTTON */}
          {!isPreview && (
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
               <button 
                 onClick={handleAddToCart}
                 disabled={isPreview}
                 className="bg-black text-white text-[8px] px-3 py-1.5 uppercase font-bold rounded-full hover:bg-red-600 transition-colors"
               >
                 Add +
               </button>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-tight truncate">{car.name}</h4>
          <div className="flex justify-between items-center mt-1 text-[10px]">
            <span className="text-gray-400">{car.brand}</span>
            <span className="font-bold">{car.price}</span>
          </div>
        </div>
      </motion.div>
    );
  }