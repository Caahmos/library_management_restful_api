-- DropForeignKey
ALTER TABLE `checkout_privs` DROP FOREIGN KEY `checkout_privs_classification_fkey`;

-- DropForeignKey
ALTER TABLE `checkout_privs` DROP FOREIGN KEY `checkout_privs_material_cd_fkey`;

-- AddForeignKey
ALTER TABLE `checkout_privs` ADD CONSTRAINT `checkout_privs_material_cd_fkey` FOREIGN KEY (`material_cd`) REFERENCES `material_type_dm`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkout_privs` ADD CONSTRAINT `checkout_privs_classification_fkey` FOREIGN KEY (`classification`) REFERENCES `mbr_classify_dm`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;
