import React from "react";
import type { ThemeColors } from "./box-theme-context";
import { WoodenBox } from "@/components/bento-container/WoodenBox";
import { WoodenLid } from "@/components/bento-container/WoodenLid";

// ============================================
// BOX DESIGN INTERFACE
// ============================================

export interface BoxProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export interface LidProps {
    className?: string;
    style?: React.CSSProperties;
}

export interface BentoBoxDesign {
    id: string;
    name: string;
    description: string;
    // Unlock requirement - if undefined, design is always unlocked
    unlockRequirement?: {
        type: "award" | "sessions" | "streak";
        value: string | number;
        description: string;
    };
    // The box component (renders the container visuals)
    BoxComponent: React.FC<BoxProps>;
    // The lid component (renders the lid visuals)
    LidComponent: React.FC<LidProps>;
    // Optional color palette for future theming
    colorPalette?: ThemeColors;
    // Preview image/icon for the selector
    previewColor: string;
}

// ============================================
// PLACEHOLDER BOX COMPONENTS
// These will be replaced with actual designs in task 2
// ============================================

const PlaceholderBox: React.FC<BoxProps> = ({ children, className, style }) => (
    <div className={className} style={style}>
        {children}
    </div>
);

const PlaceholderLid: React.FC<LidProps> = ({ className, style }) => (
    <div className={className} style={style} />
);

// ============================================
// BOX DESIGNS REGISTRY
// ============================================

export const BOX_DESIGNS: BentoBoxDesign[] = [
    {
        id: "wooden-classic",
        name: "Classic Wooden",
        description: "A warm, traditional wooden bento box",
        // No unlock requirement - always available
        BoxComponent: WoodenBox,
        LidComponent: WoodenLid,
        previewColor: "#8B7355",
        colorPalette: {
            primary: "#8B7355",
            secondary: "#A0522D",
            accent: "#DEB887",
            background: "#F5F5DC",
            surface: "#FAEBD7",
            text: "#4A3728",
        },
    },
    {
        id: "bamboo-zen",
        name: "Bamboo Zen",
        description: "A serene bamboo-style box for focused minds",
        unlockRequirement: {
            type: "sessions",
            value: 25,
            description: "Complete 25 focus sessions",
        },
        BoxComponent: PlaceholderBox,
        LidComponent: PlaceholderLid,
        previewColor: "#7CB342",
        colorPalette: {
            primary: "#7CB342",
            secondary: "#558B2F",
            accent: "#C5E1A5",
            background: "#F1F8E9",
            surface: "#DCEDC8",
            text: "#33691E",
        },
    },
    {
        id: "lacquered-red",
        name: "Lacquered Red",
        description: "An elegant lacquered box with a premium finish",
        unlockRequirement: {
            type: "award",
            value: "FOCUS_CHAMPION",
            description: "Earn the Focus Champion award",
        },
        BoxComponent: PlaceholderBox,
        LidComponent: PlaceholderLid,
        previewColor: "#C62828",
        colorPalette: {
            primary: "#C62828",
            secondary: "#8E0000",
            accent: "#FFCDD2",
            background: "#FFEBEE",
            surface: "#FFCDD2",
            text: "#B71C1C",
        },
    },
    {
        id: "midnight-dark",
        name: "Midnight Dark",
        description: "A sleek dark box for night owls",
        unlockRequirement: {
            type: "streak",
            value: 7,
            description: "Maintain a 7-day focus streak",
        },
        BoxComponent: PlaceholderBox,
        LidComponent: PlaceholderLid,
        previewColor: "#37474F",
        colorPalette: {
            primary: "#37474F",
            secondary: "#263238",
            accent: "#78909C",
            background: "#ECEFF1",
            surface: "#CFD8DC",
            text: "#263238",
        },
    },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getDesignById(id: string): BentoBoxDesign | undefined {
    return BOX_DESIGNS.find((design) => design.id === id);
}

export function getDefaultDesign(): BentoBoxDesign {
    return BOX_DESIGNS[0];
}

// Check if a design is unlocked based on user stats/awards
export function isDesignUnlocked(
    design: BentoBoxDesign,
    userStats: {
        totalSessions?: number;
        currentStreak?: number;
        longestStreak?: number;
    } | null,
    unlockedAwards: string[]
): boolean {
    // No requirement = always unlocked
    if (!design.unlockRequirement) {
        return true;
    }

    const { type, value } = design.unlockRequirement;

    switch (type) {
        case "sessions":
            return (userStats?.totalSessions ?? 0) >= (value as number);

        case "streak":
            const maxStreak = Math.max(
                userStats?.currentStreak ?? 0,
                userStats?.longestStreak ?? 0
            );
            return maxStreak >= (value as number);

        case "award":
            return unlockedAwards.includes(value as string);

        default:
            return false;
    }
}

// Get all unlocked design IDs for a user
export function getUnlockedDesignIds(
    userStats: {
        totalSessions?: number;
        currentStreak?: number;
        longestStreak?: number;
    } | null,
    unlockedAwards: string[]
): string[] {
    return BOX_DESIGNS.filter((design) =>
        isDesignUnlocked(design, userStats, unlockedAwards)
    ).map((design) => design.id);
}
