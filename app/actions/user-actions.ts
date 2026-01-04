"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================
// UPDATE USER PROFILE
// ============================================

export interface UpdateProfileInput {
    userId: string;
    name?: string;
    username?: string;
}

export async function updateProfile(input: UpdateProfileInput) {
    try {
        const user = await prisma.user.update({
            where: { id: input.userId },
            data: {
                ...(input.name && { name: input.name }),
                ...(input.username && { username: input.username }),
            },
        });

        revalidatePath("/profile");

        return { success: true, user };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

// ============================================
// UPDATE USER SETTINGS
// ============================================

export interface UpdateSettingsInput {
    userId: string;
    defaultDuration?: number;
    defaultSound?: string;
}

export async function updateSettings(input: UpdateSettingsInput) {
    try {
        // Get or create user stats
        let stats = await prisma.userStats.findUnique({
            where: { userId: input.userId },
        });

        if (!stats) {
            stats = await prisma.userStats.create({
                data: { userId: input.userId },
            });
        }

        // Update settings
        await prisma.userStats.update({
            where: { userId: input.userId },
            data: {
                ...(input.defaultDuration && { defaultDuration: input.defaultDuration }),
                ...(input.defaultSound && { defaultSound: input.defaultSound }),
            },
        });

        revalidatePath("/profile");
        revalidatePath("/timer");
        revalidatePath("/focus-box");

        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, error: "Failed to update settings" };
    }
}

// ============================================
// GET USER WITH STATS
// ============================================

export async function getUserWithStats(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                stats: true,
                awards: true,
            },
        });

        return user;
    } catch (error) {
        console.error("Failed to get user:", error);
        return null;
    }
}
