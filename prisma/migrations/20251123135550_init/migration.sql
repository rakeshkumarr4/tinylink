-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortcode" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "timesAccessed" INTEGER NOT NULL DEFAULT 0,
    "lastAccessed" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_shortcode_key" ON "Link"("shortcode");
