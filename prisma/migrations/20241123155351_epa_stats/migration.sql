-- AlterTable
ALTER TABLE "Drive" ADD COLUMN     "nextPointOutcome" INTEGER;

-- AlterTable
ALTER TABLE "Play" ADD COLUMN     "distance" TEXT,
ADD COLUMN     "down" INTEGER,
ADD COLUMN     "yardLine" INTEGER;
