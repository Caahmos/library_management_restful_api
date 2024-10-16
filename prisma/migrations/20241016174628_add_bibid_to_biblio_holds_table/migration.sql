/*
  Warnings:

  - Added the required column `bibid` to the `biblio_hold` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `biblio_hold` ADD COLUMN `bibid` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `biblio_hold` ADD CONSTRAINT `biblio_hold_bibid_fkey` FOREIGN KEY (`bibid`) REFERENCES `biblio`(`bibid`) ON DELETE RESTRICT ON UPDATE CASCADE;
