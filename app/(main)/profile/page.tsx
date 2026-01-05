"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Edit2,
  Check,
  X,
  Timer,
  Clock,
  Flame,
  Calendar,
  LogOut,
  Loader2
} from "lucide-react";
import { AMBIENT_SOUNDS } from "@/lib/sounds";
import {
  staggerContainer,
  staggerItem,
  springTransition,
  usePrefersReducedMotion
} from "@/lib/motion";
import { useAuth } from "@/lib/auth-context";
import styles from "./profile.module.css";

interface UserData {
  name: string;
  username: string | null;
  email: string;
  createdAt: string;
}

interface StatsData {
  totalSessions: number;
  totalFocusMinutes: number;
  currentStreak: number;
  longestStreak: number;
  defaultDuration: number;
  defaultSound: string;
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

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [defaultDuration, setDefaultDuration] = useState(25);
  const [defaultSound, setDefaultSound] = useState("off");
  const [loggingOut, setLoggingOut] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
          setStatsData(data.stats);
          setEditName(data.user?.name || "");
          setDefaultDuration(data.stats?.defaultDuration || 25);
          setDefaultSound(data.stats?.defaultSound || "off");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const animatedSessions = useAnimatedCounter(statsData?.totalSessions || 0);
  const animatedStreak = useAnimatedCounter(statsData?.currentStreak || 0);

  const handleSaveProfile = async () => {
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      if (userData) {
        setUserData({ ...userData, name: editName });
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(userData?.name || "");
    setIsEditing(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
      setLoggingOut(false);
    }
  };

  const formatHours = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <Loader2 className={styles.spinner} size={32} />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.page}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.container}>
        <motion.div
          className={styles.userCard}
          initial={prefersReducedMotion ? {} : { y: 20, opacity: 0 }}
          animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className={styles.avatar}
            initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, ...springTransition }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          >
            <span className={styles.avatarInitials}>
              {(userData?.name || userData?.email || "U").charAt(0).toUpperCase()}
            </span>
          </motion.div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                className={styles.editForm}
                initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, height: "auto" }}
                exit={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={styles.nameInput}
                  placeholder="Your name"
                  autoFocus
                />
                <div className={styles.editActions}>
                  <motion.button
                    className={`${styles.iconBtn} ${styles.iconBtnSave}`}
                    onClick={handleSaveProfile}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                  >
                    <Check size={18} />
                  </motion.button>
                  <motion.button
                    className={`${styles.iconBtn} ${styles.iconBtnCancel}`}
                    onClick={handleCancelEdit}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="display"
                className={styles.userInfo}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className={styles.userName}>{userData?.name || userData?.email?.split("@")[0] || "User"}</h2>
                {userData?.username && (
                  <p className={styles.username}>@{userData.username}</p>
                )}
                <motion.button
                  className={styles.editBtn}
                  onClick={() => setIsEditing(true)}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                >
                  <Edit2 size={14} />
                  Edit
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className={styles.section}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className={styles.sectionTitle}>Your Stats</h3>
          <motion.div
            className={styles.statsGrid}
            variants={prefersReducedMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className={styles.statCard}
              variants={prefersReducedMotion ? {} : staggerItem}
              whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.02 }}
              transition={springTransition}
            >
              <div className={styles.statIcon}>
                <Timer size={20} />
              </div>
              <span className={styles.statValue}>
                {prefersReducedMotion ? (statsData?.totalSessions || 0) : animatedSessions}
              </span>
              <span className={styles.statLabel}>Sessions</span>
            </motion.div>

            <motion.div
              className={styles.statCard}
              variants={prefersReducedMotion ? {} : staggerItem}
              whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.02 }}
              transition={springTransition}
            >
              <div className={styles.statIcon}>
                <Clock size={20} />
              </div>
              <span className={styles.statValue}>{formatHours(statsData?.totalFocusMinutes || 0)}</span>
              <span className={styles.statLabel}>Focus Time</span>
            </motion.div>

            <motion.div
              className={styles.statCard}
              variants={prefersReducedMotion ? {} : staggerItem}
              whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.02 }}
              transition={springTransition}
            >
              <div className={`${styles.statIcon} ${styles.statIconFlame}`}>
                <Flame size={20} />
              </div>
              <span className={styles.statValue}>
                {prefersReducedMotion ? (statsData?.currentStreak || 0) : animatedStreak}
              </span>
              <span className={styles.statLabel}>Current Streak</span>
            </motion.div>

            <motion.div
              className={styles.statCard}
              variants={prefersReducedMotion ? {} : staggerItem}
              whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.02 }}
              transition={springTransition}
            >
              <div className={styles.statIcon}>
                <Calendar size={20} />
              </div>
              <span className={styles.statValue}>{userData?.createdAt ? formatDate(userData.createdAt) : "-"}</span>
              <span className={styles.statLabel}>Member Since</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.section}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className={styles.sectionTitle}>Settings</h3>

          <motion.div
            className={styles.settingsList}
            variants={prefersReducedMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className={styles.settingItem}
              variants={prefersReducedMotion ? {} : staggerItem}
              whileHover={prefersReducedMotion ? {} : { x: 4 }}
            >
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
            </motion.div>

            <motion.div
              className={styles.settingItem}
              variants={prefersReducedMotion ? {} : staggerItem}
              whileHover={prefersReducedMotion ? {} : { x: 4 }}
            >
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
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          className={styles.section}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <motion.button
            className={styles.logoutBtn}
            onClick={handleLogout}
            disabled={loggingOut}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
          >
            {loggingOut ? (
              <Loader2 size={18} className={styles.spinner} />
            ) : (
              <LogOut size={18} />
            )}
            {loggingOut ? "Signing out..." : "Sign Out"}
          </motion.button>
        </motion.div>

        <motion.div
          className={styles.footer}
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Bento Focus v1.0.0</p>
          <p>Made with 🍱 for better focus</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
