-- CreateTable
CREATE TABLE `staff` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `suspended_flg` VARCHAR(191) NOT NULL DEFAULT 'N',
    `admin_flg` VARCHAR(191) NOT NULL,
    `circ_flg` VARCHAR(191) NOT NULL,
    `circ_mbr_flg` VARCHAR(191) NOT NULL,
    `catalog_flg` VARCHAR(191) NOT NULL,
    `reports_flg` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barcode_nmbr` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `home_phone` INTEGER NOT NULL,
    `work_phone` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `classification` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `member_barcode_nmbr_key`(`barcode_nmbr`),
    UNIQUE INDEX `member_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mbr_classify_dm` (
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `default_flg` VARCHAR(191) NOT NULL,
    `max_fines` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_classification_fkey` FOREIGN KEY (`classification`) REFERENCES `mbr_classify_dm`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
