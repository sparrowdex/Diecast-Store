import React from "react";
import prisma from "@/lib/prisma";
import JournalPreview from "./JournalPreview";

export default function JournalPreviewPage({ params }) {
  const { id } = React.use(params);
  const journalEntry = React.use(
    prisma.journalEntry.findUnique({
      where: {
        id: id,
      },
    })
  );

  return <JournalPreview entry={journalEntry} />;
}
