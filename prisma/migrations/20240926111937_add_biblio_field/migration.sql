/*
  Warnings:

  - A unique constraint covering the columns `[rm]` on the table `member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rm` to the `member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `biblio` ADD COLUMN `opac_flg` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `title_remainder` VARCHAR(191) NULL,
    MODIFY `responsibility_stmt` VARCHAR(191) NULL,
    MODIFY `call_nmbr2` VARCHAR(191) NULL,
    MODIFY `call_nmbr3` VARCHAR(191) NULL,
    MODIFY `topic1` VARCHAR(191) NULL,
    MODIFY `topic2` VARCHAR(191) NULL,
    MODIFY `topic3` VARCHAR(191) NULL,
    MODIFY `topic4` VARCHAR(191) NULL,
    MODIFY `topic5` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `member` ADD COLUMN `rm` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `biblio_field` (
    `fieldid` INTEGER NOT NULL AUTO_INCREMENT,
    `bibid` INTEGER NOT NULL,
    `tag` INTEGER NOT NULL,
    `ind1_cd` VARCHAR(191) NOT NULL DEFAULT 'N',
    `ind2_cd` VARCHAR(191) NOT NULL DEFAULT 'N',
    `subfield_cd` VARCHAR(191) NOT NULL,
    `field_data` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`fieldid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `member_rm_key` ON `member`(`rm`);

-- AddForeignKey
ALTER TABLE `biblio_field` ADD CONSTRAINT `biblio_field_bibid_fkey` FOREIGN KEY (`bibid`) REFERENCES `biblio`(`bibid`) ON DELETE RESTRICT ON UPDATE CASCADE;
