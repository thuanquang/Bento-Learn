"use client";

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

// ============================================
// NAVIGATION TRANSITION CONTEXT
// Coordinates lid animations with page navigation
// ============================================

type AnimationPhase = "idle" | "closing" | "navigating" | "opening";

interface NavigationTransitionContextType {
    phase: AnimationPhase;
    navigateWithTransition: (href: string) => void;
    onLidClosed: () => void;
    onLidOpened: () => void;
    pendingPath: string | null;
}

const NavigationTransitionContext = createContext<NavigationTransitionContextType | null>(null);

export function NavigationTransitionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [phase, setPhase] = useState<AnimationPhase>("idle");
    const [pendingPath, setPendingPath] = useState<string | null>(null);

    // Queue for handling rapid navigations
    const navigationQueueRef = useRef<string[]>([]);

    const navigateWithTransition = useCallback((href: string) => {
        // Don't navigate to current page
        if (href === pathname) return;

        console.log('[NavTransition] Navigate requested:', href, 'current phase:', phase);

        if (phase === "idle") {
            // Start the closing animation
            setPendingPath(href);
            setPhase("closing");
            console.log('[NavTransition] Starting close animation');
        } else {
            // Queue this navigation for later
            navigationQueueRef.current.push(href);
            console.log('[NavTransition] Navigation queued');
        }
    }, [pathname, phase]);

    const onLidClosed = useCallback(() => {
        if (phase !== "closing") return;

        console.log('[NavTransition] Lid closed, now navigating');

        // Now actually perform the navigation
        if (pendingPath) {
            setPhase("navigating");
            router.push(pendingPath);
        }
    }, [phase, pendingPath, router]);

    const onLidOpened = useCallback(() => {
        console.log('[NavTransition] Lid opened');

        // Check if there are queued navigations
        if (navigationQueueRef.current.length > 0) {
            const nextPath = navigationQueueRef.current.shift()!;
            setPendingPath(nextPath);
            setPhase("closing");
            console.log('[NavTransition] Processing queued navigation:', nextPath);
        } else {
            setPhase("idle");
            setPendingPath(null);
        }
    }, []);

    // Detect when navigation completes (pathname changes to pending path)
    React.useEffect(() => {
        if (phase === "navigating" && pathname === pendingPath) {
            console.log('[NavTransition] Navigation complete, opening lid');
            setPhase("opening");
        }
    }, [pathname, pendingPath, phase]);

    return (
        <NavigationTransitionContext.Provider
            value={{
                phase,
                navigateWithTransition,
                onLidClosed,
                onLidOpened,
                pendingPath,
            }}
        >
            {children}
        </NavigationTransitionContext.Provider>
    );
}

export function useNavigationTransition() {
    const context = useContext(NavigationTransitionContext);
    if (!context) {
        throw new Error("useNavigationTransition must be used within NavigationTransitionProvider");
    }
    return context;
}
