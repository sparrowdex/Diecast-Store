/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `JournalEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "imageUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "video" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "trackingNumber" TEXT;
