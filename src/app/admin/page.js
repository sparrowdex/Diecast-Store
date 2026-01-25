import prisma from "@/lib/prisma";
import AdminDashboard from "./Dashboard";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let cars = [];
  let orders = [];
  let errorState = false;

  try {
    // Fetch all exhibits
    cars = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        brand: true,
        scale: true,
        price: true,
        featured: true,
        genre: true,
        stock: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch real pending orders
    orders = await prisma.order.findMany({
      where: {
        status: "PENDING",
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    console.error('CRITICAL_DATABASE_TIMEOUT:', error);
    errorState = true;
  }

  return <AdminDashboard initialCars={cars} initialOrders={orders} dbError={errorState} />;
}
