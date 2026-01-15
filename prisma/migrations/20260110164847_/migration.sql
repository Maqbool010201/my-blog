-- AlterTable
ALTER TABLE "Advertisement" ALTER COLUMN "pageType" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Advertisement_pageType_pageSlug_position_idx" ON "Advertisement"("pageType", "pageSlug", "position");
