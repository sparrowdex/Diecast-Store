/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shipmentId" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category";
