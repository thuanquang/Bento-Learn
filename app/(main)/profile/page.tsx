"use client";

import { useState } from "react";
import {
  Edit2,
  Check,
  X,
  Timer,
  Clock,
  Flame,
  Calendar
} from "lucide-react";
import { AMBIENT_SOUNDS } from "@/lib/sounds";
import styles from "./profile.module.css";

// Mock data - in production this would come from the database
const mockUser = {
  id: "1",
  name: "Alex",
  username: "alex_focus",
  email: "demo@bentolearn.app",
  image: null,
  createdAt: new Date("2024-01-01"),
};

const mockStats = {
  totalSessions: 42,
  totalFocusMinutes: 1260,
  currentStreak: 5,
  longestStreak: 12,
  defaultDuration: 25,
  defaultSound: "rain",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(mockUser.name);

  const [defaultDuration, setDefaultDuration] = useState(mockStats.defaultDuration);
  const [defaultSound, setDefaultSound] = useState(mockStats.defaultSound);

  const handleSaveProfile = () => {
    console.log("Saving profile:", { name: editName });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(mockUser.name);
    setIsEditing(false);
  };

  const formatHours = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {mockUser.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mockUser.image} alt={mockUser.name} />
            ) : (
              <span className={styles.avatarInitials}>
                {mockUser.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {isEditing ? (
            <div className={styles.editForm}>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className={styles.nameInput}
                placeholder="Your name"
                autoFocus
              />
              <div className={styles.editActions}>
                <button className={`${styles.iconBtn} ${styles.iconBtnSave}`} onClick={handleSaveProfile}>
                  <Check size={18} />
                </button>
                <button className={`${styles.iconBtn} ${styles.iconBtnCancel}`} onClick={handleCancelEdit}>
                  <X size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{mockUser.name}</h2>
              {mockUser.username && (
                <p className={styles.username}>@{mockUser.username}</p>
              )}
              <button
                className={styles.editBtn}
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={14} />
                Edit
              </button>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Your Stats</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Timer size={20} />
              </div>
              <span className={styles.statValue}>{mockStats.totalSessions}</span>
              <span className={styles.statLabel}>Sessions</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Clock size={20} />
              </div>
              <span className={styles.statValue}>{formatHours(mockStats.totalFocusMinutes)}</span>
              <span className={styles.statLabel}>Focus Time</span>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.statIconFlame}`}>
                <Flame size={20} />
              </div>
              <span className={styles.statValue}>{mockStats.currentStreak}</span>
              <span className={styles.statLabel}>Current Streak</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Calendar size={20} />
              </div>
              <span className={styles.statValue}>{formatDate(mockUser.createdAt)}</span>
              <span className={styles.statLabel}>Member Since</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Settings</h3>

          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Default Timer Duration</span>
                <span className={styles.settingDesc}>Starting duration for new timer sessions</span>
              </div>
              <select
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(Number(e.target.value))}
                className={styles.settingSelect}
              >
                <option value={15}>15 min</option>
                <option value={25}>25 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Default Ambient Sound</span>
                <span className={styles.settingDesc}>Sound that plays when you start a session</span>
              </div>
              <select
                value={defaultSound}
                onChange={(e) => setDefaultSound(e.target.value)}
                className={styles.settingSelect}
              >
                {AMBIENT_SOUNDS.map((sound) => (
                  <option key={sound.id} value={sound.id}>
                    {sound.icon} {sound.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <p>Bento Focus v1.0.0</p>
          <p>Made with 🍱 for better focus</p>
        </div>
      </div>
    </div>
  );
}
