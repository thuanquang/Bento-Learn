"use client";

import { useState, useCallback } from "react";
import { useTimer, TimerResult } from "@/lib/use-timer";
import { AMBIENT_SOUNDS } from "@/lib/sounds";
import { getScoreColor } from "@/lib/focus-score";
import {
  GripVertical,
  Play,
  Pause,
  X,
  ChevronRight,
  Volume2,
  Check
} from "lucide-react";
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

export default function FocusBoxPage() {
  const [tasks, setTasks] = useState<BentoTask[]>(DEFAULT_TASKS);
  const [state, setState] = useState<FocusBoxState>("config");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [soundId, setSoundId] = useState("off");
  const [results, setResults] = useState<TaskResult[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const currentTask = tasks[currentTaskIndex];

  const timer = useTimer({
    onComplete: (result) => {
      const taskResult: TaskResult = {
        ...result,
        taskName: currentTask?.name || `Task ${currentTaskIndex + 1}`,
      };
      setResults((prev) => [...prev, taskResult]);

      if (currentTaskIndex < 2) {
        setState("intermission");
      } else {
        setState("completed");
      }
    },
  });

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
    timer.updateConfig({
      durationMinutes: tasks[0].durationMinutes,
      taskName: tasks[0].name,
      soundId,
    });
    setState("running");

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
    setState("running");

    setTimeout(() => {
      timer.start();
    }, 100);
  };

  const endSessionEarly = () => {
    timer.stopEarly();
    setState("completed");
  };

  const resetSession = () => {
    timer.reset();
    setResults([]);
    setCurrentTaskIndex(0);
    setState("config");
  };

  const totalDuration = results.reduce((sum, r) => sum + r.durationActual, 0);
  const avgFocusScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.focusScore, 0) / results.length)
    : 0;

  // Configuration View
  if (state === "config") {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Focus Box</h1>
          <p className={styles.subtitle}>Set up your 3-task bento session</p>

          <div className={styles.bentoGrid}>
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className={`${styles.taskSlot} ${index === 2 ? styles.fullWidth : ""}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
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
              </div>
            ))}
          </div>

          <div className={styles.soundSection}>
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
          </div>

          <button
            className={styles.startBtn}
            onClick={startSession}
            disabled={!canStartSession}
          >
            <Play size={20} />
            Start Focus
          </button>

          {!canStartSession && (
            <p className={styles.errorText}>Please name all 3 tasks to begin</p>
          )}
        </div>
      </div>
    );
  }

  // Running View
  if (state === "running") {
    return (
      <div className={`${styles.page} ${styles.running}`}>
        <div className={styles.runningContainer}>
          <div className={styles.progressIndicator}>
            {tasks.map((_, index) => (
              <div
                key={index}
                className={`${styles.progressDot} ${index < currentTaskIndex ? styles.progressDotDone : ""} ${index === currentTaskIndex ? styles.progressDotActive : ""}`}
              >
                {index < currentTaskIndex ? <Check size={14} /> : index + 1}
              </div>
            ))}
          </div>

          <h2 className={styles.currentTaskName}>{currentTask.name}</h2>
          <p className={styles.taskCounter}>Task {currentTaskIndex + 1} of 3</p>

          <div className={styles.timerCircleWrapper}>
            <svg className={styles.timerRing} viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(197, 201, 164, 0.2)"
                strokeWidth="8"
              />
              <circle
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
          </div>

          {timer.pauseCount > 0 && (
            <p className={styles.pauseCount}>{timer.pauseCount} pause{timer.pauseCount !== 1 ? 's' : ''}</p>
          )}

          <div className={styles.controls}>
            <button
              className={`${styles.controlBtn} ${styles.controlBtnPrimary}`}
              onClick={timer.state === "running" ? timer.pause : timer.resume}
            >
              {timer.state === "running" ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button
              className={`${styles.controlBtn} ${styles.controlBtnGhost}`}
              onClick={endSessionEarly}
            >
              <X size={20} />
              End Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Intermission View
  if (state === "intermission") {
    const nextTask = tasks[currentTaskIndex + 1];

    return (
      <div className={`${styles.page} ${styles.intermission}`}>
        <div className={styles.runningContainer}>
          <div className={styles.checkCircle}>
            <Check size={48} />
          </div>

          <h2>Task Complete!</h2>
          <p className={styles.lastScore}>Focus Score: {results[results.length - 1]?.focusScore}%</p>

          <div className={styles.nextTaskCard}>
            <span className={styles.label}>Up Next</span>
            <h3>{nextTask.name}</h3>
            <span className={styles.duration}>{nextTask.durationMinutes} minutes</span>
          </div>

          <div className={styles.actions}>
            <button className={styles.continueBtn} onClick={continueToNextTask}>
              Continue
              <ChevronRight size={20} />
            </button>

            <button className={styles.endBtn} onClick={resetSession}>
              End Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completed View
  return (
    <div className={`${styles.page} ${styles.completed}`}>
      <div className={styles.container}>
        <h2 className={styles.completedTitle}>Session Complete! 🎉</h2>

        <div className={styles.summaryStats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{Math.round(totalDuration / 60)}m</span>
            <span className={styles.statLabel}>Total Focus Time</span>
          </div>
          <div className={styles.stat}>
            <span
              className={styles.statValue}
              style={{ color: getScoreColor(avgFocusScore) }}
            >
              {avgFocusScore}%
            </span>
            <span className={styles.statLabel}>Avg Focus Score</span>
          </div>
        </div>

        <div className={styles.resultsList}>
          {results.map((result, index) => (
            <div key={index} className={styles.resultCard}>
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
            </div>
          ))}
        </div>

        <button className={styles.newSessionBtn} onClick={resetSession}>
          New Session
        </button>
      </div>
    </div>
  );
}
