// Local session storage for guest users and offline fallback

import { SessionType } from "@prisma/client";

export interface LocalSession {
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
    synced: boolean;
}

const STORAGE_KEY = "bento_local_sessions";

export function getLocalSessions(): LocalSession[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function saveLocalSession(session: Omit<LocalSession, "id" | "synced">): void {
    if (typeof window === "undefined") return;

    const sessions = getLocalSessions();
    const newSession: LocalSession = {
        ...session,
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        synced: false,
    };
    sessions.push(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getUnsyncedSessions(): LocalSession[] {
    return getLocalSessions().filter(s => !s.synced);
}

export function markSessionsSynced(sessionIds: string[]): void {
    if (typeof window === "undefined") return;

    const sessions = getLocalSessions();
    const updated = sessions.map(s =>
        sessionIds.includes(s.id) ? { ...s, synced: true } : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearSyncedSessions(): void {
    if (typeof window === "undefined") return;

    const sessions = getLocalSessions().filter(s => !s.synced);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export async function syncLocalSessions(): Promise<void> {
    const unsyncedSessions = getUnsyncedSessions();

    if (unsyncedSessions.length === 0) return;

    try {
        const response = await fetch("/api/sessions/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessions: unsyncedSessions }),
        });

        if (response.ok) {
            const { syncedIds } = await response.json();
            markSessionsSynced(syncedIds);
            clearSyncedSessions();
        }
    } catch (error) {
        console.error("Failed to sync local sessions:", error);
    }
}

export function getLocalSessionCount(): number {
    return getUnsyncedSessions().length;
}
