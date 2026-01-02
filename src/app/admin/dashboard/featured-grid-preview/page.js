"use client"; // This component uses useState
import { useState } from "react";
import prisma from "@/lib/prisma";
import BentoGrid from "@/components/BentoGrid";
import CustomCursor from "@/components/CustomCursor";

export default async function FeaturedGridPreviewPage() {
  // These states are typically managed in the client component that wraps BentoGrid,
  // but for a simple preview page, we can define them here for consistency with Gallery.js
  const [isCursorBlocked, setCursorBlocked] = useState(false);
  const [hoverState, setHoverState] = useState(false);

  const featuredExhibits = await prisma.product.findMany({
    where: {
      featured: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#fafafa] text-black p-4 md:p-12 font-sans relative selection:bg-black selection:text-white">
      <h1 className="text-4xl font-black tracking-tighter italic mb-10">Featured Exhibits Bento Grid Preview</h1>
      <BentoGrid
          cars={featuredExhibits}
          layout="hero" // Assuming 'hero' is the layout for featured items
          setHoverState={setHoverState}
          setCursorBlocked={setCursorBlocked}
      />
      <CustomCursor active={hoverState && !isCursorBlocked} />
    </main>
  );
}