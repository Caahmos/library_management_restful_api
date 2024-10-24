-- CreateTable
CREATE TABLE `biblio_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bibid` INTEGER NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `rank` INTEGER NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_rank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rank` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `biblioMediaId` INTEGER NOT NULL,
    `mbrid` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `biblio_media` ADD CONSTRAINT `biblio_media_bibid_fkey` FOREIGN KEY (`bibid`) REFERENCES `biblio`(`bibid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_rank` ADD CONSTRAINT `user_rank_mbrid_fkey` FOREIGN KEY (`mbrid`) REFERENCES `member`(`mbrid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_rank` ADD CONSTRAINT `user_rank_biblioMediaId_fkey` FOREIGN KEY (`biblioMediaId`) REFERENCES `biblio_media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
