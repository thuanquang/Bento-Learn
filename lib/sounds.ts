/**
 * Ambient Sounds for Focus Sessions
 */

export interface AmbientSound {
    id: string;
    name: string;
    file: string | null;
    icon: string;
}

export const AMBIENT_SOUNDS: AmbientSound[] = [
    { id: 'off', name: 'Off', file: null, icon: '🔇' },
    { id: 'rain', name: 'Rain', file: '/sounds/rain.mp3', icon: '🌧️' },
    { id: 'forest', name: 'Forest', file: '/sounds/forest.mp3', icon: '🌲' },
    { id: 'ocean', name: 'Ocean Waves', file: '/sounds/ocean.mp3', icon: '🌊' },
    { id: 'lofi', name: 'Lo-fi Beats', file: '/sounds/lofi.mp3', icon: '🎵' },
    { id: 'whitenoise', name: 'White Noise', file: '/sounds/whitenoise.mp3', icon: '📻' },
    { id: 'fireplace', name: 'Fireplace', file: '/sounds/fireplace.mp3', icon: '🔥' },
];

export function getSoundById(id: string): AmbientSound | undefined {
    return AMBIENT_SOUNDS.find(sound => sound.id === id);
}

/**
 * Audio player singleton for ambient sounds
 */
class AmbientAudioPlayer {
    private audio: HTMLAudioElement | null = null;
    private currentSoundId: string = 'off';

    play(soundId: string, volume: number = 0.5): void {
        const sound = getSoundById(soundId);

        if (!sound || !sound.file) {
            this.stop();
            return;
        }

        // If same sound, just adjust volume
        if (this.currentSoundId === soundId && this.audio) {
            this.audio.volume = volume;
            if (this.audio.paused) {
                this.audio.play().catch(() => { });
            }
            return;
        }

        // Stop current sound
        this.stop();

        // Create new audio
        this.audio = new Audio(sound.file);
        this.audio.loop = true;
        this.audio.volume = volume;
        this.currentSoundId = soundId;

        this.audio.play().catch((error) => {
            console.warn('Failed to play audio:', error);
        });
    }

    pause(): void {
        if (this.audio && !this.audio.paused) {
            this.audio.pause();
        }
    }

    resume(): void {
        if (this.audio && this.audio.paused && this.currentSoundId !== 'off') {
            this.audio.play().catch(() => { });
        }
    }

    stop(): void {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
            this.audio = null;
        }
        this.currentSoundId = 'off';
    }

    setVolume(volume: number): void {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    }

    getCurrentSoundId(): string {
        return this.currentSoundId;
    }

    isPlaying(): boolean {
        return this.audio !== null && !this.audio.paused;
    }
}

// Singleton instance - only create in browser
export const ambientPlayer = typeof window !== 'undefined'
    ? new AmbientAudioPlayer()
    : null;
