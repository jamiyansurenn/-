-- CreateTable
CREATE TABLE "hero_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "backgrounds" TEXT NOT NULL,
    "slides" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
