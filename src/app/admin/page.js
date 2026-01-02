import prisma from "@/lib/prisma";
import AdminDashboard from "./Dashboard";

export default async function AdminDashboardPage() {
  const cars = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <AdminDashboard initialCars={cars} />;
}