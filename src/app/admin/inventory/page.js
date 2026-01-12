import prisma from "@/lib/prisma";
import Inventory from "./Inventory";

export default async function InventoryPage() {
  let cars = [];
  try {
    cars = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching cars for inventory page:', error);
    // Fallback to empty array to keep frontend visible
  }

  return <Inventory initialCars={cars} />;
}

