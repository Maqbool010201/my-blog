-- Add new columns with default
ALTER TABLE "Advertisement"
ADD COLUMN "pageSlug" TEXT,
ADD COLUMN "pageType" TEXT NOT NULL DEFAULT 'home';

-- Preserve old page info
UPDATE "Advertisement"
SET "pageType" =
  CASE
    WHEN "page" = 'post' THEN 'post'
    WHEN "page" = 'category' THEN 'category'
    ELSE 'home'
  END;

UPDATE "Advertisement"
SET "pageSlug" = COALESCE("postSlug", "categorySlug");

-- Drop old columns
ALTER TABLE "Advertisement"
DROP COLUMN "categorySlug",
DROP COLUMN "page",
DROP COLUMN "postSlug";
