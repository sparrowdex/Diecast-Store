import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Fetch User Profile
    let userProfile = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userProfile) {
      userProfile = await prisma.user.create({
        data: { id: userId, theme: "dark", collectorName: `COLLECTOR_${userId?.slice(-4)}` },
      });
    }

    // 2. Fetch Collection
    const orders = await prisma.order.findMany({
      where: { userId, paymentStatus: 'PAID' },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const allItems = orders.flatMap(order => order.items);

    // 3. Calculate Stats
    const stats = {
      totalModels: allItems.reduce((sum, item) => sum + item.quantity, 0),
      rareEditions: allItems.filter(item => item.product?.isRare).length,
      activeSeriesCount: [...new Set(allItems.map(item => item.product?.category).filter(Boolean))].length,
    };

    // 4. Category Progress (for Progress Rings)
    const allProducts = await prisma.product.findMany({ select: { category: true } });
    const categories = [...new Set(allItems.map(item => item.product?.category).filter(Boolean))].map(cat => {
      const total = allProducts.filter(p => p.category === cat).length;
      const owned = allItems.filter(item => item.product?.category === cat).length;
      return {
        name: cat,
        percentage: total > 0 ? Math.round((owned / total) * 100) : 0,
        count: owned,
        total
      };
    });

    return NextResponse.json({
      profile: userProfile,
      stats,
      categories,
      recentItems: allItems.slice(0, 3)
    });
  } catch (error) {
    console.error("[DASHBOARD_DATA_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}