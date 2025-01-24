-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_basicUnitUuid_fkey` FOREIGN KEY (`basicUnitUuid`) REFERENCES `PackagingUnit`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
