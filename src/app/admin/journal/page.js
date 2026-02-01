import prisma from "@/lib/prisma";
import JournalDashboard from "./JournalDashboard";

export default async function JournalPage() {
  let journalEntries = [];
  try {
    journalEntries = await prisma.journalEntry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
  }

  return <JournalDashboard initialEntries={journalEntries} />;
}