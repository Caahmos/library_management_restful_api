/*
  Warnings:

  - You are about to drop the `user_rank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_rank` DROP FOREIGN KEY `user_rank_bibid_fkey`;

-- DropForeignKey
ALTER TABLE `user_rank` DROP FOREIGN KEY `user_rank_mbrid_fkey`;

-- DropTable
DROP TABLE `user_rank`;

-- CreateTable
CREATE TABLE `biblio_rank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rank` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `bibid` INTEGER NOT NULL,
    `mbrid` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `biblio_rank` ADD CONSTRAINT `biblio_rank_mbrid_fkey` FOREIGN KEY (`mbrid`) REFERENCES `member`(`mbrid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio_rank` ADD CONSTRAINT `biblio_rank_bibid_fkey` FOREIGN KEY (`bibid`) REFERENCES `biblio`(`bibid`) ON DELETE RESTRICT ON UPDATE CASCADE;
