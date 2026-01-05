"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTimerContext, TimerResult } from "@/lib/timer-context";
import { AMBIENT_SOUNDS } from "@/lib/sounds";
import { getScoreColor } from "@/lib/focus-score";
import { motion, AnimatePresence } from "framer-motion";
import {
  staggerContainer,
  staggerItem,
  springTransition,
  celebrationBounce,
  modalOverlayVariants,
  modalContentVariants,
  usePrefersReducedMotion
} from "@/lib/motion";
import {
  GripVertical,
  Play,
  Pause,
  X,
  ChevronRight,
  Volume2,
  Check
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createBentoSession } from "@/app/actions/session-actions";
import { saveLocalSession } from "@/lib/local-sessions";
import { SessionType } from "@prisma/client";
import Link from "next/link";
import styles from "./focus-box.module.css";

interface BentoTask {
  id: string;
  name: string;
  durationMinutes: number;
}

type FocusBoxState = "config" | "running" | "intermission" | "completed";

const DEFAULT_TASKS: BentoTask[] = [
  { id: "1", name: "", durationMinutes: 25 },
  { id: "2", name: "", durationMinutes: 15 },
  { id: "3", name: "", durationMinutes: 30 },
];

interface TaskResult extends TimerResult {
  taskName: string;
}

// Animated Counter Hook
function useAnimatedCounter(target: number, duration: number = 800) {
  const [count, setCount] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration, prefersReducedMotion]);

  return count;
}

export default function FocusBoxPage() {
  const [tasks, setTasks] = useState<BentoTask[]>(DEFAULT_TASKS);
  const [focusBoxState, setFocusBoxState] = useState<FocusBoxState>("config");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [soundId, setSoundId] = useState("off");
  const [results, setResults] = useState<TaskResult[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { user } = useAuth();

  // Use ref to track current task index in callbacks
  const currentTaskIndexRef = useRef(currentTaskIndex);
  currentTaskIndexRef.current = currentTaskIndex;

  // Use ref to track tasks in callbacks
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const currentTask = tasks[currentTaskIndex];

  // Use shared timer context
  const timer = useTimerContext();

  // Handle timer completion for Focus Box
  const handleTimerComplete = useCallback((result: TimerResult) => {
    const taskIndex = currentTaskIndexRef.current;
    const currentTasks = tasksRef.current;
    const taskResult: TaskResult = {
      ...result,
      taskName: currentTasks[taskIndex]?.name || `Task ${taskIndex + 1}`,
    };
    setResults((prev) => [...prev, taskResult]);

    if (taskIndex < 2) {
      setFocusBoxState("intermission");
    } else {
      setFocusBoxState("completed");
    }
  }, []);

  // Register onComplete callback when Focus Box session is active
  useEffect(() => {
    if (timer.sessionType === "focusbox" && focusBoxState === "running") {
      timer.setOnComplete(handleTimerComplete);
    }
    return () => {
      if (timer.sessionType === "focusbox") {
        timer.setOnComplete(null);
      }
    };
  }, [handleTimerComplete, timer.sessionType, timer.setOnComplete, focusBoxState]);

  // Update document title when timer is running in Focus Box
  useEffect(() => {
    if (focusBoxState === "running" && (timer.state === "running" || timer.state === "paused")) {
      document.title = `${timer.formattedTime} - ${currentTask?.name || "Focus Box"}`;
    } else if (focusBoxState === "config" || focusBoxState === "completed") {
      document.title = "Bento Focus";
    }

    return () => {
      document.title = "Bento Focus";
    };
  }, [focusBoxState, timer.state, timer.formattedTime, currentTask?.name]);

  // Save bento session when state becomes completed
  useEffect(() => {
    if (focusBoxState === "completed" && results.length === 3) {
      const saveSession = async () => {
        if (user) {
          // Authenticated: save to database
          await createBentoSession({
            userId: user.id,
            tasks: results.map((r) => ({
              taskName: r.taskName,
              durationPlanned: r.durationPlanned,
              durationActual: r.durationActual,
              pauseCount: r.pauseCount,
              focusScore: r.focusScore,
            })),
          });
        } else {
          // Guest: save each task to localStorage
          const bentoSessionId = `bento-${Date.now()}`;
          results.forEach((r, index) => {
            saveLocalSession({
              type: SessionType.BENTO,
              taskName: r.taskName,
              durationPlanned: r.durationPlanned,
              durationActual: r.durationActual,
              pauseCount: r.pauseCount,
              focusScore: r.focusScore,
              completedAt: new Date().toISOString(),
              bentoSessionId,
              bentoTaskIndex: index,
            });
          });
          setShowGuestPrompt(true);
        }
      };
      saveSession();
    }
  }, [focusBoxState, results, user]);

  const updateTask = useCallback((index: number, updates: Partial<BentoTask>) => {
    setTasks((prev) => prev.map((task, i) =>
      i === index ? { ...task, ...updates } : task
    ));
  }, []);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setTasks((prev) => {
      const newTasks = [...prev];
      const draggedTask = newTasks[draggedIndex];
      newTasks.splice(draggedIndex, 1);
      newTasks.splice(index, 0, draggedTask);
      return newTasks;
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const canStartSession = tasks.every(task => task.name.trim().length > 0);

  const startSession = () => {
    if (!canStartSession) return;

    setCurrentTaskIndex(0);
    setResults([]);
    timer.reset();
    timer.updateConfig({
      durationMinutes: tasks[0].durationMinutes,
      taskName: tasks[0].name,
      soundId,
    });
    timer.setSessionType("focusbox");
    setFocusBoxState("running");

    setTimeout(() => {
      timer.start();
    }, 100);
  };

  const continueToNextTask = () => {
    const nextIndex = currentTaskIndex + 1;
    setCurrentTaskIndex(nextIndex);
    timer.reset();
    timer.updateConfig({
      durationMinutes: tasks[nextIndex].durationMinutes,
      taskName: tasks[nextIndex].name,
      soundId,
    });
    setFocusBoxState("running");

    setTimeout(() => {
      timer.start();
    }, 100);
  };

  const endSessionEarly = () => {
    timer.stopEarly();
    setFocusBoxState("completed");
  };

  const resetSession = () => {
    timer.reset();
    setResults([]);
    setCurrentTaskIndex(0);
    setFocusBoxState("config");
  };

  const totalDuration = results.reduce((sum, r) => sum + r.durationActual, 0);
  const avgFocusScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.focusScore, 0) / results.length)
    : 0;

  const animatedAvgScore = useAnimatedCounter(avgFocusScore);
  const animatedDuration = useAnimatedCounter(Math.round(totalDuration / 60));

  // Configuration View
  if (focusBoxState === "config") {
    return (
      <motion.div
        className={styles.page}
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.container}>
          <motion.h1
            className={styles.title}
            initial={prefersReducedMotion ? {} : { y: -20, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Focus Box
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={prefersReducedMotion ? {} : { y: -10, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Set up your 3-task bento session
          </motion.p>

          <motion.div
            className={styles.bentoGrid}
            variants={prefersReducedMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                className={`${styles.taskSlot} ${index === 2 ? styles.fullWidth : ""} ${draggedIndex === index ? styles.dragging : ""}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                variants={prefersReducedMotion ? {} : staggerItem}
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                animate={draggedIndex === index ? { scale: 1.05, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" } : {}}
                layout
                transition={springTransition}
              >
                <div className={styles.dragHandle}>
                  <GripVertical size={18} />
                </div>

                <div className={styles.taskNumber}>Task {index + 1}</div>

                <input
                  type="text"
                  className={styles.taskNameInput}
                  placeholder="What will you work on?"
                  value={task.name}
                  onChange={(e) => updateTask(index, { name: e.target.value })}
                  maxLength={40}
                />

                <div className={styles.durationRow}>
                  <select
                    value={task.durationMinutes}
                    onChange={(e) => updateTask(index, { durationMinutes: Number(e.target.value) })}
                    className={styles.durationSelect}
                  >
                    {[5, 10, 15, 20, 25, 30, 45, 60].map((min) => (
                      <option key={min} value={min}>{min} min</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={styles.soundSection}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Volume2 size={18} />
            <select
              value={soundId}
              onChange={(e) => setSoundId(e.target.value)}
              className={styles.soundSelect}
            >
              {AMBIENT_SOUNDS.map((sound) => (
                <option key={sound.id} value={sound.id}>
                  {sound.icon} {sound.name}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.button
            className={styles.startBtn}
            onClick={startSession}
            disabled={!canStartSession}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : {
              opacity: 1,
              y: 0,
              scale: canStartSession ? [1, 1.02, 1] : 1
            }}
            transition={{
              delay: 0.5,
              scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
          >
            <Play size={20} />
            Start Focus
          </motion.button>

          <AnimatePresence>
            {!canStartSession && (
              <motion.p
                className={styles.errorText}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0 }}
              >
                Please name all 3 tasks to begin
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Running View
  if (focusBoxState === "running") {
    return (
      <motion.div
        className={`${styles.page} ${styles.running}`}
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.runningContainer}>
          <motion.div
            className={styles.progressIndicator}
            initial={prefersReducedMotion ? {} : { y: -20, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
          >
            {tasks.map((_, index) => (
              <motion.div
                key={index}
                className={`${styles.progressDot} ${index < currentTaskIndex ? styles.progressDotDone : ""} ${index === currentTaskIndex ? styles.progressDotActive : ""}`}
                initial={prefersReducedMotion ? {} : { scale: 0 }}
                animate={prefersReducedMotion ? {} : { scale: 1 }}
                transition={{ delay: index * 0.1, ...springTransition }}
              >
                {index < currentTaskIndex ? <Check size={14} /> : index + 1}
              </motion.div>
            ))}
          </motion.div>

          <motion.h2
            className={styles.currentTaskName}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {currentTask.name}
          </motion.h2>
          <motion.p
            className={styles.taskCounter}
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Task {currentTaskIndex + 1} of 3
          </motion.p>

          <motion.div
            className={styles.timerCircleWrapper}
            initial={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, ...springTransition }}
          >
            <svg className={styles.timerRing} viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(197, 201, 164, 0.2)"
                strokeWidth="8"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#C5C9A4"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - timer.progress / 100)}`}
                transform="rotate(-90 100 100)"
                style={{ transition: "stroke-dashoffset 0.1s linear" }}
              />
            </svg>

            <div className={styles.timerCenter}>
              <span className={styles.timeDisplay}>{timer.formattedTime}</span>
            </div>
          </motion.div>

          <AnimatePresence>
            {timer.pauseCount > 0 && (
              <motion.p
                className={styles.pauseCount}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0 }}
              >
                {timer.pauseCount} pause{timer.pauseCount !== 1 ? 's' : ''}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div
            className={styles.controls}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              className={`${styles.controlBtn} ${styles.controlBtnPrimary}`}
              onClick={timer.state === "running" ? timer.pause : timer.resume}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              {timer.state === "running" ? <Pause size={24} /> : <Play size={24} />}
            </motion.button>

            <motion.button
              className={`${styles.controlBtn} ${styles.controlBtnGhost}`}
              onClick={endSessionEarly}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              <X size={20} />
              End Session
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Intermission View
  if (focusBoxState === "intermission") {
    const nextTask = tasks[currentTaskIndex + 1];

    return (
      <motion.div
        className={`${styles.page} ${styles.intermission}`}
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
      >
        <div className={styles.runningContainer}>
          <motion.div
            className={styles.checkCircle}
            variants={prefersReducedMotion ? {} : celebrationBounce}
            initial="hidden"
            animate="visible"
          >
            <Check size={48} />
          </motion.div>

          <motion.h2
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Task Complete!
          </motion.h2>
          <motion.p
            className={styles.lastScore}
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Focus Score: {results[results.length - 1]?.focusScore}%
          </motion.p>

          <motion.div
            className={styles.nextTaskCard}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...springTransition }}
          >
            <span className={styles.label}>Up Next</span>
            <h3>{nextTask.name}</h3>
            <span className={styles.duration}>{nextTask.durationMinutes} minutes</span>
          </motion.div>

          <motion.div
            className={styles.actions}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className={styles.continueBtn}
              onClick={continueToNextTask}
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            >
              Continue
              <ChevronRight size={20} />
            </motion.button>

            <motion.button
              className={styles.endBtn}
              onClick={resetSession}
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            >
              End Session
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Completed View
  return (
    <motion.div
      className={`${styles.page} ${styles.completed}`}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
    >
      <div className={styles.container}>
        <motion.h2
          className={styles.completedTitle}
          variants={prefersReducedMotion ? {} : celebrationBounce}
          initial="hidden"
          animate="visible"
        >
          Session Complete! 🎉
        </motion.h2>

        <motion.div
          className={styles.summaryStats}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className={styles.stat}
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          >
            <span className={styles.statValue}>
              {prefersReducedMotion ? Math.round(totalDuration / 60) : animatedDuration}m
            </span>
            <span className={styles.statLabel}>Total Focus Time</span>
          </motion.div>
          <motion.div
            className={styles.stat}
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          >
            <span
              className={styles.statValue}
              style={{ color: getScoreColor(avgFocusScore) }}
            >
              {prefersReducedMotion ? avgFocusScore : animatedAvgScore}%
            </span>
            <span className={styles.statLabel}>Avg Focus Score</span>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.resultsList}
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {results.map((result, index) => (
            <motion.div
              key={index}
              className={styles.resultCard}
              variants={prefersReducedMotion ? {} : staggerItem}
              whileHover={prefersReducedMotion ? {} : { x: 4 }}
            >
              <div className={styles.resultHeader}>
                <span className={styles.taskName}>{result.taskName}</span>
                <span
                  className={styles.taskScore}
                  style={{ color: getScoreColor(result.focusScore) }}
                >
                  {result.focusScore}%
                </span>
              </div>
              <div className={styles.resultDetails}>
                <span>{Math.round(result.durationActual / 60)} min</span>
                {result.pauseCount > 0 && (
                  <span> • {result.pauseCount} pause{result.pauseCount !== 1 ? 's' : ''}</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          className={styles.newSessionBtn}
          onClick={resetSession}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        >
          New Session
        </motion.button>
      </div>

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
