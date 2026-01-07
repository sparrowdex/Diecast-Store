import prisma from "@/lib/prisma";
import JournalDashboard from "./JournalDashboard";

export default async function JournalPage() {
  const journalEntries = await prisma.journalEntry.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <JournalDashboard initialEntries={journalEntries} />;
}
