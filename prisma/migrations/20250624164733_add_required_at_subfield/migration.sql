/*
  Warnings:

  - Made the column `rank` on table `biblio_media` required. This step will fail if there are existing NULL values in that column.
  - Made the column `count_ranks` on table `biblio_media` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `biblio_media` MODIFY `rank` INTEGER NOT NULL DEFAULT 0,
    MODIFY `count_ranks` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `usmarc_subfield_dm` ADD COLUMN `required` BOOLEAN NOT NULL DEFAULT false;
