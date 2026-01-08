/**
 * SFX Player using Web Audio API with HTMLAudioElement fallback
 * 
 * Provides low-latency audio playback with precise control over
 * pitch (playbackRate) and volume (gain).
 */

import { applyJitter } from './sfx-config';

// ============================================
// TYPES
// ============================================

export interface PlayOptions {
    /** Playback rate (1.0 = normal, >1.0 = higher pitch, <1.0 = lower pitch) */
    pitchRate?: number;
    /** Volume (0.0 to 1.0) */
    volume?: number;
    /** Whether to apply micro-pitch jitter */
    applyJitter?: boolean;
}

// ============================================
// SFX PLAYER CLASS
// ============================================

class SfxPlayer {
    private audioContext: AudioContext | null = null;
    private bufferCache: Map<string, AudioBuffer> = new Map();
    private loadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map();
    private failedUrls: Set<string> = new Set(); // Track URLs that failed Web Audio decoding

    /**
     * Initialize AudioContext lazily (must be called after user interaction).
     * Returns true if successful, false if Web Audio API is not supported.
     */
    private initAudioContext(): boolean {
        if (this.audioContext) {
            // Resume if suspended (browser autoplay policy)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().catch(() => {
                    console.warn('[SfxPlayer] Failed to resume AudioContext');
                });
            }
            return true;
        }

        try {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (!AudioContextClass) {
                console.warn('[SfxPlayer] Web Audio API not supported');
                return false;
            }
            this.audioContext = new AudioContextClass();
            return true;
        } catch (error) {
            console.warn('[SfxPlayer] Failed to create AudioContext:', error);
            return false;
        }
    }

    /**
     * Preload an audio file into the buffer cache.
     * Returns the AudioBuffer or null if loading fails.
     */
    async preload(url: string): Promise<AudioBuffer | null> {
        // If this URL failed before, skip Web Audio and just return null
        // (we'll use HTMLAudioElement fallback during play)
        if (this.failedUrls.has(url)) {
            return null;
        }

        // Check cache first
        if (this.bufferCache.has(url)) {
            return this.bufferCache.get(url)!;
        }

        // Check if already loading
        if (this.loadingPromises.has(url)) {
            return this.loadingPromises.get(url)!;
        }

        // Start loading
        const loadPromise = this.loadAudioBuffer(url);
        this.loadingPromises.set(url, loadPromise);

        const buffer = await loadPromise;
        this.loadingPromises.delete(url);

        if (buffer) {
            this.bufferCache.set(url, buffer);
        } else {
            // Mark as failed so we use fallback
            this.failedUrls.add(url);
        }

        return buffer;
    }

    /**
     * Load an audio file and decode it into an AudioBuffer.
     */
    private async loadAudioBuffer(url: string): Promise<AudioBuffer | null> {
        if (!this.initAudioContext() || !this.audioContext) {
            return null;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`[SfxPlayer] Failed to fetch audio: ${url} (${response.status})`);
                return null;
            }

            const arrayBuffer = await response.arrayBuffer();

            // decodeAudioData may consume the buffer, so we clone it
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer.slice(0));
            console.log(`[SfxPlayer] Successfully decoded with Web Audio API: ${url}`);
            return audioBuffer;
        } catch (error) {
            console.warn(`[SfxPlayer] Web Audio API decode failed for: ${url}`, error);
            console.log(`[SfxPlayer] Will use HTMLAudioElement fallback for playback`);
            return null;
        }
    }

    /**
     * Play an audio file with optional pitch and volume adjustments.
     * Uses Web Audio API if available, falls back to HTMLAudioElement.
     */
    async play(url: string, options: PlayOptions = {}): Promise<void> {
        // Calculate final pitch rate with jitter
        let pitchRate = options.pitchRate ?? 1.0;
        if (options.applyJitter !== false) {
            pitchRate = applyJitter(pitchRate);
        }
        const volume = options.volume ?? 1.0;

        // Try Web Audio API first
        const buffer = this.bufferCache.get(url);
        if (buffer && this.audioContext) {
            try {
                const source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                source.playbackRate.value = pitchRate;

                const gainNode = this.audioContext.createGain();
                gainNode.gain.value = volume;

                source.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                source.start(0);

                console.log(`[SfxPlayer] Playing via Web Audio API: ${url}`);
                return;
            } catch (error) {
                console.warn('[SfxPlayer] Web Audio playback failed, using fallback:', error);
            }
        }

        // Fallback: Use HTMLAudioElement
        this.playWithAudioElement(url, pitchRate, volume);
    }

    /**
     * Play audio using HTMLAudioElement with playbackRate and volume.
     * This is a fallback when Web Audio API decoding fails.
     */
    private playWithAudioElement(url: string, pitchRate: number, volume: number): void {
        try {
            const audio = new Audio(url);
            audio.playbackRate = pitchRate;
            audio.volume = volume;

            audio.play()
                .then(() => {
                    console.log(`[SfxPlayer] Playing via HTMLAudioElement fallback: ${url}`);
                })
                .catch((err) => {
                    console.warn(`[SfxPlayer] HTMLAudioElement play failed: ${url}`, err);
                });
        } catch (error) {
            console.warn(`[SfxPlayer] Failed to create Audio element: ${url}`, error);
        }
    }

    /**
     * Check if a URL is already cached.
     */
    isCached(url: string): boolean {
        return this.bufferCache.has(url);
    }

    /**
     * Clear the buffer cache.
     */
    clearCache(): void {
        this.bufferCache.clear();
        this.failedUrls.clear();
    }

    /**
     * Check if Web Audio API is supported.
     */
    isSupported(): boolean {
        return !!(window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    }
}

// ============================================
// SINGLETON INSTANCE
// Only create in browser environment
// ============================================

export const sfxPlayer = typeof window !== 'undefined' ? new SfxPlayer() : null;

// ============================================
// CONVENIENCE FUNCTION
// ============================================

/**
 * Play an SFX with velocity-based pitch and volume adjustments.
 */
export async function playSfx(
    url: string,
    velocityPitchRate: number,
    velocityVolume: number
): Promise<void> {
    if (!sfxPlayer) return;

    await sfxPlayer.play(url, {
        pitchRate: velocityPitchRate,
        volume: velocityVolume,
        applyJitter: true,
    });
}
