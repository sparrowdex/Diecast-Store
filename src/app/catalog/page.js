import prisma from "@/lib/prisma";
import Catalog from "./Catalog";

export default async function CatalogPage() {
  let cars = [];
  try {
    cars = await prisma.product.findMany({
      // No 'where' clause for collectionStatus means it fetches all products (The Master Dictionary)
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error("Database error fetching catalog products:", error);
  }

  return <Catalog cars={cars} />;
}
