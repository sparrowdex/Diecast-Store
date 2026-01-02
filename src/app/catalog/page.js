import prisma from "@/lib/prisma";
import Catalog from "./Catalog";

export default async function CatalogPage() {
  const cars = await prisma.product.findMany();

  return <Catalog cars={cars} />;
}