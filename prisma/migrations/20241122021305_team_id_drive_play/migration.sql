-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "teamId" TEXT NOT NULL DEFAULT '123456';

-- CreateTable
CREATE TABLE "Drive" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "isScoring" BOOLEAN NOT NULL,
    "points" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Play" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "driveId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subtype" TEXT,
    "description" TEXT NOT NULL,
    "clock" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "phase" TEXT NOT NULL,
    "phaseQualifier" TEXT NOT NULL,
    "isScoring" BOOLEAN NOT NULL,
    "startPosition" TEXT NOT NULL,
    "endPosition" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Play_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Drive" ADD CONSTRAINT "Drive_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drive" ADD CONSTRAINT "Drive_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Play" ADD CONSTRAINT "Play_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "Drive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Play" ADD CONSTRAINT "Play_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Play" ADD CONSTRAINT "Play_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
