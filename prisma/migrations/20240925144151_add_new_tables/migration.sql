-- CreateTable
CREATE TABLE `member_fields_dm` (
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `default_flg` BOOLEAN NOT NULL,

    UNIQUE INDEX `member_fields_dm_description_key`(`description`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_fields` (
    `mbrid` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `data` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`mbrid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `member_fields` ADD CONSTRAINT `member_fields_code_fkey` FOREIGN KEY (`code`) REFERENCES `member_fields_dm`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
