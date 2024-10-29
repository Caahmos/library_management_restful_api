/*
  Warnings:

  - You are about to drop the column `countRanks` on the `biblio_media` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `biblio_media` DROP COLUMN `countRanks`,
    ADD COLUMN `count_ranks` INTEGER NULL;
