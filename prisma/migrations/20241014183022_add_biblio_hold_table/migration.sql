-- CreateTable
CREATE TABLE `biblio_hold` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `holdid` INTEGER NOT NULL,
    `copyid` INTEGER NOT NULL,
    `mbrid` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `biblio_hold` ADD CONSTRAINT `biblio_hold_mbrid_fkey` FOREIGN KEY (`mbrid`) REFERENCES `member`(`mbrid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio_hold` ADD CONSTRAINT `biblio_hold_copyid_fkey` FOREIGN KEY (`copyid`) REFERENCES `biblio_copy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
