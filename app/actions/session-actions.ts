"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SessionType } from "@prisma/client";
import { checkAndUnlockAwards } from "./award-actions";

// ============================================
// CREATE SESSION
// ============================================

export interface CreateSessionInput {
    userId: string;
    type: SessionType;
    taskName: string;
    durationPlanned: number; // in seconds
    durationActual: number;  // in seconds
    pauseCount: number;
    focusScore: number;      // 0-100
    bentoSessionId?: string;
    bentoTaskIndex?: number;
}

export async function createSession(input: CreateSessionInput) {
    try {
        // Create the session
        const session = await prisma.session.create({
            data: {
                userId: input.userId,
                type: input.type,
                taskName: input.taskName,
                durationPlanned: input.durationPlanned,
                durationActual: input.durationActual,
                pauseCount: input.pauseCount,
                focusScore: input.focusScore,
                bentoSessionId: input.bentoSessionId,
                bentoTaskIndex: input.bentoTaskIndex,
            },
        });

        // Update user stats
        await updateUserStatsAfterSession(input);

        // Check for new awards
        await checkAndUnlockAwards(input.userId);

        revalidatePath("/analytics");
        revalidatePath("/profile");

        return { success: true, session };
    } catch (error) {
        console.error("Failed to create session:", error);
        return { success: false, error: "Failed to save session" };
    }
}

// ============================================
// UPDATE USER STATS
// ============================================

async function updateUserStatsAfterSession(input: CreateSessionInput) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create user stats
    let stats = await prisma.userStats.findUnique({
        where: { userId: input.userId },
    });

    if (!stats) {
        stats = await prisma.userStats.create({
            data: { userId: input.userId },
        });
    }

    // Calculate streak
    let newStreak = stats.currentStreak;
    let newLongestStreak = stats.longestStreak;

    if (stats.lastActiveDate) {
        const lastActive = new Date(stats.lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastActive.getTime() === yesterday.getTime()) {
            // Consecutive day - increment streak
            newStreak = stats.currentStreak + 1;
        } else if (lastActive.getTime() < yesterday.getTime()) {
            // Streak broken - reset to 1
            newStreak = 1;
        }
        // If same day, keep streak as is
    } else {
        // First session ever
        newStreak = 1;
    }

    newLongestStreak = Math.max(newLongestStreak, newStreak);

    // Update stats
    await prisma.userStats.update({
        where: { userId: input.userId },
        data: {
            totalSessions: stats.totalSessions + 1,
            totalFocusMinutes: stats.totalFocusMinutes + Math.round(input.durationActual / 60),
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastActiveDate: new Date(),
            perfectScoreCount: input.focusScore === 100
                ? stats.perfectScoreCount + 1
                : stats.perfectScoreCount,
            noPauseSessionCount: input.pauseCount === 0
                ? stats.noPauseSessionCount + 1
                : stats.noPauseSessionCount,
        },
    });
}

// ============================================
// CREATE BENTO SESSION (All 3 tasks)
// ============================================

export interface CreateBentoSessionInput {
    userId: string;
    tasks: Array<{
        taskName: string;
        durationPlanned: number;
        durationActual: number;
        pauseCount: number;
        focusScore: number;
    }>;
}

export async function createBentoSession(input: CreateBentoSessionInput) {
    try {
        const bentoSessionId = `bento-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create all three sessions
        for (let i = 0; i < input.tasks.length; i++) {
            const task = input.tasks[i];
            await createSession({
                userId: input.userId,
                type: SessionType.BENTO,
                taskName: task.taskName,
                durationPlanned: task.durationPlanned,
                durationActual: task.durationActual,
                pauseCount: task.pauseCount,
                focusScore: task.focusScore,
                bentoSessionId,
                bentoTaskIndex: i,
            });
        }

        return { success: true, bentoSessionId };
    } catch (error) {
        console.error("Failed to create bento session:", error);
        return { success: false, error: "Failed to save bento session" };
    }
}
