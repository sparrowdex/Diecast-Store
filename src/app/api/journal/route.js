import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: "desc",
      },
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

    const { title, slug, content, author, isPublished, imageUrl, videoUrl } =
      await request.json();

    const newJournalEntry = await prisma.journalEntry.create({
      data: {
        title,
        slug,
        content,
        author,
        isPublished,
        images: imageUrl ? [imageUrl] : [],
        video: videoUrl,
      },
    });

    return NextResponse.json(newJournalEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return NextResponse.json({ error: "Error creating journal entry" }, { status: 500 });
  }
}
