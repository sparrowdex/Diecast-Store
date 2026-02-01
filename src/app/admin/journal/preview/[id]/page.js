import prisma from "@/lib/prisma";
import JournalPreview from "./JournalPreview";
import { notFound } from "next/navigation";

export default async function PreviewPage({ params }) {
  const { id } = await params;
  const entry = await prisma.journalEntry.findUnique({ where: { id } });

  if (!entry) notFound();

  return <JournalPreview entry={entry} />;
}