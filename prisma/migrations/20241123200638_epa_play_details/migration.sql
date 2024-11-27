-- AlterTable
ALTER TABLE "Drive" ADD COLUMN     "nextPointOutcome" INTEGER;

-- AlterTable
ALTER TABLE "Play" ADD COLUMN     "defense" TEXT,
ADD COLUMN     "distance" TEXT,
ADD COLUMN     "down" INTEGER,
ADD COLUMN     "epa" DOUBLE PRECISION,
ADD COLUMN     "passer" TEXT,
ADD COLUMN     "receiver" TEXT,
ADD COLUMN     "rusher" TEXT,
ADD COLUMN     "yardLine" INTEGER,
ADD COLUMN     "yardsGained" INTEGER;
