import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { id, email, name } = await request.json();

        if (!id || !email) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Upsert user to Prisma
        const user = await prisma.user.upsert({
            where: { id },
            update: {
                email,
                name,
            },
            create: {
                id,
                email,
                name,
            },
        });

        // Ensure UserStats exists
        await prisma.userStats.upsert({
            where: { userId: id },
            update: {},
            create: { userId: id },
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Error syncing user:", error);
        return NextResponse.json(
            { error: "Failed to sync user" },
            { status: 500 }
        );
    }
}
