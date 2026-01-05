"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { calculateFocusScore } from "./focus-score";
import { ambientPlayer } from "./sounds";

export type TimerState = "idle" | "running" | "paused" | "completed";

export interface TimerConfig {
    durationMinutes: number;
    taskName: string;
    soundId: string;
}

export interface TimerResult {
    durationPlanned: number;
    durationActual: number;
    pauseCount: number;
    focusScore: number;
    wasInterrupted: boolean;
}

interface TimerContextValue {
    // Config
    config: TimerConfig;
    updateConfig: (updates: Partial<TimerConfig>) => void;

    // State
    state: TimerState;
    timeRemaining: number;
    formattedTime: string;
    progress: number;
    pauseCount: number;
    result: TimerResult | null;

    // Actions
    start: () => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
    stopEarly: () => void;

    // Session tracking
    sessionType: "timer" | "focusbox" | null;
    setSessionType: (type: "timer" | "focusbox" | null) => void;

    // Callbacks
    setOnComplete: (callback: ((result: TimerResult) => void) | null) => void;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function useTimerContext(): TimerContextValue {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error("useTimerContext must be used within a TimerProvider");
    }
    return context;
}

interface TimerProviderProps {
    children: ReactNode;
}

export function TimerProvider({ children }: TimerProviderProps) {
    // Configuration
    const [config, setConfig] = useState<TimerConfig>({
        durationMinutes: 25,
        taskName: "Focus Session",
        soundId: "off",
    });

    // State
    const [state, setState] = useState<TimerState>("idle");
    const [timeRemaining, setTimeRemaining] = useState(config.durationMinutes * 60);
    const [pauseCount, setPauseCount] = useState(0);
    const [result, setResult] = useState<TimerResult | null>(null);
    const [sessionType, setSessionType] = useState<"timer" | "focusbox" | null>(null);

    // Refs for accurate timing
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const elapsedBeforePauseRef = useRef<number>(0);
    const onCompleteRef = useRef<((result: TimerResult) => void) | null>(null);

    const durationPlanned = config.durationMinutes * 60;

    // Update time remaining when config changes in idle state
    useEffect(() => {
        if (state === "idle") {
            setTimeRemaining(config.durationMinutes * 60);
        }
    }, [config.durationMinutes, state]);

    // Cleanup on unmount (provider level - rare)
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const setOnComplete = useCallback((callback: ((result: TimerResult) => void) | null) => {
        onCompleteRef.current = callback;
    }, []);

    const startTimer = useCallback(() => {
        if (state !== "idle" && state !== "paused") return;

        if (state === "idle") {
            // Fresh start
            startTimeRef.current = Date.now();
            elapsedBeforePauseRef.current = 0;
            setPauseCount(0);
            setResult(null);
        } else {
            // Resuming from pause
            startTimeRef.current = Date.now();
        }

        setState("running");

        // Start ambient sound
        if (config.soundId !== "off") {
            ambientPlayer?.play(config.soundId);
        }

        // Start countdown
        intervalRef.current = setInterval(() => {
            const elapsed = elapsedBeforePauseRef.current +
                Math.floor((Date.now() - startTimeRef.current) / 1000);
            const remaining = Math.max(0, durationPlanned - elapsed);

            setTimeRemaining(remaining);

            if (remaining <= 0) {
                // Timer completed
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                ambientPlayer?.stop();

                const timerResult: TimerResult = {
                    durationPlanned,
                    durationActual: durationPlanned,
                    pauseCount: 0, // Will be set from current state
                    focusScore: 0, // Will be calculated
                    wasInterrupted: false,
                };

                setState("completed");

                // Calculate final result with current pause count
                setPauseCount((currentPauseCount) => {
                    const finalResult = {
                        ...timerResult,
                        pauseCount: currentPauseCount,
                        focusScore: calculateFocusScore({
                            durationPlanned,
                            durationActual: durationPlanned,
                            pauseCount: currentPauseCount,
                            wasInterrupted: false,
                        }),
                    };
                    setResult(finalResult);
                    onCompleteRef.current?.(finalResult);
                    return currentPauseCount;
                });
            }
        }, 100);
    }, [state, config.soundId, durationPlanned]);

    const pauseTimer = useCallback(() => {
        if (state !== "running") return;

        // Store elapsed time
        elapsedBeforePauseRef.current += Math.floor((Date.now() - startTimeRef.current) / 1000);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        ambientPlayer?.pause();
        setState("paused");
        setPauseCount((prev) => prev + 1);
    }, [state]);

    const resumeTimer = useCallback(() => {
        if (state !== "paused") return;
        startTimer();
    }, [state, startTimer]);

    const resetTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        ambientPlayer?.stop();
        setState("idle");
        setTimeRemaining(config.durationMinutes * 60);
        setPauseCount(0);
        elapsedBeforePauseRef.current = 0;
        setResult(null);
        setSessionType(null);
    }, [config.durationMinutes]);

    const stopEarly = useCallback(() => {
        if (state !== "running" && state !== "paused") return;

        const elapsed = state === "running"
            ? elapsedBeforePauseRef.current + Math.floor((Date.now() - startTimeRef.current) / 1000)
            : elapsedBeforePauseRef.current;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        ambientPlayer?.stop();

        const timerResult: TimerResult = {
            durationPlanned,
            durationActual: elapsed,
            pauseCount,
            focusScore: calculateFocusScore({
                durationPlanned,
                durationActual: elapsed,
                pauseCount,
                wasInterrupted: true,
            }),
            wasInterrupted: true,
        };

        setResult(timerResult);
        setState("completed");
        onCompleteRef.current?.(timerResult);
    }, [state, durationPlanned, pauseCount]);

    const updateConfig = useCallback((updates: Partial<TimerConfig>) => {
        if (state !== "idle") return;
        setConfig((prev) => ({ ...prev, ...updates }));
    }, [state]);

    // Format time as MM:SS
    const formatTime = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }, []);

    // Progress as percentage (0-100)
    const progress = durationPlanned > 0
        ? ((durationPlanned - timeRemaining) / durationPlanned) * 100
        : 0;

    const value: TimerContextValue = {
        // Config
        config,
        updateConfig,

        // State
        state,
        timeRemaining,
        formattedTime: formatTime(timeRemaining),
        progress,
        pauseCount,
        result,

        // Actions
        start: startTimer,
        pause: pauseTimer,
        resume: resumeTimer,
        reset: resetTimer,
        stopEarly,

        // Session tracking
        sessionType,
        setSessionType,

        // Callbacks
        setOnComplete,
    };

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
}
