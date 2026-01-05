import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import {
    getRecentSessions,
    getSessionDistribution,
    getAverageFocusScore,
    getFocusScoreTrend,
    getPeakPerformance,
    getFocusSweetSpot,
    getAverageSessionLength,
    getMonthlyTotalMinutes,
    getUserStats,
    getUserAwards,
} from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();

        if (!supabaseUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = supabaseUser.id;

        // Fetch user from Prisma
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        // Fetch all data in parallel
        const [
            userStats,
            distribution,
            avgScore,
            scoreTrend,
            peakPerformance,
            focusSweetSpot,
            avgSession,
            monthlyMinutes,
            awards,
            sessions,
        ] = await Promise.all([
            getUserStats(userId),
            getSessionDistribution(userId, 25),
            getAverageFocusScore(userId, 25),
            getFocusScoreTrend(userId),
            getPeakPerformance(userId),
            getFocusSweetSpot(userId),
            getAverageSessionLength(userId),
            getMonthlyTotalMinutes(userId),
            getUserAwards(userId),
            getRecentSessions(userId, 25),
        ]);

        const monthlyHours = Math.floor(monthlyMinutes / 60);
        const monthlyRemainingMinutes = monthlyMinutes % 60;

        // Calculate next award progress
        const unlockedAwardTypes = awards.map(a => a.awardType);

        const analyticsData = {
            userName: user?.name || user?.email?.split("@")[0] || "User",
            focusScore: avgScore,
            focusScoreTrend: scoreTrend.change,
            currentStreak: userStats?.currentStreak ?? 0,
            totalSessions: userStats?.totalSessions ?? 0,
            totalFocusMinutes: userStats?.totalFocusMinutes ?? 0,
            sessionDistribution: distribution,
            insights: {
                peakPerformance,
                focusSweetSpot,
                averageSession: avgSession,
                monthlyTotal: { hours: monthlyHours, minutes: monthlyRemainingMinutes },
            },
            awards: {
                unlocked: unlockedAwardTypes,
                nextAward: calculateNextAward(userStats, unlockedAwardTypes),
            },
            recentSessions: sessions.map(s => ({
                id: s.id,
                type: s.type,
                taskName: s.taskName,
                duration: Math.round(s.durationActual / 60),
                focusScore: s.focusScore,
                completedAt: s.completedAt.toISOString(),
            })),
        };

        return NextResponse.json(analyticsData);
    } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}

function calculateNextAward(
    stats: { totalSessions: number; perfectScoreCount: number; noPauseSessionCount: number } | null,
    unlockedAwards: string[]
): { type: string; progress: number; total: number } | null {
    if (!stats) return { type: "TASK_STARTER", progress: 0, total: 5 };

    // Check awards in order of likely completion
    const awardProgress = [
        { type: "TASK_STARTER", progress: stats.totalSessions, total: 5 },
        { type: "PERFECT_FOCUS", progress: stats.perfectScoreCount, total: 25 },
        { type: "NO_PAUSE_PRO", progress: stats.noPauseSessionCount, total: 30 },
    ];

    for (const award of awardProgress) {
        if (!unlockedAwards.includes(award.type) && award.progress < award.total) {
            return award;
        }
    }

    return null;
}
