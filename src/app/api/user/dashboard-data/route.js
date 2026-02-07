import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch or initialize user profile
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { id: userId },
      });
    }

    // 2. Fetch user's collection (Paid OrderItems)
    const collection = await prisma.orderItem.findMany({
      where: {
        order: {
          userId: userId,
          paymentStatus: "PAID",
        },
      },
      include: {
        product: true,
        order: {
          select: { createdAt: true }
        }
      },
    });

    // 3. Fetch all products to calculate global totals per genre
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        genre: true,
        isRare: true,
      },
    });

    // 4. Calculate Logical Dates & Stats
    const orderDates = collection.map(item => item.order.createdAt.getTime());
    
    // Member Since: Earliest of User Record or First Order
    const memberSince = orderDates.length > 0 
      ? new Date(Math.min(user.createdAt.getTime(), ...orderDates))
      : user.createdAt;

    // Last Activity: Latest of User Update or Last Order
    const lastActivity = orderDates.length > 0
      ? new Date(Math.max(user.updatedAt.getTime(), ...orderDates))
      : user.updatedAt;

    const stats = {
      totalModels: collection.length,
      rareModels: collection.filter(item => item.product.isRare).length,
      lastActivity,
    };

    // 5. Calculate Genre Progress (Gamification Sync)
    const genres = ["CLASSIC_VINTAGE", "RACE_COURSE", "CITY_LIFE", "SUPERPOWERS", "LUXURY_REDEFINED", "OFF_ROAD", "FUTURE_PROOF"];
    const ownedProductIds = new Set(collection.map(item => item.productId));

    const genreProgress = genres.map(genre => {
      const genreProducts = allProducts.filter(p => p.genre === genre);
      const total = genreProducts.length;
      const owned = genreProducts.filter(p => ownedProductIds.has(p.id)).length;
      
      return {
        genre,
        owned,
        total,
        isComplete: total > 0 && owned === total
      };
    });

    return NextResponse.json({ 
      profile: {
        ...user,
        createdAt: memberSince // Override with logical join date
      }, 
      stats, 
      genreProgress, 
      collection 
    });
  } catch (error) {
    console.error("DASHBOARD_DATA_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}