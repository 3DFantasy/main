-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "depthChartList" TEXT;

-- CreateTable
CREATE TABLE "DepthChartList" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "value" TEXT,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepthChartList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DepthChartList" ADD CONSTRAINT "DepthChartList_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
