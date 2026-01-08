"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { BOX_DESIGNS, type BentoBoxDesign, getDesignById } from "./box-designs";

// ============================================
// TYPES
// ============================================

export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
}

interface BoxThemeContextType {
    // Current selected box design
    selectedDesign: BentoBoxDesign;
    // All available designs (for display purposes)
    allDesigns: BentoBoxDesign[];
    // Designs the user has unlocked
    unlockedDesignIds: string[];
    // Method to change the selected box
    setSelectedDesign: (designId: string) => void;
    // Active color palette (for future theming - null for now)
    activeColorPalette: ThemeColors | null;
    // Loading state
    isLoading: boolean;
    // Refresh unlocked designs (call after awards/stats update)
    refreshUnlockedDesigns: () => Promise<void>;
}

// ============================================
// CONTEXT
// ============================================

const BoxThemeContext = createContext<BoxThemeContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface BoxThemeProviderProps {
    children: React.ReactNode;
    userId?: string | null;
    initialDesignId?: string;
    initialUnlockedIds?: string[];
}

export function BoxThemeProvider({
    children,
    userId,
    initialDesignId = "wooden-classic",
    initialUnlockedIds = ["wooden-classic"],
}: BoxThemeProviderProps) {
    const [selectedDesignId, setSelectedDesignId] = useState(initialDesignId);
    const [unlockedDesignIds, setUnlockedDesignIds] = useState<string[]>(initialUnlockedIds);
    const [isLoading, setIsLoading] = useState(false);

    // Get the actual design object
    const selectedDesign = getDesignById(selectedDesignId) || BOX_DESIGNS[0];

    // Get color palette from selected design (null if not defined)
    const activeColorPalette = selectedDesign.colorPalette || null;

    // Fetch unlocked designs from server
    const refreshUnlockedDesigns = useCallback(async () => {
        if (!userId) {
            setUnlockedDesignIds(["wooden-classic"]);
            return;
        }

        try {
            const response = await fetch("/api/box-designs/unlocked");
            if (response.ok) {
                const data = await response.json();
                setUnlockedDesignIds(data.unlockedDesignIds || ["wooden-classic"]);
                if (data.selectedDesignId) {
                    setSelectedDesignId(data.selectedDesignId);
                }
            }
        } catch (error) {
            console.error("Failed to fetch unlocked box designs:", error);
        }
    }, [userId]);

    // Load user's saved preference on mount
    useEffect(() => {
        if (userId) {
            refreshUnlockedDesigns();
        }
    }, [userId, refreshUnlockedDesigns]);

    // Change selected design and save to server
    const setSelectedDesign = useCallback(
        async (designId: string) => {
            // Check if design is unlocked
            if (!unlockedDesignIds.includes(designId)) {
                console.warn("Cannot select locked design:", designId);
                return;
            }

            setSelectedDesignId(designId);

            // Save to server if user is logged in
            if (userId) {
                setIsLoading(true);
                try {
                    await fetch("/api/profile", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ selectedBoxDesign: designId }),
                    });
                } catch (error) {
                    console.error("Failed to save box design preference:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        },
        [userId, unlockedDesignIds]
    );

    const value: BoxThemeContextType = {
        selectedDesign,
        allDesigns: BOX_DESIGNS,
        unlockedDesignIds,
        setSelectedDesign,
        activeColorPalette,
        isLoading,
        refreshUnlockedDesigns,
    };

    return (
        <BoxThemeContext.Provider value={value}>
            {children}
        </BoxThemeContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

export function useBoxTheme(): BoxThemeContextType {
    const context = useContext(BoxThemeContext);
    if (context === undefined) {
        throw new Error("useBoxTheme must be used within a BoxThemeProvider");
    }
    return context;
}

// Optional: Hook that doesn't throw if used outside provider (for conditional usage)
export function useBoxThemeOptional(): BoxThemeContextType | null {
    return useContext(BoxThemeContext) || null;
}
