/*
  Warnings:

  - Changed the type of `price` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "genre" "Genre",
ADD COLUMN     "scale" TEXT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION USING "price"::double precision;
