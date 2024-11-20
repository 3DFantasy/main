/*
  Warnings:

  - You are about to drop the column `depthChartList` on the `Team` table. All the data in the column will be lost.
  - Added the required column `title` to the `DepthChart` table without a default value. This is not possible if the table is not empty.
  - Made the column `value` on table `DepthChart` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DepthChart" ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "value" SET NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "depthChartList";
