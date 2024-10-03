-- DropForeignKey
ALTER TABLE `member_fields` DROP FOREIGN KEY `member_fields_mbrid_fkey`;

-- AddForeignKey
ALTER TABLE `member_fields` ADD CONSTRAINT `member_fields_mbrid_fkey` FOREIGN KEY (`mbrid`) REFERENCES `member`(`mbrid`) ON DELETE CASCADE ON UPDATE CASCADE;
