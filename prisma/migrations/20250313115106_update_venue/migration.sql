/*
  Warnings:

  - You are about to drop the column `description` on the `venue` table. All the data in the column will be lost.
  - Added the required column `address` to the `venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "venue" DROP COLUMN "description",
ADD COLUMN     "address" TEXT NOT NULL;
