/*
  Warnings:

  - The primary key for the `Link` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Link` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shortcode" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "timesAccessed" INTEGER NOT NULL DEFAULT 0,
    "lastAccessed" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Link" ("createdAt", "id", "lastAccessed", "longUrl", "shortcode", "timesAccessed") SELECT "createdAt", "id", "lastAccessed", "longUrl", "shortcode", "timesAccessed" FROM "Link";
DROP TABLE "Link";
ALTER TABLE "new_Link" RENAME TO "Link";
CREATE UNIQUE INDEX "Link_shortcode_key" ON "Link"("shortcode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
