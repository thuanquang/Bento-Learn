import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

        // Fetch user and stats from Prisma
        const [user, stats] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
            }),
            prisma.userStats.findUnique({
                where: { userId },
            }),
        ]);

        return NextResponse.json({
            user: user ? {
                name: user.name,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
            } : null,
            stats: stats ? {
                totalSessions: stats.totalSessions,
                totalFocusMinutes: stats.totalFocusMinutes,
                currentStreak: stats.currentStreak,
                longestStreak: stats.longestStreak,
                defaultDuration: stats.defaultDuration,
                defaultSound: stats.defaultSound,
            } : {
                totalSessions: 0,
                totalFocusMinutes: 0,
                currentStreak: 0,
                longestStreak: 0,
                defaultDuration: 25,
                defaultSound: "off",
            },
        });
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
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
        const body = await request.json();

        // Update user profile
        if (body.name !== undefined) {
            await prisma.user.update({
                where: { id: userId },
                data: { name: body.name },
            });
        }

        // Update user settings
        if (body.defaultDuration !== undefined || body.defaultSound !== undefined) {
            await prisma.userStats.update({
                where: { userId },
                data: {
                    ...(body.defaultDuration !== undefined && { defaultDuration: body.defaultDuration }),
                    ...(body.defaultSound !== undefined && { defaultSound: body.defaultSound }),
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
