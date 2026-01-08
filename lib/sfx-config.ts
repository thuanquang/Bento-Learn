/**
 * SFX Configuration Constants
 * 
 * Adjust these values to fine-tune the navigation sound effects behavior.
 * All timing values are in milliseconds.
 */

export const SFX_CONFIG = {
    // ============================================
    // VELOCITY THRESHOLDS
    // Determine which SFX variant plays based on page dwell time
    // ============================================

    /**
     * If the user spent less than this time on a page, use "quick" SFX.
     * Quick SFX are lighter, higher-pitched, and quieter.
     */
    VELOCITY_QUICK_THRESHOLD_MS: 5000,   // 5 seconds

    /**
     * If the user spent more than this time on a page, use "deep" SFX.
     * Deep SFX are weightier, lower-pitched, signaling substantial content consumption.
     */
    VELOCITY_DEEP_THRESHOLD_MS: 30000,   // 30 seconds

    // ============================================
    // PITCH MODIFIERS (playbackRate)
    // Values > 1.0 = higher pitch, < 1.0 = lower pitch
    // ============================================

    /**
     * Playback rate for quick navigation SFX.
     * Higher value = faster/higher pitched sound.
     */
    PITCH_QUICK_RATE: 1.3,

    /**
     * Playback rate for normal navigation SFX.
     */
    PITCH_NORMAL_RATE: 1.0,

    /**
     * Playback rate for deep dive SFX.
     * Lower value = slower/deeper sound.
     */
    PITCH_DEEP_RATE: 0.75,

    // ============================================
    // VOLUME MODIFIERS (gain)
    // Values between 0.0 and 1.0
    // ============================================

    /**
     * Volume for quick navigation SFX.
     * Quieter to feel "light" and non-intrusive.
     */
    VOLUME_QUICK: 0.7,

    /**
     * Volume for normal and deep navigation SFX.
     */
    VOLUME_NORMAL: 1.0,

    // ============================================
    // MICRO-PITCH JITTER
    // Random variation applied to every playback for natural feel
    // ============================================

    /**
     * Minimum jitter multiplier (e.g., 0.95 = -5% pitch).
     */
    JITTER_MIN: 0.95,

    /**
     * Maximum jitter multiplier (e.g., 1.05 = +5% pitch).
     */
    JITTER_MAX: 1.05,
} as const;

// ============================================
// VELOCITY CATEGORY TYPE
// ============================================

export type VelocityCategory = 'quick' | 'normal' | 'deep';

/**
 * Determine velocity category based on dwell time in milliseconds.
 */
export function getVelocityCategory(dwellTimeMs: number): VelocityCategory {
    if (dwellTimeMs < SFX_CONFIG.VELOCITY_QUICK_THRESHOLD_MS) {
        return 'quick';
    }
    if (dwellTimeMs > SFX_CONFIG.VELOCITY_DEEP_THRESHOLD_MS) {
        return 'deep';
    }
    return 'normal';
}

/**
 * Get pitch rate for a given velocity category.
 */
export function getPitchRate(category: VelocityCategory): number {
    switch (category) {
        case 'quick':
            return SFX_CONFIG.PITCH_QUICK_RATE;
        case 'deep':
            return SFX_CONFIG.PITCH_DEEP_RATE;
        default:
            return SFX_CONFIG.PITCH_NORMAL_RATE;
    }
}

/**
 * Get volume for a given velocity category.
 */
export function getVolume(category: VelocityCategory): number {
    switch (category) {
        case 'quick':
            return SFX_CONFIG.VOLUME_QUICK;
        default:
            return SFX_CONFIG.VOLUME_NORMAL;
    }
}

/**
 * Apply micro-pitch jitter to a base rate.
 * Returns a value between baseRate * JITTER_MIN and baseRate * JITTER_MAX.
 */
export function applyJitter(baseRate: number): number {
    const jitterRange = SFX_CONFIG.JITTER_MAX - SFX_CONFIG.JITTER_MIN;
    const jitter = SFX_CONFIG.JITTER_MIN + Math.random() * jitterRange;
    return baseRate * jitter;
}
