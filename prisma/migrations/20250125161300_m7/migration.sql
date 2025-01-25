/*
  Warnings:

  - Added the required column `masterCode` to the `ProductSale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProductSale` ADD COLUMN `masterCode` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `SalesMaster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `salesCode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SalesMaster_uuid_key`(`uuid`),
    UNIQUE INDEX `SalesMaster_salesCode_key`(`salesCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesPayments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `salesMasterCode` VARCHAR(191) NOT NULL,
    `paymentMode` VARCHAR(191) NOT NULL,
    `amountPaid` DOUBLE NOT NULL,
    `refference` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SalesPayments_uuid_key`(`uuid`),
    UNIQUE INDEX `SalesPayments_salesMasterCode_key`(`salesMasterCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductSale` ADD CONSTRAINT `ProductSale_masterCode_fkey` FOREIGN KEY (`masterCode`) REFERENCES `SalesMaster`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesPayments` ADD CONSTRAINT `SalesPayments_salesMasterCode_fkey` FOREIGN KEY (`salesMasterCode`) REFERENCES `SalesMaster`(`salesCode`) ON DELETE RESTRICT ON UPDATE CASCADE;
