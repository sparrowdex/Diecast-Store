import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetails";
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductDetail({ params }) {
  const { id } = await params;

  let car = null;
  try {
    car = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    // Optionally, you could rethrow a custom error or redirect to an error page
    // For now, we'll let `car` remain null, which `ProductDetailClient` handles.
  }

  if (!car) {
    notFound();
  }

  return <ProductDetailClient car={car} />;
}