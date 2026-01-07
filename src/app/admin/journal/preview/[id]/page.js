import prisma from "@/lib/prisma";
import JournalPreview from "./JournalPreview";

export default async function JournalPreviewPage({ params }) {
  const { id } = params;
  const journalEntry = await prisma.journalEntry.findUnique({
    where: {
      id: id,
    },
  });

  return <JournalPreview entry={journalEntry} />;
}
