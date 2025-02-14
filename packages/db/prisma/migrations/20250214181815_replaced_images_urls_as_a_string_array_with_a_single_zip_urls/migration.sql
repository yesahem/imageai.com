/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `Model` table. All the data in the column will be lost.
  - Added the required column `zipUrls` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Made the column `falAiRequestId` on table `OutputImage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "imageUrls",
ADD COLUMN     "zipUrls" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OutputImage" ALTER COLUMN "falAiRequestId" SET NOT NULL;
