import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;

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
  const { id } = params;

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
  const { id } = params;
  const data = await request.json();

  try {
    const updatedJournalEntry = await prisma.journalEntry.update({
      where: {
        id: id,
      },
      data: data,
    });

    return NextResponse.json(updatedJournalEntry, { status: 200 });
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return new NextResponse("Error updating journal entry", { status: 500 });
  }
}
