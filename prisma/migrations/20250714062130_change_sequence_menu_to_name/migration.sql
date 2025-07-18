/*
  Warnings:

  - You are about to drop the column `menu` on the `sequences` table. All the data in the column will be lost.
  - Added the required column `name` to the `sequences` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sequences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL DEFAULT 0,
    "month" INTEGER,
    "year" INTEGER NOT NULL,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME
);
INSERT INTO "new_sequences" ("created_date", "id", "month", "number", "updated_date", "year") SELECT "created_date", "id", "month", "number", "updated_date", "year" FROM "sequences";
DROP TABLE "sequences";
ALTER TABLE "new_sequences" RENAME TO "sequences";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
