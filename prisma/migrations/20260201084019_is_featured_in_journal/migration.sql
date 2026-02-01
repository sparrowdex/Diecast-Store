-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readTime" INTEGER;
