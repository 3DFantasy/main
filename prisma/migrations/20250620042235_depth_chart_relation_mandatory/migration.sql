/*
  Warnings:

  - Made the column `depthChartListId` on table `DepthChart` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DepthChart" ALTER COLUMN "depthChartListId" SET NOT NULL;
