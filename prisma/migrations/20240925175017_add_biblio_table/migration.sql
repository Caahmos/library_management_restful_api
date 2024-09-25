-- CreateTable
CREATE TABLE `collection_dm` (
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `default_flg` BOOLEAN NOT NULL,
    `days_due_back` INTEGER NOT NULL,
    `daily_late_fee` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material_type_dm` (
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `default_flg` BOOLEAN NOT NULL,
    `image_file` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `biblio` (
    `bibid` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `title_remainder` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `responsibility_stmt` VARCHAR(191) NOT NULL,
    `material_cd` INTEGER NOT NULL,
    `collection_cd` INTEGER NOT NULL,
    `call_nmbr1` VARCHAR(191) NOT NULL,
    `call_nmbr2` VARCHAR(191) NOT NULL,
    `call_nmbr3` VARCHAR(191) NOT NULL,
    `topic1` VARCHAR(191) NOT NULL,
    `topic2` VARCHAR(191) NOT NULL,
    `topic3` VARCHAR(191) NOT NULL,
    `topic4` VARCHAR(191) NOT NULL,
    `topic5` VARCHAR(191) NOT NULL,
    `last_change_userid` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`bibid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `biblio` ADD CONSTRAINT `biblio_last_change_userid_fkey` FOREIGN KEY (`last_change_userid`) REFERENCES `staff`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio` ADD CONSTRAINT `biblio_collection_cd_fkey` FOREIGN KEY (`collection_cd`) REFERENCES `collection_dm`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biblio` ADD CONSTRAINT `biblio_material_cd_fkey` FOREIGN KEY (`material_cd`) REFERENCES `material_type_dm`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
