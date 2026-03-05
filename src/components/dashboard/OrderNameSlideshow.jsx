"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderNameSlideshow({ items }) {
  // Extract unique model names from the order items
  const uniqueNames = useMemo(() => {
    const seen = new Set();
    const names = [];
    for (const item of items) {
      const productId = item.product?.id;
      const name = item.product?.name;
      if (productId && name && !seen.has(productId)) {
        seen.add(productId);
        names.push(name);
      }
    }
    return names;
  }, [items]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (uniqueNames.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % uniqueNames.length);
    }, 4000); // Matches the 4s interval of the image slideshow

    return () => clearInterval(timer);
  }, [uniqueNames.length]);

  if (uniqueNames.length === 0) return "Unknown Asset";
  if (uniqueNames.length === 1) return uniqueNames[0];

  return (
    <div className="relative h-[1em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="block truncate"
        >
          {uniqueNames[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}