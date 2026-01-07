import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is missing" },
      { status: 400 }
    );
  }

  try {
    const searchResults = await prisma.journalEntry.findMany({
      where: {
        isPublished: true,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(searchResults, { status: 200 });
  } catch (error) {
    console.error("Error searching journal entries:", error);
    return new NextResponse("Error searching journal entries", { status: 500 });
  }
}
