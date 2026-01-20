import prisma from "@/lib/prisma";
import Gallery from "./Gallery";
import fs from 'fs/promises';
import path from 'path';

async function getFeaturedExhibits() {
  const configPath = path.join(process.cwd(), 'prisma', 'featured_config.json');

  // 1. Prioritize manual configuration
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(fileContent);

    if (config.exhibitIds && config.exhibitIds.length > 0) {
      try {
        const products = await prisma.product.findMany({
          where: { id: { in: config.exhibitIds } },
        });

        const orderedProducts = config.exhibitIds.map(id => products.find(p => p.id === id)).filter(Boolean);

        return {
          layout: config.layout || 'hero',
          exhibits: orderedProducts,
        };
      } catch (dbError) {
        console.error("Database error fetching featured exhibits:", dbError);
        return { layout: 'hero', exhibits: [] };
      }
    }
  } catch (error) {
    // Error reading config or config is empty, proceed to automatic logic
    // console.error("Could not read featured config, proceeding to automatic layout.", error);
  }

  // 2. Fallback to automatic logic
  try {
    const exhibits = await prisma.product.findMany({
      where: { category: "Featured Exhibit" },
      orderBy: { createdAt: 'desc' }
    });

    switch (exhibits.length) {
      case 1:
        return { layout: 'automatic-single', exhibits };
      case 2:
        return { layout: 'automatic-double', exhibits };
      case 3:
        return { layout: 'trio-hero-left', exhibits };
      default:
        // For 0 or 4+ exhibits, use the hero layout. BentoGrid will slice the array.
        return { layout: 'hero', exhibits };
    }
  } catch (dbError) {
    console.error("Database error fetching automatic featured exhibits:", dbError);
    return { layout: 'hero', exhibits: [] };
  }
}


export default async function GalleryPage() {
  const { layout, exhibits: featuredExhibits } = await getFeaturedExhibits();

  let archiveCollection = [];
  try {
    archiveCollection = await prisma.product.findMany({
      where: {
        category: "Archive",
      },
    });
  } catch (error) {
    console.error("Database error fetching archive collection:", error);
  }

  let newArrivals = [];
  try {
    newArrivals = await prisma.product.findMany({
      where: {
        category: "New Arrival",
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });
  } catch (error) {
    console.error("Database error fetching new arrivals:", error);
  }

  return (
    <Gallery
      featuredLayout={layout}
      featuredExhibits={featuredExhibits}
      archiveCollection={archiveCollection}
      newArrivals={newArrivals}
    />
  );
}
