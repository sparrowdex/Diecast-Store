import prisma from "@/lib/prisma";
import AdminDashboard from "./Dashboard";

export default async function AdminDashboardPage() {
  let cars = [];
  try {
    cars = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching cars for admin dashboard:', error);
    // Fallback to empty array to keep frontend visible
  }

  return <AdminDashboard initialCars={cars} />;
}
