import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const journalEntry = await prisma.journalEntry.findUnique({
      where: {
        id: id,
      },
    });

    if (!journalEntry) {
      return new NextResponse("Journal entry not found", { status: 404 });
    }

    return NextResponse.json(journalEntry, { status: 200 });
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    return new NextResponse("Error fetching journal entry", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== 'admin') {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    await prisma.journalEntry.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return new NextResponse("Error deleting journal entry", { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== 'admin') {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { title, slug, content, author, isPublished, isFeatured, genre, readTime, images, video } =
    await request.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      if (isFeatured) {
        const existingFeatured = await tx.journalEntry.findFirst({
          where: { isFeatured: true, id: { not: id } }
        });

        if (existingFeatured) {
          throw new Error(`FEATURE_LOCKED: "${existingFeatured.title}" is already featured.`);
        }
      }

      return await tx.journalEntry.update({
        where: { id: id },
        data: {
          title,
          slug,
          content,
          author,
          genre,
          readTime: readTime !== undefined ? (parseInt(readTime) || 0) : undefined,
          isPublished,
          isFeatured: isFeatured !== undefined ? !!isFeatured : undefined,
          images,
          video,
        },
      });
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error.message.startsWith("FEATURE_LOCKED")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("JOURNAL_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Error updating journal entry" }, { status: 500 });
  }
}
