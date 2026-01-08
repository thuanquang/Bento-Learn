"use client";

/**
 * Hook for playing navigation SFX with velocity-based adjustments.
 * 
 * Integrates with the current box theme to get SFX paths and timing,
 * and with the navigation context to get dwell time for velocity calculations.
 */

import { useCallback, useEffect, useRef } from "react";
import { useBoxTheme } from "./box-theme-context";
import { sfxPlayer } from "./sfx-player";
import { getVelocityCategory, getPitchRate, getVolume, type VelocityCategory } from "./sfx-config";

// ============================================
// TYPES
// ============================================

export interface SfxPlayerHook {
    /** Play the opening SFX with velocity adjustments */
    playOpenSfx: (dwellTimeMs: number) => void;
    /** Play the closing SFX with velocity adjustments */
    playCloseSfx: (dwellTimeMs: number) => void;
    /** Check if SFX is configured for the current theme */
    hasSfx: boolean;
    /** Get the SFX timing configuration for the current theme */
    sfxTiming: {
        openTrigger: 'start' | 'end';
        closeTrigger: 'start' | 'end';
    };
}

// Default timing configuration
const DEFAULT_SFX_TIMING = {
    openTrigger: 'start' as const,
    closeTrigger: 'end' as const,
};

// ============================================
// HOOK
// ============================================

export function useSfxPlayer(): SfxPlayerHook {
    const { selectedDesign } = useBoxTheme();
    const preloadedRef = useRef<boolean>(false);

    // Get SFX configuration from current theme
    const sfxPaths = selectedDesign.sfxPaths;
    const sfxTiming = selectedDesign.sfxTiming ?? DEFAULT_SFX_TIMING;
    const hasSfx = !!sfxPaths;

    // Preload audio buffers when theme changes
    useEffect(() => {
        if (!sfxPlayer || !sfxPaths) {
            preloadedRef.current = false;
            return;
        }

        // Capture player reference for async usage
        const player = sfxPlayer;

        // Reset preloaded state on theme change
        preloadedRef.current = false;

        const preloadSfx = async () => {
            try {
                await Promise.all([
                    player.preload(sfxPaths.open),
                    player.preload(sfxPaths.close),
                ]);
                preloadedRef.current = true;
                console.log('[SFX] Preloaded SFX for theme:', selectedDesign.id);
            } catch (error) {
                console.warn('[SFX] Failed to preload SFX:', error);
            }
        };

        preloadSfx();
    }, [sfxPaths, selectedDesign.id]);

    // Play opening SFX
    const playOpenSfx = useCallback((dwellTimeMs: number) => {
        if (!sfxPlayer || !sfxPaths) return;

        const category = getVelocityCategory(dwellTimeMs);
        const pitchRate = getPitchRate(category);
        const volume = getVolume(category);

        console.log('[SFX] Playing open SFX:', {
            category,
            pitchRate,
            volume,
            dwellTimeMs,
        });

        sfxPlayer.play(sfxPaths.open, {
            pitchRate,
            volume,
            applyJitter: true,
        });
    }, [sfxPaths]);

    // Play closing SFX
    const playCloseSfx = useCallback((dwellTimeMs: number) => {
        if (!sfxPlayer || !sfxPaths) return;

        const category = getVelocityCategory(dwellTimeMs);
        const pitchRate = getPitchRate(category);
        const volume = getVolume(category);

        console.log('[SFX] Playing close SFX:', {
            category,
            pitchRate,
            volume,
            dwellTimeMs,
        });

        sfxPlayer.play(sfxPaths.close, {
            pitchRate,
            volume,
            applyJitter: true,
        });
    }, [sfxPaths]);

    return {
        playOpenSfx,
        playCloseSfx,
        hasSfx,
        sfxTiming,
    };
}
