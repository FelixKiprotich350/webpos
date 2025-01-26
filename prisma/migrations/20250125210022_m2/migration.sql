/*
  Warnings:

  - Added the required column `groupCode` to the `basketSale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `basketSale` ADD COLUMN `groupCode` VARCHAR(191) NOT NULL;
