-- CreateTable
CREATE TABLE "Card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rank" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "init" TEXT NOT NULL,
    "last" TEXT NOT NULL,
    "artist" TEXT NOT NULL
);
