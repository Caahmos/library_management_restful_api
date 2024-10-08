-- AlterTable
ALTER TABLE `usmarc_subfield_dm` MODIFY `description` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `usmarc_indicator_dm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tag` INTEGER NOT NULL,
    `indicator_cd` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usmarc_indicator_dm` ADD CONSTRAINT `usmarc_indicator_dm_tag_fkey` FOREIGN KEY (`tag`) REFERENCES `usmarc_tag_dm`(`tag`) ON DELETE RESTRICT ON UPDATE CASCADE;
