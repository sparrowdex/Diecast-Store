"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function JournalMediaDisplay({ imageUrl, videoUrl, altText }) {
  const [mediaError, setMediaError] = useState(false);

  const activeMedia = videoUrl ? { url: videoUrl, type: 'video' } : imageUrl ? { url: imageUrl, type: 'image' } : null;
  const isVideo = activeMedia?.type === 'video';

  useEffect(() => {
    setMediaError(false);
  }, [imageUrl, videoUrl]);

  const handleMediaError = () => {
    setMediaError(true);
  };

  if (!activeMedia) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {mediaError ? (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 min-h-[200px] bg-gray-100 rounded-lg">
            <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm font-mono text-center">Failed to load media.<br/>Please check your connection.</p>
          </div>
        ) : isVideo ? (
          <motion.video
            key={activeMedia.url}
            src={activeMedia.url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onError={handleMediaError}
          />
        ) : (
          <motion.img
            key={activeMedia.url}
            src={activeMedia.url}
            alt={altText}
            className="w-full rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onError={handleMediaError}
          />
        )}
      </AnimatePresence>
    </div>
  );
}