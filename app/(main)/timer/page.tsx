"use client";

import { useTimer } from "@/lib/use-timer";
import { AMBIENT_SOUNDS } from "@/lib/sounds";
import { getScoreColor } from "@/lib/focus-score";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { useState } from "react";
import styles from "./timer.module.css";

const DURATION_PRESETS = [15, 25, 45, 60];

export default function TimerPage() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const timer = useTimer({
    onComplete: (result) => {
      // TODO: Save session to database via server action
      console.log("Session completed:", result);
    },
  });

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

  const handleMainButton = () => {
    if (timer.state === "idle") {
      timer.start();
    } else if (timer.state === "running") {
      timer.pause();
    } else if (timer.state === "paused") {
      timer.resume();
    } else if (timer.state === "completed") {
      timer.reset();
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
    <div className={styles.timerPage}>
      <div className={styles.timerContainer}>
        {/* Task Name Input */}
        <div className={styles.taskNameSection}>
          {timer.state === "idle" ? (
            <input
              type="text"
              className={styles.taskInput}
              value={timer.config.taskName}
              onChange={(e) => timer.updateConfig({ taskName: e.target.value })}
              placeholder="What are you working on?"
              maxLength={50}
            />
          ) : (
            <h2 className={styles.taskDisplay}>{timer.config.taskName}</h2>
          )}
        </div>

        {/* Timer Display */}
        <div className={styles.timerCircleWrapper}>
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
            <circle
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
            />
          </svg>

          <div className={styles.timerCenter}>
            {timer.state === "completed" && timer.result ? (
              <div className={styles.completionDisplay}>
                <span className={styles.scoreLabel}>Focus Score</span>
                <span
                  className={styles.scoreValue}
                  style={{ color: getScoreColor(timer.result.focusScore) }}
                >
                  {timer.result.focusScore}%
                </span>
              </div>
            ) : (
              <span className={styles.timeDisplay}>{timer.formattedTime}</span>
            )}
          </div>
        </div>

        {/* Pause Count Indicator */}
        {timer.pauseCount > 0 && timer.state !== "completed" && (
          <div className={styles.pauseIndicator}>
            {timer.pauseCount} pause{timer.pauseCount !== 1 ? 's' : ''}
          </div>
        )}

        {/* Duration Selector (only in idle state) */}
        {timer.state === "idle" && (
          <div className={styles.durationSection}>
            <div className={styles.durationPresets}>
              {DURATION_PRESETS.map((duration) => (
                <button
                  key={duration}
                  className={`${styles.durationBtn} ${timer.config.durationMinutes === duration ? styles.durationBtnActive : ""}`}
                  onClick={() => timer.updateConfig({ durationMinutes: duration })}
                >
                  {duration}m
                </button>
              ))}
            </div>

            <div className={styles.customDuration}>
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
            </div>
          </div>
        )}

        {/* Sound Selector */}
        {(timer.state === "idle" || timer.state === "running") && (
          <div className={styles.soundSection}>
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
          </div>
        )}

        {/* Controls */}
        <div className={styles.controls}>
          <button
            className={styles.mainBtn}
            onClick={handleMainButton}
          >
            {getMainButtonIcon()}
            {getMainButtonText()}
          </button>

          {(timer.state === "running" || timer.state === "paused") && (
            <button
              className={styles.resetBtn}
              onClick={handleReset}
            >
              <RotateCcw size={18} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowResetConfirm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Reset Timer?</h3>
            <p>Your current session will be lost.</p>
            <div className={styles.modalActions}>
              <button className={styles.btnGhost} onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
              <button className={styles.btnAccent} onClick={confirmReset}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
