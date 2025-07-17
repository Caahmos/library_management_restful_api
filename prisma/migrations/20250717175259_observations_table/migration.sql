-- CreateTable
CREATE TABLE `observation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mbrid` INTEGER NULL,
    `copyid` INTEGER NULL,
    `last_change_userid` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `observation` ADD CONSTRAINT `observation_mbrid_fkey` FOREIGN KEY (`mbrid`) REFERENCES `member`(`mbrid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `observation` ADD CONSTRAINT `observation_copyid_fkey` FOREIGN KEY (`copyid`) REFERENCES `biblio_copy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `observation` ADD CONSTRAINT `observation_last_change_userid_fkey` FOREIGN KEY (`last_change_userid`) REFERENCES `staff`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;
