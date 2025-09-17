/*
  Warnings:

  - Added the required column `payMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingInfo` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "payMethod" TEXT NOT NULL,
ADD COLUMN     "shippingInfo" JSONB NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "username" TEXT;
