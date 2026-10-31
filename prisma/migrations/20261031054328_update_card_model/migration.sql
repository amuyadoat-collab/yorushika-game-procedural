/*
  Warnings:

  - You are about to drop the column `name` on the `Card` table. All the data in the column will be lost.
  - Added the required column `music` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rank" INTEGER NOT NULL,
    "music" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "init" TEXT NOT NULL,
    "last" TEXT NOT NULL,
    "artist" TEXT NOT NULL
);
INSERT INTO "new_Card" ("album", "artist", "id", "init", "last", "rank") SELECT "album", "artist", "id", "init", "last", "rank" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
