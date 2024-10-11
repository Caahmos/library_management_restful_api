-- CreateTable
CREATE TABLE `checkout_privs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `material_cd` INTEGER NOT NULL,
    `classification` INTEGER NOT NULL,
    `checkout_limit` INTEGER NOT NULL,
    `renewal_limit` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `checkout_privs` ADD CONSTRAINT `checkout_privs_material_cd_fkey` FOREIGN KEY (`material_cd`) REFERENCES `material_type_dm`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkout_privs` ADD CONSTRAINT `checkout_privs_classification_fkey` FOREIGN KEY (`classification`) REFERENCES `mbr_classify_dm`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
