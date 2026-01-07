import prisma from "@/lib/prisma";
import EditJournalEntry from "./EditJournalEntry";

export default async function EditJournalEntryPage({ params }) {
  const { id } = params;
  const journalEntry = await prisma.journalEntry.findUnique({
    where: {
      id: id,
    },
  });

  return <EditJournalEntry entry={journalEntry} />;
}
