-- CreateTable
CREATE TABLE `usmarc_block_dm` (
    `block_nmbr` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`block_nmbr`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usmarc_tag_dm` (
    `tag` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `ind1_description` VARCHAR(191) NULL,
    `ind2_description` VARCHAR(191) NULL,
    `repeatable_flg` BOOLEAN NOT NULL DEFAULT false,
    `block_nmbr` INTEGER NULL,

    PRIMARY KEY (`tag`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `biblio_field` ADD CONSTRAINT `biblio_field_tag_fkey` FOREIGN KEY (`tag`) REFERENCES `usmarc_tag_dm`(`tag`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usmarc_tag_dm` ADD CONSTRAINT `usmarc_tag_dm_block_nmbr_fkey` FOREIGN KEY (`block_nmbr`) REFERENCES `usmarc_block_dm`(`block_nmbr`) ON DELETE SET NULL ON UPDATE CASCADE;
