/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudyLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('TIMER', 'BENTO', 'ROUTINE');

-- CreateEnum
CREATE TYPE "AwardType" AS ENUM ('TASK_STARTER', 'PERFECT_FOCUS', 'FOCUS_CHAMPION', 'STEADY_PERFORMER', 'TIMER_SPECIALIST', 'COMEBACK_CHAMPION', 'ZEN_MASTER', 'NO_PAUSE_PRO', 'BENTO_MASTER', 'ROUTINE_CHAMPION', 'ROUTINE_BUILDER', 'PERSISTENCE_MASTER');

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudyLog" DROP CONSTRAINT "StudyLog_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "StudyLog" DROP CONSTRAINT "StudyLog_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password";

-- DropTable
DROP TABLE "Resource";

-- DropTable
DROP TABLE "StudyLog";

-- DropEnum
DROP TYPE "ResourceStatus";

-- DropEnum
DROP TYPE "ResourceTier";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "SessionType" NOT NULL,
    "taskName" TEXT NOT NULL DEFAULT 'Focus Session',
    "durationPlanned" INTEGER NOT NULL,
    "durationActual" INTEGER NOT NULL,
    "pauseCount" INTEGER NOT NULL DEFAULT 0,
    "focusScore" INTEGER NOT NULL,
    "bentoSessionId" TEXT,
    "bentoTaskIndex" INTEGER,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAward" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "awardType" "AwardType" NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TIMESTAMP(3),
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalFocusMinutes" INTEGER NOT NULL DEFAULT 0,
    "perfectScoreCount" INTEGER NOT NULL DEFAULT 0,
    "noPauseSessionCount" INTEGER NOT NULL DEFAULT 0,
    "defaultDuration" INTEGER NOT NULL DEFAULT 25,
    "defaultSound" TEXT NOT NULL DEFAULT 'off',
    "selectedBoxDesign" TEXT NOT NULL DEFAULT 'wooden-classic',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_userId_completedAt_idx" ON "Session"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "Session_bentoSessionId_idx" ON "Session"("bentoSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAward_userId_awardType_key" ON "UserAward"("userId", "awardType");

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_key" ON "UserStats"("userId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAward" ADD CONSTRAINT "UserAward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
