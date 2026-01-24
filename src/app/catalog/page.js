import prisma from "@/lib/prisma";
import Catalog from "./Catalog";

export default async function CatalogPage() {
  let cars = [];
  try {
    cars = await prisma.product.findMany({
      where: {
        collectionStatus: "ARCHIVE_CATALOG",
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error("Database error fetching catalog products:", error);
  }

  return <Catalog cars={cars} />;
}
