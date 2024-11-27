/*
  Warnings:

  - Added the required column `yardLine` to the `ExpectedPoints` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpectedPoints" ADD COLUMN     "yardLine" TEXT NOT NULL;
