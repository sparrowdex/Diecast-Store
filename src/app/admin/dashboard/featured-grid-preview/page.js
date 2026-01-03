"use client";
import FeaturedGrid from "./FeaturedGrid";

export default function FeaturedGridPreviewPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-black p-4 md:p-12 font-sans relative selection:bg-black selection:text-white">
      <h1 className="text-4xl font-black tracking-tighter italic mb-10">Featured Exhibits Bento Grid Preview</h1>
      <FeaturedGrid />
    </main>
  );
}
