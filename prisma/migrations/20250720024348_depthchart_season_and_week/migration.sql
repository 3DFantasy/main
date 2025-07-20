-- AlterTable
ALTER TABLE "DepthChart" ADD COLUMN     "season" TEXT NOT NULL DEFAULT 'regular',
ADD COLUMN     "week" INTEGER NOT NULL DEFAULT 1;
