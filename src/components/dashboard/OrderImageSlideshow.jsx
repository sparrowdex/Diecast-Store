"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderImageSlideshow({ items }) {
  // Extract only the first image (cover) of each UNIQUE model in the order
  const uniqueCoverImages = useMemo(() => {
    const seen = new Set();
    const images = [];
    for (const item of items) {
      const productId = item.product?.id;
      const firstImage = item.product?.images?.[0];
      if (productId && firstImage && !seen.has(productId)) {
        seen.add(productId);
        images.push(firstImage);
      }
    }
    return images;
  }, [items]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (uniqueCoverImages.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % uniqueCoverImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(timer);
  }, [uniqueCoverImages.length]);

  if (uniqueCoverImages.length === 0) {
    return <div className="w-full h-full bg-white/5 animate-pulse rounded-sm" />;
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <Image
            src={uniqueCoverImages[currentIndex]}
            alt="Acquisition"
            fill
            className="object-contain"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Progress Indicators */}
      {uniqueCoverImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {uniqueCoverImages.map((_, i) => (
            <div 
              key={i} 
              className={`h-0.5 rounded-full transition-all duration-500 ${
                i === currentIndex ? 'bg-orange-500 w-4' : 'bg-white/20 w-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
