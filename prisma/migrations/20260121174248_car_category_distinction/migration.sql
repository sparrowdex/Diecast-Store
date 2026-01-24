/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('ARCHIVE_CATALOG', 'NEW_ARRIVAL', 'FEATURED_EXHIBIT');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('CLASSIC_VINTAGE', 'RACE_COURSE', 'CITY_LIFE', 'SUPERPOWERS', 'LUXURY_REDEFINED', 'OFF_ROAD', 'FUTURE_PROOF');

-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "genre" "Genre";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
ADD COLUMN     "collectionStatus" "CollectionStatus" NOT NULL DEFAULT 'ARCHIVE_CATALOG',
ADD COLUMN     "genre" "Genre",
ADD COLUMN     "modelYear" INTEGER;
