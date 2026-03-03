import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get('featured') === 'true';

    const journalEntries = await prisma.journalEntry.findMany({
      where: featuredOnly 
        ? { isFeatured: true } 
        : { isPublished: true },
      orderBy: [
        { isFeatured: 'desc' }, // true (1) comes before false (0)
        { createdAt: 'desc' },  // then newest first
      ],
    });

    return NextResponse.json(journalEntries, { status: 200 });
  } catch (error) {
    console.error("JOURNAL_FETCH_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch journal entries" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Check if the user is an admin
    const { sessionClaims } = await auth();

    if (sessionClaims?.metadata?.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { title, slug, content, author, isPublished, isFeatured, genre, readTime, images, video } =
      await request.json();

    const result = await prisma.$transaction(async (tx) => {
      if (isFeatured) {
        const existingFeatured = await tx.journalEntry.findFirst({
          where: { isFeatured: true }
        });
        if (existingFeatured) {
          throw new Error(`FEATURE_LOCKED: "${existingFeatured.title}" is already featured.`);
        }
      }

      return await tx.journalEntry.create({
        data: {
          title,
          slug,
          content,
          author,
          genre,
          readTime: parseInt(readTime) || 0,
          isPublished,
          isFeatured: !!isFeatured,
          images: images || [],
          video: video || null,
        },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error.message.startsWith("FEATURE_LOCKED")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("JOURNAL_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Error creating journal entry" }, { status: 500 });
  }
}
