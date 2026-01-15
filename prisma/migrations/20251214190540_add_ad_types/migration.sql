-- CreateEnum
CREATE TYPE "AdType" AS ENUM ('AFFILIATE', 'LINK', 'BANNER', 'POPUP', 'VIDEO', 'CUSTOM');

-- AlterTable
ALTER TABLE "Advertisement" ADD COLUMN     "adType" "AdType" NOT NULL DEFAULT 'CUSTOM',
ADD COLUMN     "image" TEXT,
ADD COLUMN     "linkUrl" TEXT,
ADD COLUMN     "script" TEXT;
