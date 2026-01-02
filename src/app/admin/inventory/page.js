import prisma from "@/lib/prisma";
import Inventory from "./Inventory";

export default async function InventoryPage() {
  const cars = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <Inventory initialCars={cars} />;
}

