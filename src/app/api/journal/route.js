import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    console.error("Error fetching journal entries:", error);
    return new NextResponse("Error fetching journal entries", { status: 500 });
  }
}

export async function POST(request) {
  const { title, slug, content, author, isPublished, imageUrl, videoUrl } =
    await request.json();

  try {
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
    return new NextResponse("Error creating journal entry", { status: 500 });
  }
}

