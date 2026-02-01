import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { collectorName, bio, stamp, fontPreference, progressRingColor, theme } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (bio && bio.length > 160) {
      return new NextResponse("Bio must be under 160 characters", { status: 400 });
    }

    const userProfile = await prisma.user.upsert({
      where: { id: userId },
      update: {
        collectorName,
        bio,
        stamp,
        fontPreference,
        progressRingColor,
        theme,
      },
      create: {
        id: userId,
        collectorName,
        bio,
        stamp,
        fontPreference,
        progressRingColor,
        theme: theme || "dark",
      },
    });

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("[USER_PROFILE_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
