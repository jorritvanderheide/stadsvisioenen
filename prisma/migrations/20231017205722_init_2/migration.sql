/*
  Warnings:

  - You are about to drop the column `published` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `stories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stories" DROP COLUMN "published",
DROP COLUMN "rating",
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;
