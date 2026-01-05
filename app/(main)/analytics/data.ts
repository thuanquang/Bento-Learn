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

export interface AnalyticsData {
    user: {
        id: string;
        name: string | null;
        email: string;
    } | null;
    stats: {
        focusScore: number;
        focusScoreTrend: number;
        currentStreak: number;
        totalSessions: number;
        totalFocusMinutes: number;
    };
    sessionDistribution: {
        timer: number;
        bento: number;
        routine: number;
    };
    insights: {
        peakPerformance: { window: string; score: number } | null;
        focusSweetSpot: { duration: string; score: number } | null;
        averageSession: number;
        monthlyTotal: { hours: number; minutes: number };
    };
    awards: {
        unlocked: string[];
        nextAward: { type: string; progress: number; total: number } | null;
    };
    recentSessions: Array<{
        id: string;
        type: string;
        taskName: string;
        duration: number;
        focusScore: number;
        completedAt: Date;
    }>;
}

export async function getAnalyticsData(sessionCount: 25 | 50 | 100 = 25): Promise<AnalyticsData | null> {
    try {
        const supabase = await createClient();
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();

        if (!supabaseUser) {
            return null;
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
            getSessionDistribution(userId, sessionCount),
            getAverageFocusScore(userId, sessionCount),
            getFocusScoreTrend(userId),
            getPeakPerformance(userId),
            getFocusSweetSpot(userId),
            getAverageSessionLength(userId),
            getMonthlyTotalMinutes(userId),
            getUserAwards(userId),
            getRecentSessions(userId, sessionCount),
        ]);

        const monthlyHours = Math.floor(monthlyMinutes / 60);
        const monthlyRemainingMinutes = monthlyMinutes % 60;

        // Calculate next award progress (simplified)
        const unlockedAwardTypes = awards.map(a => a.awardType);

        return {
            user: user ? {
                id: user.id,
                name: user.name,
                email: user.email,
            } : null,
            stats: {
                focusScore: avgScore,
                focusScoreTrend: scoreTrend.change,
                currentStreak: userStats?.currentStreak ?? 0,
                totalSessions: userStats?.totalSessions ?? 0,
                totalFocusMinutes: userStats?.totalFocusMinutes ?? 0,
            },
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
                completedAt: s.completedAt,
            })),
        };
    } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        return null;
    }
}

function calculateNextAward(
    stats: { totalSessions: number; perfectScoreCount: number; noPauseSessionCount: number } | null,
    unlockedAwards: string[]
): { type: string; progress: number; total: number } | null {
    if (!stats) return null;

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
