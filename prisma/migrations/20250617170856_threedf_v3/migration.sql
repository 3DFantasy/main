-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "geniusTeamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepthChartList" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "value" TEXT,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepthChartList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepthChart" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepthChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 2024,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drive" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "geniusTeamId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "isScoring" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER,
    "nextPointOutcome" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Play" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "geniusTeamId" TEXT NOT NULL,
    "driveId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "subtype" TEXT,
    "description" TEXT NOT NULL,
    "clock" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "phase" TEXT NOT NULL,
    "phaseQualifier" TEXT NOT NULL,
    "isScoring" BOOLEAN NOT NULL,
    "startPosition" TEXT NOT NULL,
    "endPosition" TEXT,
    "down" INTEGER,
    "distance" TEXT,
    "yardLine" INTEGER,
    "kicker" TEXT,
    "passer" TEXT,
    "rusher" TEXT,
    "receiver" TEXT,
    "defense" TEXT,
    "yardsGained" INTEGER,
    "puntYards" INTEGER,
    "returnYards" INTEGER,
    "epa" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Play_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_uuid_key" ON "Account"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Team_uuid_key" ON "Team"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Team_geniusTeamId_key" ON "Team"("geniusTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "DepthChartList_uuid_key" ON "DepthChartList"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "DepthChart_uuid_key" ON "DepthChart"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Game_uuid_key" ON "Game"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Drive_uuid_key" ON "Drive"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Play_uuid_key" ON "Play"("uuid");

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
