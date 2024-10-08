/*
  Warnings:

  - The primary key for the `biblio_field` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `biblio_field` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `biblio_field` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `fieldid` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `usmarc_subfield_dm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tag` INTEGER NOT NULL,
    `subfield_cd` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `repeatable_flg` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usmarc_subfield_dm` ADD CONSTRAINT `usmarc_subfield_dm_tag_fkey` FOREIGN KEY (`tag`) REFERENCES `usmarc_tag_dm`(`tag`) ON DELETE RESTRICT ON UPDATE CASCADE;
