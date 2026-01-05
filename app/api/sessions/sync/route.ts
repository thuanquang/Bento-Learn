import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SessionType } from "@prisma/client";
import { checkAndUnlockAwards } from "@/app/actions/award-actions";

interface LocalSession {
    id: string;
    type: SessionType;
    taskName: string;
    durationPlanned: number;
    durationActual: number;
    pauseCount: number;
    focusScore: number;
    completedAt: string;
    bentoSessionId?: string;
    bentoTaskIndex?: number;
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { sessions } = await request.json() as { sessions: LocalSession[] };
        const syncedIds: string[] = [];

        for (const session of sessions) {
            try {
                await prisma.session.create({
                    data: {
                        userId: user.id,
                        type: session.type,
                        taskName: session.taskName,
                        durationPlanned: session.durationPlanned,
                        durationActual: session.durationActual,
                        pauseCount: session.pauseCount,
                        focusScore: session.focusScore,
                        completedAt: new Date(session.completedAt),
                        bentoSessionId: session.bentoSessionId,
                        bentoTaskIndex: session.bentoTaskIndex,
                    },
                });

                // Update user stats
                await updateUserStats(user.id, session);

                syncedIds.push(session.id);
            } catch (error) {
                console.error(`Failed to sync session ${session.id}:`, error);
            }
        }

        // Check for new awards after syncing
        if (syncedIds.length > 0) {
            await checkAndUnlockAwards(user.id);
        }

        return NextResponse.json({ success: true, syncedIds });
    } catch (error) {
        console.error("Error syncing sessions:", error);
        return NextResponse.json(
            { error: "Failed to sync sessions" },
            { status: 500 }
        );
    }
}

async function updateUserStats(userId: string, session: LocalSession) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let stats = await prisma.userStats.findUnique({
        where: { userId },
    });

    if (!stats) {
        stats = await prisma.userStats.create({
            data: { userId },
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
            newStreak = stats.currentStreak + 1;
        } else if (lastActive.getTime() < yesterday.getTime()) {
            newStreak = 1;
        }
    } else {
        newStreak = 1;
    }

    newLongestStreak = Math.max(newLongestStreak, newStreak);

    await prisma.userStats.update({
        where: { userId },
        data: {
            totalSessions: stats.totalSessions + 1,
            totalFocusMinutes: stats.totalFocusMinutes + Math.round(session.durationActual / 60),
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastActiveDate: new Date(),
            perfectScoreCount: session.focusScore === 100
                ? stats.perfectScoreCount + 1
                : stats.perfectScoreCount,
            noPauseSessionCount: session.pauseCount === 0
                ? stats.noPauseSessionCount + 1
                : stats.noPauseSessionCount,
        },
    });
}
