"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AwardType, SessionType } from "@prisma/client";

// ============================================
// AWARD DEFINITIONS
// ============================================

interface AwardDefinition {
    type: AwardType;
    name: string;
    description: string;
    threshold: number;
    check: (userId: string) => Promise<{ current: number; unlocked: boolean }>;
}

const AWARD_DEFINITIONS: AwardDefinition[] = [
    // Focus Mastery
    {
        type: AwardType.TASK_STARTER,
        name: "Task Starter",
        description: "Complete 5 focus sessions",
        threshold: 5,
        check: async (userId) => {
            const count = await prisma.session.count({ where: { userId } });
            return { current: count, unlocked: count >= 5 };
        },
    },
    {
        type: AwardType.PERFECT_FOCUS,
        name: "Perfect Focus",
        description: "Achieve 25 perfect focus scores (100%)",
        threshold: 25,
        check: async (userId) => {
            const stats = await prisma.userStats.findUnique({ where: { userId } });
            const count = stats?.perfectScoreCount ?? 0;
            return { current: count, unlocked: count >= 25 };
        },
    },
    {
        type: AwardType.FOCUS_CHAMPION,
        name: "Focus Champion",
        description: "Complete 50 sessions with 90%+ focus",
        threshold: 50,
        check: async (userId) => {
            const count = await prisma.session.count({
                where: { userId, focusScore: { gte: 90 } },
            });
            return { current: count, unlocked: count >= 50 };
        },
    },
    {
        type: AwardType.STEADY_PERFORMER,
        name: "Steady Performer",
        description: "Complete 20 sessions between 25-45 minutes",
        threshold: 20,
        check: async (userId) => {
            const count = await prisma.session.count({
                where: {
                    userId,
                    durationActual: { gte: 25 * 60, lte: 45 * 60 },
                },
            });
            return { current: count, unlocked: count >= 20 };
        },
    },

    // ADHD Superpowers
    {
        type: AwardType.TIMER_SPECIALIST,
        name: "Timer Specialist",
        description: "Complete 50 timer sessions",
        threshold: 50,
        check: async (userId) => {
            const count = await prisma.session.count({
                where: { userId, type: SessionType.TIMER },
            });
            return { current: count, unlocked: count >= 50 };
        },
    },
    {
        type: AwardType.COMEBACK_CHAMPION,
        name: "Comeback Champion",
        description: "Complete 5 sessions with 4+ pauses (never give up!)",
        threshold: 5,
        check: async (userId) => {
            const count = await prisma.session.count({
                where: { userId, pauseCount: { gte: 4 } },
            });
            return { current: count, unlocked: count >= 5 };
        },
    },
    {
        type: AwardType.ZEN_MASTER,
        name: "Zen Master",
        description: "Complete 20 perfect sessions with no pauses",
        threshold: 20,
        check: async (userId) => {
            const count = await prisma.session.count({
                where: { userId, focusScore: 100, pauseCount: 0 },
            });
            return { current: count, unlocked: count >= 20 };
        },
    },
    {
        type: AwardType.NO_PAUSE_PRO,
        name: "No-Pause Pro",
        description: "Complete 30 sessions without pausing",
        threshold: 30,
        check: async (userId) => {
            const stats = await prisma.userStats.findUnique({ where: { userId } });
            const count = stats?.noPauseSessionCount ?? 0;
            return { current: count, unlocked: count >= 30 };
        },
    },

    // Consistency Builder
    {
        type: AwardType.BENTO_MASTER,
        name: "Bento Master",
        description: "Complete 25 bento box sessions",
        threshold: 25,
        check: async (userId) => {
            const count = await prisma.session.count({
                where: { userId, type: SessionType.BENTO },
            });
            return { current: count, unlocked: count >= 25 };
        },
    },
    {
        type: AwardType.ROUTINE_CHAMPION,
        name: "Routine Champion",
        description: "Complete 25 routine sessions",
        threshold: 25,
        check: async (userId) => {
            const count = await prisma.session.count({
                where: { userId, type: SessionType.ROUTINE },
            });
            return { current: count, unlocked: count >= 25 };
        },
    },
    {
        type: AwardType.ROUTINE_BUILDER,
        name: "Routine Builder",
        description: "Maintain a 30-day focus streak",
        threshold: 30,
        check: async (userId) => {
            const stats = await prisma.userStats.findUnique({ where: { userId } });
            const streak = Math.max(stats?.currentStreak ?? 0, stats?.longestStreak ?? 0);
            return { current: streak, unlocked: streak >= 30 };
        },
    },
    {
        type: AwardType.PERSISTENCE_MASTER,
        name: "Persistence Master",
        description: "Complete 30 sessions with 1-3 pauses (persistence pays off)",
        threshold: 30,
        check: async (userId) => {
            const count = await prisma.session.count({
                where: {
                    userId,
                    pauseCount: { gte: 1, lte: 3 },
                },
            });
            return { current: count, unlocked: count >= 30 };
        },
    },
];

// ============================================
// CHECK AND UNLOCK AWARDS
// ============================================

export async function checkAndUnlockAwards(userId: string) {
    const unlockedAwards: AwardType[] = [];

    for (const award of AWARD_DEFINITIONS) {
        // Check if already unlocked
        const existing = await prisma.userAward.findUnique({
            where: { userId_awardType: { userId, awardType: award.type } },
        });

        if (existing) continue;

        // Check if criteria met
        const { unlocked } = await award.check(userId);

        if (unlocked) {
            await prisma.userAward.create({
                data: {
                    userId,
                    awardType: award.type,
                },
            });
            unlockedAwards.push(award.type);
        }
    }

    if (unlockedAwards.length > 0) {
        revalidatePath("/analytics");
    }

    return unlockedAwards;
}

// ============================================
// GET AWARD PROGRESS
// ============================================

export interface AwardProgress {
    type: AwardType;
    name: string;
    description: string;
    current: number;
    threshold: number;
    progress: number; // 0-100
    isUnlocked: boolean;
    unlockedAt?: Date;
}

export async function getAwardProgress(userId: string): Promise<AwardProgress[]> {
    const userAwards = await prisma.userAward.findMany({
        where: { userId },
    });

    const unlockedMap = new Map(
        userAwards.map((a) => [a.awardType, a.unlockedAt])
    );

    const progress: AwardProgress[] = [];

    for (const award of AWARD_DEFINITIONS) {
        const isUnlocked = unlockedMap.has(award.type);
        const { current } = await award.check(userId);

        progress.push({
            type: award.type,
            name: award.name,
            description: award.description,
            current,
            threshold: award.threshold,
            progress: Math.min(100, (current / award.threshold) * 100),
            isUnlocked,
            unlockedAt: unlockedMap.get(award.type),
        });
    }

    return progress;
}

// ============================================
// GET NEXT UNLOCKABLE AWARD
// ============================================

export async function getNextAward(userId: string): Promise<AwardProgress | null> {
    const allProgress = await getAwardProgress(userId);

    const locked = allProgress.filter((a) => !a.isUnlocked);
    if (locked.length === 0) return null;

    // Sort by progress percentage (descending) to find closest to unlock
    locked.sort((a, b) => b.progress - a.progress);

    return locked[0];
}
