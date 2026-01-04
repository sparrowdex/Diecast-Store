import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetails";

export default async function ProductDetail({ params }) {
  const { id } = await params;

  const car = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });

  return <ProductDetailClient car={car} />;
}