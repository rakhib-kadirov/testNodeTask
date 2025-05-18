-- CreateTable
CREATE TABLE `Appeal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `topic` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELED') NOT NULL DEFAULT 'NEW',
    `resolutionText` VARCHAR(191) NULL,
    `cancellationReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
