-- AlterTable
ALTER TABLE `Product` MODIFY `sellingPrice` DECIMAL(65, 30) NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `SalesPayments` MODIFY `amountPaid` DECIMAL(65, 30) NOT NULL;
