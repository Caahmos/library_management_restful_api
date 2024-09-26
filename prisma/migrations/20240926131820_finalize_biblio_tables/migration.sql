-- DropForeignKey
ALTER TABLE `biblio_field` DROP FOREIGN KEY `biblio_field_bibid_fkey`;

-- DropForeignKey
ALTER TABLE `member_account` DROP FOREIGN KEY `member_account_mbrid_fkey`;

-- CreateTable
CREATE TABLE `biblio_status_dm` (
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `default_flg` BOOLEAN NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `biblio_copy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bidid` INTEGER NOT NULL,
    `copyid` INTEGER NOT NULL,
    `copy_desc` VARCHAR(191) NULL,
    `barcode` INTEGER NOT NULL,
    `status_cd` VARCHAR(191) NOT NULL,
    `status_begin_dt` DATETIME(3) NOT NULL,
    `due_back_dt` DATETIME(3) NULL,
    `mbrid` INTEGER NULL,
    `renewal_count` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `biblio_copy_barcode_key`(`barcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `biblio_status_hist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bidid` INTEGER NOT NULL,
    `copyid` INTEGER NOT NULL,
    `status_cd` VARCHAR(191) NOT NULL,
    `status_begin_dt` DATETIME(3) NOT NULL,
    `due_back_dt` DATETIME(3) NOT NULL,
    `mbrid` INTEGER NOT NULL,
    `renewal_count` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_type_dm` (
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `default_flg` BOOLEAN NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `member_account` ADD CONSTRAINT `member_account_mbrid_fkey` FOREIGN KEY (`mbrid`) REFERENCES `member`(`mbrid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_account` ADD CONSTRAINT `member_account_transaction_type_fkey` FOREIGN KEY (`transaction_type`) REFERENCES `transaction_type_dm`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio_field` ADD CONSTRAINT `biblio_field_bibid_fkey` FOREIGN KEY (`bibid`) REFERENCES `biblio`(`bibid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio_copy` ADD CONSTRAINT `biblio_copy_mbrid_fkey` FOREIGN KEY (`mbrid`) REFERENCES `member`(`mbrid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio_copy` ADD CONSTRAINT `biblio_copy_bidid_fkey` FOREIGN KEY (`bidid`) REFERENCES `biblio`(`bibid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio_status_hist` ADD CONSTRAINT `biblio_status_hist_mbrid_fkey` FOREIGN KEY (`mbrid`) REFERENCES `member`(`mbrid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio_status_hist` ADD CONSTRAINT `biblio_status_hist_bidid_fkey` FOREIGN KEY (`bidid`) REFERENCES `biblio`(`bibid`) ON DELETE RESTRICT ON UPDATE CASCADE;
