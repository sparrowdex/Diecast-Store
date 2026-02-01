"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function JournalMediaDisplay({ imageUrl, videoUrl, autoPlay: forceAutoPlay = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);
  const shouldPlay = forceAutoPlay || isHovered;

  // Ensure video plays when visibility/hover changes
  useEffect(() => {
    if (videoRef.current) {
      if (shouldPlay) {
        videoRef.current.play().catch(err => console.warn("Video playback interrupted:", err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [shouldPlay]);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {/* Video Overaly: Triggers on Hover */}
        {videoUrl && (
          <motion.video
            key={`vid-${videoUrl}`}
            ref={videoRef}
            src={videoUrl}
            onCanPlay={() => setVideoReady(true)}
            loop muted playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          />
        )}

        {/* Static Cover with Grayscale filter */}
        {imageUrl && (
          <motion.img
            key={`img-${imageUrl}`}
            src={imageUrl}
            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: (shouldPlay && videoUrl && videoReady) ? 0 : 1,
              scale: (shouldPlay && videoUrl && videoReady) ? 1.1 : 1
            }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
      
      {/* Telemetry Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-20" />
    </div>
  );
}