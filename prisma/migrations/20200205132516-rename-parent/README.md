# Migration `20200205132516-rename-parent`

This migration has been generated by Rob Cameron at 2/5/2020, 1:25:16 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."categories" DROP COLUMN "parent_id",
ADD COLUMN "parent" integer   ;

ALTER TABLE "public"."categories" ADD FOREIGN KEY ("parent") REFERENCES "public"."categories"("id") ON DELETE SET NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200205112316-add-category-parent..20200205132516-rename-parent
--- datamodel.dml
+++ datamodel.dml
@@ -6,14 +6,14 @@
 // The `url` field must contain the connection string to your DB.
 // Learn more about connection strings for your DB: https://pris.ly/d/connection-strings
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DB_HOST")
 }
 // Other examples for connection strings are:
-// SQLite: url = "***"
-// MySQL:  url = "***"
+// SQLite: url = "sqlite:./dev.db"
+// MySQL:  url = "mysql://johndoe:johndoe@localhost:3306/mydb"
 // You can also use environment variables to specify the connection string: https://pris.ly/d/prisma-schema#using-environment-variables
 // By adding the `generator` block, you specify that you want to generate Prisma's DB client.
 // The client is generated by runnning the `prisma generate` command and will be located in `node_modules/@prisma` and can be imported in your code as:
@@ -31,9 +31,9 @@
 model categories {
   id              Int             @id @default(autoincrement())
   name            String          @unique
   slug            String          @unique
-  parent_id       Int
+  parent          categories?
   organizationses organizations[]
 }
 model organizations {
```

