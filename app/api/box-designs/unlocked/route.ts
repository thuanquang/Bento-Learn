import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getUnlockedDesignIds, BOX_DESIGNS } from "@/lib/box-designs";

/**
 * GET /api/box-designs/unlocked
 * Returns the user's unlocked box designs and their current selection
 */
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // For non-logged in users, return only default design
            return NextResponse.json({
                unlockedDesignIds: ["wooden-classic"],
                selectedDesignId: "wooden-classic",
                allDesigns: BOX_DESIGNS.map(d => ({
                    id: d.id,
                    name: d.name,
                    description: d.description,
                    previewColor: d.previewColor,
                    unlockRequirement: d.unlockRequirement,
                })),
            });
        }

        // Get user stats
        const userStats = await prisma.userStats.findUnique({
            where: { userId: user.id },
            select: {
                totalSessions: true,
                currentStreak: true,
                longestStreak: true,
                selectedBoxDesign: true,
            },
        });

        // Get user's unlocked awards
        const userAwards = await prisma.userAward.findMany({
            where: { userId: user.id },
            select: { awardType: true },
        });

        const unlockedAwardTypes = userAwards.map(a => a.awardType);

        // Calculate unlocked designs
        const unlockedDesignIds = getUnlockedDesignIds(userStats, unlockedAwardTypes);

        return NextResponse.json({
            unlockedDesignIds,
            selectedDesignId: userStats?.selectedBoxDesign || "wooden-classic",
            allDesigns: BOX_DESIGNS.map(d => ({
                id: d.id,
                name: d.name,
                description: d.description,
                previewColor: d.previewColor,
                unlockRequirement: d.unlockRequirement,
            })),
        });
    } catch (error) {
        console.error("Error fetching unlocked box designs:", error);
        return NextResponse.json(
            { error: "Failed to fetch box designs" },
            { status: 500 }
        );
    }
}
