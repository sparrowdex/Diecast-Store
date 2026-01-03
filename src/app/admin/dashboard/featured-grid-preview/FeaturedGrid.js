"use client";
import { useState, useEffect } from "react";
import BentoGrid from "@/components/BentoGrid";
import CustomCursor from "@/components/CustomCursor";

export default function FeaturedGrid() {
  const [isCursorBlocked, setCursorBlocked] = useState(false);
  const [hoverState, setHoverState] = useState(false);
  const [featuredExhibits, setFeaturedExhibits] = useState([]);

  useEffect(() => {
    async function fetchFeaturedExhibits() {
      const res = await fetch("/api/products?featured=true");
      const data = await res.json();
      setFeaturedExhibits(data);
    }
    fetchFeaturedExhibits();
  }, []);

  return (
    <>
      <BentoGrid
        cars={featuredExhibits}
        layout="hero" // Assuming 'hero' is the layout for featured items
        setHoverState={setHoverState}
        setCursorBlocked={setCursorBlocked}
      />
      <CustomCursor active={hoverState && !isCursorBlocked} />
    </>
  );
}
