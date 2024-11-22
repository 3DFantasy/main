/*
  Warnings:

  - You are about to drop the column `teamId` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[geniusTeamId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DepthChart" DROP CONSTRAINT "DepthChart_teamId_fkey";

-- DropForeignKey
ALTER TABLE "DepthChartList" DROP CONSTRAINT "DepthChartList_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Drive" DROP CONSTRAINT "Drive_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Drive" DROP CONSTRAINT "Drive_geniusTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Play" DROP CONSTRAINT "Play_driveId_fkey";

-- DropForeignKey
ALTER TABLE "Play" DROP CONSTRAINT "Play_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Play" DROP CONSTRAINT "Play_geniusTeamId_fkey";

-- DropIndex
DROP INDEX "Team_teamId_key";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "teamId",
ADD COLUMN     "geniusTeamId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Team_geniusTeamId_key" ON "Team"("geniusTeamId");

-- AddForeignKey
ALTER TABLE "DepthChartList" ADD CONSTRAINT "DepthChartList_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepthChart" ADD CONSTRAINT "DepthChart_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drive" ADD CONSTRAINT "Drive_geniusTeamId_fkey" FOREIGN KEY ("geniusTeamId") REFERENCES "Team"("geniusTeamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drive" ADD CONSTRAINT "Drive_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Play" ADD CONSTRAINT "Play_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "Drive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Play" ADD CONSTRAINT "Play_geniusTeamId_fkey" FOREIGN KEY ("geniusTeamId") REFERENCES "Team"("geniusTeamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Play" ADD CONSTRAINT "Play_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
