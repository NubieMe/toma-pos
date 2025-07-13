-- AlterTable
ALTER TABLE "Permission" ADD COLUMN "created_by" TEXT;
ALTER TABLE "Permission" ADD COLUMN "updated_by" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "path" TEXT,
    "parent_id" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_date" DATETIME,
    "deleted_by" TEXT,
    CONSTRAINT "Menu_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Menu" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Menu" ("icon", "id", "is_active", "name", "order", "parent_id", "path") SELECT "icon", "id", "is_active", "name", "order", "parent_id", "path" FROM "Menu";
DROP TABLE "Menu";
ALTER TABLE "new_Menu" RENAME TO "Menu";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
