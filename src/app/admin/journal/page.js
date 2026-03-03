import prisma from "@/lib/prisma";
import JournalDashboard from "./JournalDashboard";

export const dynamic = 'force-dynamic';

export default async function JournalPage() {
  let journalEntries = [];
  try {
    journalEntries = await prisma.journalEntry.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
  }

  return <JournalDashboard initialEntries={journalEntries} />;
}