import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetails";

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

  return <ProductDetailClient car={car} />;
}