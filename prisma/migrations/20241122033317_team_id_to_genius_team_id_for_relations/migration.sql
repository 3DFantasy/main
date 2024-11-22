/*
  Warnings:

  - You are about to drop the column `teamId` on the `Drive` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Play` table. All the data in the column will be lost.
  - Added the required column `geniusTeamId` to the `Drive` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geniusTeamId` to the `Play` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Drive" DROP CONSTRAINT "Drive_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Play" DROP CONSTRAINT "Play_teamId_fkey";

-- AlterTable
ALTER TABLE "Drive" DROP COLUMN "teamId",
ADD COLUMN     "geniusTeamId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Play" DROP COLUMN "teamId",
ADD COLUMN     "geniusTeamId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Drive" ADD CONSTRAINT "Drive_geniusTeamId_fkey" FOREIGN KEY ("geniusTeamId") REFERENCES "Team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Play" ADD CONSTRAINT "Play_geniusTeamId_fkey" FOREIGN KEY ("geniusTeamId") REFERENCES "Team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;
