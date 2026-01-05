"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, AuthError } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Lazy-initialize Supabase client only on client-side
    const supabase = useMemo(() => {
        if (typeof window === 'undefined') {
            return null;
        }
        return createClient();
    }, []);

    // Sync user to Prisma database
    const syncUserToPrisma = useCallback(async (supabaseUser: User) => {
        try {
            const response = await fetch("/api/auth/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: supabaseUser.id,
                    email: supabaseUser.email,
                    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0],
                }),
            });
            if (!response.ok) {
                console.error("Failed to sync user to Prisma");
            }
        } catch (error) {
            console.error("Error syncing user:", error);
        }
    }, []);

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Get initial session
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                await syncUserToPrisma(session.user);
            }
            setLoading(false);
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: string, session: { user: User } | null) => {
                setUser(session?.user ?? null);
                if (event === "SIGNED_IN" && session?.user) {
                    await syncUserToPrisma(session.user);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, syncUserToPrisma]);

    const signIn = async (email: string, password: string) => {
        if (!supabase) {
            return { error: { message: "Auth not available" } as unknown as AuthError };
        }
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const signUp = async (email: string, password: string) => {
        if (!supabase) {
            return { error: { message: "Auth not available" } as unknown as AuthError };
        }
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { error };
    };

    const signOut = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
