"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CustomCursor({ active }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
    useEffect(() => {
      const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);
  
    return (
      <motion.div
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          scale: active ? 1 : 0,
          opacity: active ? 1 : 0
        }}
        transition={{ type: "spring", damping: 30, stiffness: 250, mass: 0.8 }}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ translateX: "-50%", translateY: "-50%" }} 
      >
        <div className="w-24 h-8 bg-white/20 backdrop-blur-md border border-white/50 shadow-2xl flex items-center justify-center rounded-sm">
          <span className="text-[9px] font-black tracking-widest text-black uppercase">
            View
          </span>
        </div>
      </motion.div>
    );
}