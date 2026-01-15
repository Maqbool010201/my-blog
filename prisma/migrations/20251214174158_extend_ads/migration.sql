/*
  Warnings:

  - The primary key for the `Advertisement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Advertisement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Advertisement" DROP CONSTRAINT "Advertisement_pkey",
DROP COLUMN "code",
ADD COLUMN     "categorySlug" TEXT,
ADD COLUMN     "clicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "html" TEXT,
ADD COLUMN     "impressions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "postSlug" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Advertisement_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Advertisement_id_seq";
