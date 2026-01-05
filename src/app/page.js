import prisma from "@/lib/prisma";
import Gallery from "./Gallery";

export default async function GalleryPage() {
  try {
    // This simple query tests the Neon adapter connection
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-red-600 font-bold">Connection Failed</h1>
        <p className="text-sm text-gray-500">Check your DATABASE_URL in .env</p>
        <pre className="mt-4 bg-red-50 p-4 rounded text-xs">
          {String(error)}
        </pre>
      </div>
    );
  }

  const featuredExhibits = await prisma.product.findMany({
    where: {
      category: "Featured Exhibit",
    },
  });

  const archiveCollection = await prisma.product.findMany({
    where: {
      category: "Archive",
    },
  });

  const newArrivals = await prisma.product.findMany({
    where: {
      category: "New Arrival",
    },
  });

  return (
    <Gallery
      featuredExhibits={featuredExhibits}
      archiveCollection={archiveCollection}
      newArrivals={newArrivals}
    />
  );
}