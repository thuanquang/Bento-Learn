import { PrismaClient, SessionType, AwardType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // Create demo user
    const user = await prisma.user.upsert({
        where: { email: "demo@bentolearn.app" },
        update: {},
        create: {
            email: "demo@bentolearn.app",
            name: "Alex",
            username: "alex_focus",
            image: null,
        },
    });

    console.log(`✅ Created user: ${user.email}`);

    // Create UserStats
    await prisma.userStats.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            currentStreak: 5,
            longestStreak: 12,
            lastActiveDate: new Date(),
            totalSessions: 42,
            totalFocusMinutes: 1260,
            perfectScoreCount: 8,
            noPauseSessionCount: 15,
            defaultDuration: 25,
            defaultSound: "rain",
        },
    });

    console.log("✅ Created user stats");

    // Create sample sessions (last 30 days)
    const sessions = [];
    const now = new Date();

    // Timer sessions
    for (let i = 0; i < 20; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        date.setHours(9 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));

        const pauseCount = Math.floor(Math.random() * 4);
        const focusScore = Math.max(0, 100 - pauseCount * 15 - Math.floor(Math.random() * 10));
        const durationPlanned = [15, 25, 45, 60][Math.floor(Math.random() * 4)] * 60;
        const durationActual = durationPlanned - Math.floor(Math.random() * 120);

        sessions.push({
            userId: user.id,
            type: SessionType.TIMER,
            taskName: ["Deep Work", "Code Review", "Reading", "Writing", "Planning"][Math.floor(Math.random() * 5)],
            durationPlanned,
            durationActual,
            pauseCount,
            focusScore,
            completedAt: date,
            createdAt: date,
        });
    }

    // Bento sessions (3-task groups)
    for (let i = 0; i < 5; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        date.setHours(14 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 60));

        const bentoSessionId = `bento-${Date.now()}-${i}`;
        const taskNames = ["Email", "Review", "Document"];
        const durations = [15, 20, 25];

        for (let j = 0; j < 3; j++) {
            const taskDate = new Date(date);
            taskDate.setMinutes(taskDate.getMinutes() + j * 25);

            const pauseCount = Math.floor(Math.random() * 3);
            const focusScore = Math.max(40, 100 - pauseCount * 15 - Math.floor(Math.random() * 10));
            const durationPlanned = durations[j] * 60;

            sessions.push({
                userId: user.id,
                type: SessionType.BENTO,
                taskName: taskNames[j],
                durationPlanned,
                durationActual: durationPlanned,
                pauseCount,
                focusScore,
                bentoSessionId,
                bentoTaskIndex: j,
                completedAt: taskDate,
                createdAt: taskDate,
            });
        }
    }

    // Clear existing sessions and insert new ones
    await prisma.session.deleteMany({ where: { userId: user.id } });
    await prisma.session.createMany({ data: sessions });

    console.log(`✅ Created ${sessions.length} sessions`);

    // Create some awards
    await prisma.userAward.deleteMany({ where: { userId: user.id } });

    const awards = [
        { userId: user.id, awardType: AwardType.TASK_STARTER, unlockedAt: new Date(now.setDate(now.getDate() - 25)) },
        { userId: user.id, awardType: AwardType.TIMER_SPECIALIST, unlockedAt: new Date() },
    ];

    await prisma.userAward.createMany({ data: awards });

    console.log(`✅ Created ${awards.length} awards`);

    console.log("\n🎉 Seed completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
