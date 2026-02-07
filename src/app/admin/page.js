import prisma from "@/lib/prisma";
import AdminDashboard from "./Dashboard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkRole } from "@/lib/roles";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { userId } = await auth();
  const isAdmin = await checkRole("admin");

  if (!userId || !isAdmin) {
    redirect("/admin/welcome");
  }

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
