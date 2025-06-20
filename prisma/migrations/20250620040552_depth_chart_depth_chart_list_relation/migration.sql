-- AlterTable
ALTER TABLE "DepthChart" ADD COLUMN     "depthChartListId" INTEGER;

-- AddForeignKey
ALTER TABLE "DepthChart" ADD CONSTRAINT "DepthChart_depthChartListId_fkey" FOREIGN KEY ("depthChartListId") REFERENCES "DepthChartList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
