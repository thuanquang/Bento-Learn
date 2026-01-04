import { prisma } from "./prisma";
import { Session, UserStats, UserAward, SessionType, AwardType } from "@prisma/client";

// ============================================
// SESSION DATA
// ============================================

export async function getRecentSessions(
    userId: string,
    limit: 25 | 50 | 100 = 25
): Promise<Session[]> {
    return prisma.session.findMany({
        where: { userId },
        orderBy: { completedAt: "desc" },
        take: limit,
    });
}

export async function getSessionsByType(
    userId: string,
    type: SessionType,
    limit: number = 50
): Promise<Session[]> {
    return prisma.session.findMany({
        where: { userId, type },
        orderBy: { completedAt: "desc" },
        take: limit,
    });
}

export async function getSessionsInDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
): Promise<Session[]> {
    return prisma.session.findMany({
        where: {
            userId,
            completedAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: { completedAt: "asc" },
    });
}

export async function getBentoSessionGroup(
    bentoSessionId: string
): Promise<Session[]> {
    return prisma.session.findMany({
        where: { bentoSessionId },
        orderBy: { bentoTaskIndex: "asc" },
    });
}

// ============================================
// USER STATS
// ============================================

export async function getUserStats(userId: string): Promise<UserStats | null> {
    return prisma.userStats.findUnique({
        where: { userId },
    });
}

export async function getOrCreateUserStats(userId: string): Promise<UserStats> {
    const existing = await prisma.userStats.findUnique({
        where: { userId },
    });

    if (existing) return existing;

    return prisma.userStats.create({
        data: { userId },
    });
}

// ============================================
// AWARDS
// ============================================

export async function getUserAwards(userId: string): Promise<UserAward[]> {
    return prisma.userAward.findMany({
        where: { userId },
        orderBy: { unlockedAt: "desc" },
    });
}

export async function hasAward(userId: string, awardType: AwardType): Promise<boolean> {
    const award = await prisma.userAward.findUnique({
        where: {
            userId_awardType: { userId, awardType },
        },
    });
    return award !== null;
}

// ============================================
// ANALYTICS CALCULATIONS
// ============================================

export interface SessionDistribution {
    timer: number;
    bento: number;
    routine: number;
}

export async function getSessionDistribution(
    userId: string,
    limit: 25 | 50 | 100 = 25
): Promise<SessionDistribution> {
    const sessions = await getRecentSessions(userId, limit);

    return {
        timer: sessions.filter(s => s.type === SessionType.TIMER).length,
        bento: sessions.filter(s => s.type === SessionType.BENTO).length,
        routine: sessions.filter(s => s.type === SessionType.ROUTINE).length,
    };
}

export async function getAverageFocusScore(
    userId: string,
    limit: 25 | 50 | 100 = 25
): Promise<number> {
    const sessions = await getRecentSessions(userId, limit);

    if (sessions.length === 0) return 0;

    const total = sessions.reduce((sum, s) => sum + s.focusScore, 0);
    return Math.round(total / sessions.length);
}

export interface FocusScoreTrend {
    currentWeek: number;
    previousWeek: number;
    change: number;
}

export async function getFocusScoreTrend(userId: string): Promise<FocusScoreTrend> {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [currentWeekSessions, previousWeekSessions] = await Promise.all([
        getSessionsInDateRange(userId, oneWeekAgo, now),
        getSessionsInDateRange(userId, twoWeeksAgo, oneWeekAgo),
    ]);

    const currentAvg = currentWeekSessions.length > 0
        ? Math.round(currentWeekSessions.reduce((sum, s) => sum + s.focusScore, 0) / currentWeekSessions.length)
        : 0;

    const previousAvg = previousWeekSessions.length > 0
        ? Math.round(previousWeekSessions.reduce((sum, s) => sum + s.focusScore, 0) / previousWeekSessions.length)
        : 0;

    return {
        currentWeek: currentAvg,
        previousWeek: previousAvg,
        change: currentAvg - previousAvg,
    };
}

// ============================================
// INSIGHTS
// ============================================

export interface PeakPerformance {
    window: string;
    score: number;
}

export async function getPeakPerformance(userId: string): Promise<PeakPerformance | null> {
    const sessions = await getRecentSessions(userId, 100);
    if (sessions.length < 5) return null;

    // Group sessions by time window
    const windows: Record<string, { total: number; count: number }> = {
        "Morning (6-9am)": { total: 0, count: 0 },
        "Late Morning (9-12pm)": { total: 0, count: 0 },
        "Afternoon (12-3pm)": { total: 0, count: 0 },
        "Late Afternoon (3-6pm)": { total: 0, count: 0 },
        "Evening (6-9pm)": { total: 0, count: 0 },
        "Night (9pm-12am)": { total: 0, count: 0 },
    };

    for (const session of sessions) {
        const hour = session.completedAt.getHours();
        let windowName: string;

        if (hour >= 6 && hour < 9) windowName = "Morning (6-9am)";
        else if (hour >= 9 && hour < 12) windowName = "Late Morning (9-12pm)";
        else if (hour >= 12 && hour < 15) windowName = "Afternoon (12-3pm)";
        else if (hour >= 15 && hour < 18) windowName = "Late Afternoon (3-6pm)";
        else if (hour >= 18 && hour < 21) windowName = "Evening (6-9pm)";
        else windowName = "Night (9pm-12am)";

        windows[windowName].total += session.focusScore;
        windows[windowName].count += 1;
    }

    // Find best window
    let best: PeakPerformance | null = null;
    for (const [window, data] of Object.entries(windows)) {
        if (data.count >= 3) {
            const avg = Math.round(data.total / data.count);
            if (!best || avg > best.score) {
                best = { window, score: avg };
            }
        }
    }

    return best;
}

export interface FocusSweetSpot {
    duration: string;
    score: number;
}

export async function getFocusSweetSpot(userId: string): Promise<FocusSweetSpot | null> {
    const sessions = await getRecentSessions(userId, 100);
    if (sessions.length < 5) return null;

    // Group by duration ranges
    const ranges: Record<string, { total: number; count: number }> = {
        "5-15 min": { total: 0, count: 0 },
        "15-25 min": { total: 0, count: 0 },
        "25-35 min": { total: 0, count: 0 },
        "35-45 min": { total: 0, count: 0 },
        "45-60 min": { total: 0, count: 0 },
        "60+ min": { total: 0, count: 0 },
    };

    for (const session of sessions) {
        const mins = Math.round(session.durationPlanned / 60);
        let rangeName: string;

        if (mins < 15) rangeName = "5-15 min";
        else if (mins < 25) rangeName = "15-25 min";
        else if (mins < 35) rangeName = "25-35 min";
        else if (mins < 45) rangeName = "35-45 min";
        else if (mins < 60) rangeName = "45-60 min";
        else rangeName = "60+ min";

        ranges[rangeName].total += session.focusScore;
        ranges[rangeName].count += 1;
    }

    // Find best range
    let best: FocusSweetSpot | null = null;
    for (const [duration, data] of Object.entries(ranges)) {
        if (data.count >= 3) {
            const avg = Math.round(data.total / data.count);
            if (!best || avg > best.score) {
                best = { duration, score: avg };
            }
        }
    }

    return best;
}

export async function getAverageSessionLength(userId: string): Promise<number> {
    const sessions = await getRecentSessions(userId, 50);
    if (sessions.length === 0) return 0;

    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationActual / 60, 0);
    return Math.round(totalMinutes / sessions.length);
}

export async function getMonthlyTotalMinutes(userId: string): Promise<number> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sessions = await getSessionsInDateRange(userId, thirtyDaysAgo, now);

    return sessions.reduce((sum, s) => sum + Math.round(s.durationActual / 60), 0);
}
