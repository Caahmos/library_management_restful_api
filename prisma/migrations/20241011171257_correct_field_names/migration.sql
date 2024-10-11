/*
  Warnings:

  - You are about to drop the column `bidid` on the `biblio_copy` table. All the data in the column will be lost.
  - You are about to drop the column `bidid` on the `biblio_status_hist` table. All the data in the column will be lost.
  - Added the required column `bibid` to the `biblio_copy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bibid` to the `biblio_status_hist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `biblio_copy` DROP FOREIGN KEY `biblio_copy_bidid_fkey`;

-- DropForeignKey
ALTER TABLE `biblio_status_hist` DROP FOREIGN KEY `biblio_status_hist_bidid_fkey`;

-- AlterTable
ALTER TABLE `biblio_copy` DROP COLUMN `bidid`,
    ADD COLUMN `bibid` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `biblio_status_hist` DROP COLUMN `bidid`,
    ADD COLUMN `bibid` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `biblio_copy` ADD CONSTRAINT `biblio_copy_bibid_fkey` FOREIGN KEY (`bibid`) REFERENCES `biblio`(`bibid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio_status_hist` ADD CONSTRAINT `biblio_status_hist_bibid_fkey` FOREIGN KEY (`bibid`) REFERENCES `biblio`(`bibid`) ON DELETE RESTRICT ON UPDATE CASCADE;
