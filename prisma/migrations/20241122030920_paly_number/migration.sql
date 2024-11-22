/*
  Warnings:

  - Added the required column `number` to the `Play` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Play" ADD COLUMN     "number" INTEGER NOT NULL;
