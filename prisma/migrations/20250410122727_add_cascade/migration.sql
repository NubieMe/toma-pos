-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "in" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "out" DATETIME,
    CONSTRAINT "Attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attendance" ("id", "in", "out", "user_id") SELECT "id", "in", "out", "user_id" FROM "Attendance";
DROP TABLE "Attendance";
ALTER TABLE "new_Attendance" RENAME TO "Attendance";
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "uom_id" TEXT NOT NULL,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME,
    CONSTRAINT "Item_uom_id_fkey" FOREIGN KEY ("uom_id") REFERENCES "Uom" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("code", "created_date", "description", "id", "name", "uom_id", "updated_date") SELECT "code", "created_date", "description", "id", "name", "uom_id", "updated_date" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_code_key" ON "Item"("code");
CREATE TABLE "new_Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "path" TEXT,
    "parent_id" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Menu_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Menu" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Menu" ("icon", "id", "is_active", "name", "order", "parent_id", "path") SELECT "icon", "id", "is_active", "name", "order", "parent_id", "path" FROM "Menu";
DROP TABLE "Menu";
ALTER TABLE "new_Menu" RENAME TO "Menu";
CREATE TABLE "new_Permission" (
    "role_id" TEXT NOT NULL,
    "menu_id" TEXT NOT NULL,
    "create" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME,

    PRIMARY KEY ("role_id", "menu_id"),
    CONSTRAINT "Permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Permission_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Permission" ("create", "created_date", "delete", "menu_id", "read", "role_id", "update", "updated_date") SELECT "create", "created_date", "delete", "menu_id", "read", "role_id", "update", "updated_date" FROM "Permission";
DROP TABLE "Permission";
ALTER TABLE "new_Permission" RENAME TO "Permission";
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stock_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "qty" INTEGER NOT NULL,
    "discount_percent" BOOLEAN NOT NULL,
    "discount_percentage" REAL NOT NULL,
    "discount_amount" REAL NOT NULL,
    "net_price" REAL NOT NULL,
    "ppn_percentage" REAL NOT NULL,
    "ppn_amount" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME,
    CONSTRAINT "Product_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Product_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("created_date", "discount_amount", "discount_percent", "discount_percentage", "id", "net_price", "ppn_amount", "ppn_percentage", "price", "qty", "stock_id", "subtotal", "transaction_id", "updated_date") SELECT "created_date", "discount_amount", "discount_percent", "discount_percentage", "id", "net_price", "ppn_amount", "ppn_percentage", "price", "qty", "stock_id", "subtotal", "transaction_id", "updated_date" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Stock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "item_id" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "vendible" BOOLEAN NOT NULL,
    "branch_id" TEXT NOT NULL,
    "price" REAL NOT NULL DEFAULT 0,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME,
    CONSTRAINT "Stock_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Stock_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Stock" ("branch_id", "created_date", "id", "item_id", "price", "qty", "updated_date", "vendible") SELECT "branch_id", "created_date", "id", "item_id", "price", "qty", "updated_date", "vendible" FROM "Stock";
DROP TABLE "Stock";
ALTER TABLE "new_Stock" RENAME TO "Stock";
CREATE TABLE "new_StockIO" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "stock_id" TEXT NOT NULL,
    "to_id" TEXT,
    "qty" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "note" TEXT,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME,
    CONSTRAINT "StockIO_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StockIO_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StockIO" ("created_date", "id", "note", "price", "qty", "stock_id", "to_id", "type", "updated_date") SELECT "created_date", "id", "note", "price", "qty", "stock_id", "to_id", "type", "updated_date" FROM "StockIO";
DROP TABLE "StockIO";
ALTER TABLE "new_StockIO" RENAME TO "StockIO";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT,
    "role_id" TEXT,
    "profile_id" TEXT,
    "created_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" DATETIME,
    CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "User_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("created_date", "id", "password", "profile_id", "role_id", "token", "updated_date", "username") SELECT "created_date", "id", "password", "profile_id", "role_id", "token", "updated_date", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");
CREATE UNIQUE INDEX "User_profile_id_key" ON "User"("profile_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
