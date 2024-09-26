/*
  Warnings:

  - The primary key for the `biblio_status_dm` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `member_fields` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `member_fields` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `biblio_status_dm` DROP PRIMARY KEY,
    MODIFY `code` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`code`);

-- AlterTable
ALTER TABLE `member_fields` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `member_fields` ADD CONSTRAINT `member_fields_mbrid_fkey` FOREIGN KEY (`mbrid`) REFERENCES `member`(`mbrid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio_copy` ADD CONSTRAINT `biblio_copy_status_cd_fkey` FOREIGN KEY (`status_cd`) REFERENCES `biblio_status_dm`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
