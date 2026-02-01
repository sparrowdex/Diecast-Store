import prisma from "@/lib/prisma";
import EditJournalEntry from "./EditJournalEntry";
import { notFound } from "next/navigation";

export default async function EditJournalPage({ params }) {
  const { id } = await params;
  const entry = await prisma.journalEntry.findUnique({ where: { id } });

  if (!entry) notFound();

  return <EditJournalEntry entry={entry} />;
}