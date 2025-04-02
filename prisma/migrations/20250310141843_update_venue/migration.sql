/*
  Warnings:

  - Added the required column `updateAt` to the `venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "venue" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createBy" TEXT,
ADD COLUMN     "delFlag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updateBy" TEXT;
