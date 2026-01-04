/**
 * Focus Score Calculation
 * 
 * Calculates a focus score (0-100) based on:
 * - Pause count (escalating penalty)
 * - Early stop penalty (if session was interrupted)
 */

export interface FocusScoreInput {
    durationPlanned: number;  // in seconds
    durationActual: number;   // in seconds
    pauseCount: number;
    wasInterrupted: boolean;  // stopped before completion
}

export function calculateFocusScore({
    durationPlanned,
    durationActual,
    pauseCount,
    wasInterrupted,
}: FocusScoreInput): number {
    let score = 100;

    // Escalating pause penalty: -10, -15, -20, -25...
    for (let i = 0; i < pauseCount; i++) {
        score -= 10 + (i * 5);
    }

    // Early stop penalty
    if (wasInterrupted && durationPlanned > 0) {
        const completionRatio = durationActual / durationPlanned;
        if (completionRatio < 0.5) {
            score -= 20;
        } else if (completionRatio < 0.75) {
            score -= 10;
        }
    }

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, score));
}

/**
 * Get the color class for a focus score
 */
export function getScoreColorClass(score: number): string {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
}

/**
 * Get the background color class for a focus score
 */
export function getScoreBgClass(score: number): string {
    if (score >= 80) return 'score-bg-high';
    if (score >= 50) return 'score-bg-medium';
    return 'score-bg-low';
}

/**
 * Get the hex color for a focus score
 */
export function getScoreColor(score: number): string {
    if (score >= 80) return '#C5C9A4'; // sage
    if (score >= 50) return '#D4A27C'; // peach
    return '#7A6052'; // brown
}
