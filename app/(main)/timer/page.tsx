"use client";

import { useTimerContext } from "@/lib/timer-context";
import { AMBIENT_SOUNDS } from "@/lib/sounds";
import { getScoreColor } from "@/lib/focus-score";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  springTransition,
  modalOverlayVariants,
  modalContentVariants,
  celebrationBounce,
  usePrefersReducedMotion
} from "@/lib/motion";
import { useAuth } from "@/lib/auth-context";
import { createSession } from "@/app/actions/session-actions";
import { saveLocalSession } from "@/lib/local-sessions";
import { SessionType } from "@prisma/client";
import Link from "next/link";
import styles from "./timer.module.css";

const DURATION_PRESETS = [15, 25, 45, 60];

export default function TimerPage() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { user } = useAuth();

  // Use shared timer context instead of local hook
  const timer = useTimerContext();

  // Set up onComplete callback for this page
  const handleComplete = useCallback(async (result: typeof timer.result) => {
    if (!result) return;
    const taskName = timer.config.taskName;
    if (user) {
      // Authenticated: save to database
      await createSession({
        userId: user.id,
        type: SessionType.TIMER,
        taskName,
        durationPlanned: result.durationPlanned,
        durationActual: result.durationActual,
        pauseCount: result.pauseCount,
        focusScore: result.focusScore,
      });
    } else {
      // Guest: save to localStorage
      saveLocalSession({
        type: SessionType.TIMER,
        taskName,
        durationPlanned: result.durationPlanned,
        durationActual: result.durationActual,
        pauseCount: result.pauseCount,
        focusScore: result.focusScore,
        completedAt: new Date().toISOString(),
      });
      setShowGuestPrompt(true);
    }
  }, [timer.config.taskName, user]);

  // Register onComplete callback when this page is active and session is timer type
  useEffect(() => {
    if (timer.sessionType === "timer" || timer.sessionType === null) {
      timer.setOnComplete(handleComplete);
    }
    return () => {
      // Clear callback when unmounting if we set it
      if (timer.sessionType === "timer") {
        timer.setOnComplete(null);
      }
    };
  }, [handleComplete, timer.sessionType, timer.setOnComplete]);

  // Update document title when timer is running or paused
  useEffect(() => {
    if (timer.state === "running" || timer.state === "paused") {
      document.title = `${timer.formattedTime} - ${timer.config.taskName}`;
    } else {
      document.title = "Bento Focus";
    }

    // Cleanup: reset title when leaving
    return () => {
      document.title = "Bento Focus";
    };
  }, [timer.state, timer.config.taskName, timer.formattedTime]);

  const handleReset = () => {
    if (timer.state === "running" || timer.state === "paused") {
      setShowResetConfirm(true);
    } else {
      timer.reset();
    }
  };

  const confirmReset = () => {
    timer.reset();
    setShowResetConfirm(false);
  };

  // Handle "New Session" - reset timer and clear task name for fresh input
  const handleNewSession = () => {
    timer.reset();
    // Reset task name to default for fresh input
    timer.updateConfig({ taskName: "Focus Session" });
  };

  const handleMainButton = () => {
    if (timer.state === "idle") {
      timer.setSessionType("timer");
      timer.start();
    } else if (timer.state === "running") {
      timer.pause();
    } else if (timer.state === "paused") {
      timer.resume();
    } else if (timer.state === "completed") {
      handleNewSession();
    }
  };

  const getMainButtonText = () => {
    switch (timer.state) {
      case "idle": return "Start Focus";
      case "running": return "Pause";
      case "paused": return "Resume";
      case "completed": return "New Session";
      default: return "Start";
    }
  };

  const getMainButtonIcon = () => {
    switch (timer.state) {
      case "idle": return <Play size={20} />;
      case "running": return <Pause size={20} />;
      case "paused": return <Play size={20} />;
      case "completed": return <RotateCcw size={20} />;
      default: return <Play size={20} />;
    }
  };

  return (
    <motion.div
      className={styles.timerPage}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.timerContainer}>
        {/* Task Name Input */}
        <motion.div
          className={styles.taskNameSection}
          initial={prefersReducedMotion ? {} : { y: -20, opacity: 0 }}
          animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {timer.state === "idle" ? (
              <motion.input
                key="input"
                type="text"
                className={styles.taskInput}
                value={timer.config.taskName}
                onChange={(e) => timer.updateConfig({ taskName: e.target.value })}
                placeholder="What are you working on?"
                maxLength={50}
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={prefersReducedMotion ? {} : { opacity: 1 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
              />
            ) : (
              <motion.h2
                key="display"
                className={styles.taskDisplay}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0 }}
              >
                {timer.config.taskName}
              </motion.h2>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Timer Display */}
        <motion.div
          className={styles.timerCircleWrapper}
          initial={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
          animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, ...springTransition }}
        >
          <svg className={styles.timerRing} viewBox="0 0 200 200">
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(197, 201, 164, 0.2)"
              strokeWidth="8"
            />
            {/* Progress ring */}
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={timer.state === "completed" && timer.result
                ? getScoreColor(timer.result.focusScore)
                : "#C5C9A4"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - timer.progress / 100)}`}
              transform="rotate(-90 100 100)"
              style={{ transition: "stroke-dashoffset 0.1s linear" }}
              animate={timer.state === "running" && !prefersReducedMotion ? {
                filter: ["drop-shadow(0 0 4px rgba(197, 201, 164, 0.3))", "drop-shadow(0 0 8px rgba(197, 201, 164, 0.5))", "drop-shadow(0 0 4px rgba(197, 201, 164, 0.3))"]
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </svg>

          <div className={styles.timerCenter}>
            <AnimatePresence mode="wait">
              {timer.state === "completed" && timer.result ? (
                <motion.div
                  key="completion"
                  className={styles.completionDisplay}
                  variants={prefersReducedMotion ? {} : celebrationBounce}
                  initial="hidden"
                  animate="visible"
                >
                  <span className={styles.scoreLabel}>Focus Score</span>
                  <motion.span
                    className={styles.scoreValue}
                    style={{ color: getScoreColor(timer.result.focusScore) }}
                    initial={prefersReducedMotion ? {} : { scale: 0 }}
                    animate={prefersReducedMotion ? {} : { scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {timer.result.focusScore}%
                  </motion.span>
                </motion.div>
              ) : (
                <motion.span
                  key="time"
                  className={styles.timeDisplay}
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                >
                  {timer.formattedTime}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Pause Count Indicator */}
        <AnimatePresence>
          {timer.pauseCount > 0 && timer.state !== "completed" && (
            <motion.div
              className={styles.pauseIndicator}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
            >
              {timer.pauseCount} pause{timer.pauseCount !== 1 ? 's' : ''}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Duration Selector (only in idle state) */}
        <AnimatePresence>
          {timer.state === "idle" && (
            <motion.div
              className={styles.durationSection}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: 20, scale: 0.95 }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.durationPresets}>
                {DURATION_PRESETS.map((duration, i) => (
                  <motion.button
                    key={duration}
                    className={`${styles.durationBtn} ${timer.config.durationMinutes === duration ? styles.durationBtnActive : ""}`}
                    onClick={() => timer.updateConfig({ durationMinutes: duration })}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    {duration}m
                  </motion.button>
                ))}
              </div>

              <motion.div
                className={styles.customDuration}
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={prefersReducedMotion ? {} : { opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <input
                  type="number"
                  className={styles.durationInput}
                  value={timer.config.durationMinutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= 120) {
                      timer.updateConfig({ durationMinutes: val });
                    }
                  }}
                  min={1}
                  max={120}
                />
                <span className={styles.durationSuffix}>min</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sound Selector */}
        <AnimatePresence>
          {(timer.state === "idle" || timer.state === "running") && (
            <motion.div
              className={styles.soundSection}
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={prefersReducedMotion ? {} : { opacity: 1 }}
              exit={prefersReducedMotion ? {} : { opacity: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Volume2 size={18} className={styles.soundIcon} />
              <select
                className={styles.soundSelect}
                value={timer.config.soundId}
                onChange={(e) => timer.updateConfig({ soundId: e.target.value })}
              >
                {AMBIENT_SOUNDS.map((sound) => (
                  <option key={sound.id} value={sound.id}>
                    {sound.icon} {sound.name}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <motion.div
          className={styles.controls}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className={styles.mainBtn}
            onClick={handleMainButton}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            transition={springTransition}
          >
            {getMainButtonIcon()}
            {getMainButtonText()}
          </motion.button>

          <AnimatePresence>
            {(timer.state === "running" || timer.state === "paused") && (
              <motion.button
                className={styles.resetBtn}
                onClick={handleReset}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                transition={springTransition}
              >
                <RotateCcw size={18} />
                Reset
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            className={styles.modalOverlay}
            onClick={() => setShowResetConfirm(false)}
            variants={prefersReducedMotion ? {} : modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              variants={prefersReducedMotion ? {} : modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h3>Reset Timer?</h3>
              <p>Your current session will be lost.</p>
              <div className={styles.modalActions}>
                <motion.button
                  className={styles.btnGhost}
                  onClick={() => setShowResetConfirm(false)}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className={styles.btnAccent}
                  onClick={confirmReset}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                >
                  Reset
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest Sign-in Prompt Modal */}
      <AnimatePresence>
        {showGuestPrompt && (
          <motion.div
            className={styles.modalOverlay}
            onClick={() => setShowGuestPrompt(false)}
            variants={prefersReducedMotion ? {} : modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              variants={prefersReducedMotion ? {} : modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h3>Session Saved Locally!</h3>
              <p>Sign in to save your progress permanently and view analytics.</p>
              <div className={styles.modalActions}>
                <motion.button
                  className={styles.btnGhost}
                  onClick={() => setShowGuestPrompt(false)}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                >
                  Maybe Later
                </motion.button>
                <Link href="/auth/login" className={styles.btnAccent}>
                  Sign In
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
