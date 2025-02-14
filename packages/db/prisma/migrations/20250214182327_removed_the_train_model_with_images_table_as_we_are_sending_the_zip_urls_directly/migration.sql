/*
  Warnings:

  - You are about to drop the `TraningModels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TraningModels" DROP CONSTRAINT "TraningModels_modelId_fkey";

-- DropTable
DROP TABLE "TraningModels";
