/*
  Warnings:

  - You are about to drop the column `biblioMediaId` on the `user_rank` table. All the data in the column will be lost.
  - Added the required column `bibid` to the `user_rank` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_rank` DROP FOREIGN KEY `user_rank_biblioMediaId_fkey`;

-- AlterTable
ALTER TABLE `user_rank` DROP COLUMN `biblioMediaId`,
    ADD COLUMN `bibid` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `user_rank` ADD CONSTRAINT `user_rank_bibid_fkey` FOREIGN KEY (`bibid`) REFERENCES `biblio`(`bibid`) ON DELETE RESTRICT ON UPDATE CASCADE;
