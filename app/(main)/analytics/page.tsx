"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Lightbulb,
  Trophy,
  History,
  Flame,
  TrendingUp,
  TrendingDown,
  Loader2
} from "lucide-react";
import {
  staggerContainer,
  staggerItem,
  tabContentVariants,
  springTransition,
  usePrefersReducedMotion
} from "@/lib/motion";
import { useAuth } from "@/lib/auth-context";
import styles from "./analytics.module.css";

type AnalyticsTab = "overview" | "insights" | "awards" | "history";

interface AnalyticsData {
  userName: string;
  focusScore: number;
  focusScoreTrend: number;
  currentStreak: number;
  totalSessions: number;
  totalFocusMinutes: number;
  sessionDistribution: {
    timer: number;
    bento: number;
    routine: number;
  };
  recentSessions: Array<{
    id: string;
    type: string;
    taskName: string;
    duration: number;
    focusScore: number;
    completedAt: string;
  }>;
  insights: {
    peakPerformance: { window: string; score: number } | null;
    focusSweetSpot: { duration: string; score: number } | null;
    averageSession: number;
    monthlyTotal: { hours: number; minutes: number };
  };
  awards: {
    unlocked: string[];
    nextAward: { type: string; progress: number; total: number } | null;
  };
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#C5C9A4";
  if (score >= 50) return "#D4A27C";
  return "#7A6052";
}

// Animated Counter Hook
function useAnimatedCounter(target: number, duration: number = 1000) {
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

// Tab components with data props
function OverviewTab({ data }: { data: AnalyticsData }) {
  const [sessionCount, setSessionCount] = useState<25 | 50 | 100>(25);
  const prefersReducedMotion = usePrefersReducedMotion();

  const total = data.sessionDistribution.timer +
    data.sessionDistribution.bento +
    data.sessionDistribution.routine;

  const containerProps = prefersReducedMotion ? {} : {
    variants: staggerContainer,
    initial: "hidden",
    animate: "visible"
  };

  const itemProps = prefersReducedMotion ? {} : { variants: staggerItem };

  if (total === 0) {
    return (
      <motion.div className={styles.tabContent} {...containerProps}>
        <motion.div className={styles.greetingCard} {...itemProps}>
          <h2>{getGreeting()}, {data.userName}!</h2>
          <p className={styles.date}>{formatDate()}</p>
        </motion.div>
        <motion.div className={styles.emptyState} {...itemProps}>
          <p>Complete your first focus session to see your stats!</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.tabContent}
      {...containerProps}
    >
      <motion.div className={styles.greetingCard} {...itemProps}>
        <h2>{getGreeting()}, {data.userName}!</h2>
        <p className={styles.date}>{formatDate()}</p>
      </motion.div>

      <motion.div className={styles.statsRow} {...itemProps}>
        <motion.div
          className={styles.focusScoreCard}
          whileHover={prefersReducedMotion ? {} : { y: -2 }}
          transition={springTransition}
        >
          <span className={styles.label}>Focus Score</span>
          <div
            className={styles.scoreBadge}
            style={{ backgroundColor: getScoreColor(data.focusScore) }}
          >
            <span className={styles.score}>{data.focusScore}%</span>
          </div>
        </motion.div>

        <motion.div
          className={styles.streakCard}
          whileHover={prefersReducedMotion ? {} : { y: -2 }}
          transition={springTransition}
        >
          <span className={styles.label}>Current Streak</span>
          <div className={styles.streakValue}>
            <Flame size={24} className={styles.flameIcon} />
            <span className={styles.days}>{data.currentStreak}</span>
            <span className={styles.suffix}>days</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className={styles.chartCard} {...itemProps}>
        <div className={styles.chartHeader}>
          <h3>Session Types</h3>
          <select
            value={sessionCount}
            onChange={(e) => setSessionCount(Number(e.target.value) as 25 | 50 | 100)}
            className={styles.countSelect}
          >
            <option value={25}>Last 25</option>
            <option value={50}>Last 50</option>
            <option value={100}>Last 100</option>
          </select>
        </div>

        <div className={styles.pieChart}>
          <motion.div
            className={styles.pieVisual}
            initial={prefersReducedMotion ? {} : { rotate: -90, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              className={styles.pie}
              style={{
                background: `conic-gradient(
                  #C5C9A4 0deg ${(data.sessionDistribution.timer / total) * 360}deg,
                  #7A6052 ${(data.sessionDistribution.timer / total) * 360}deg ${((data.sessionDistribution.timer + data.sessionDistribution.bento) / total) * 360}deg,
                  #D4A27C ${((data.sessionDistribution.timer + data.sessionDistribution.bento) / total) * 360}deg 360deg
                )`
              }}
            />
          </motion.div>
          <div className={styles.pieLegend}>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: "#C5C9A4" }} />
              <span>Timer ({data.sessionDistribution.timer})</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: "#7A6052" }} />
              <span>Bento ({data.sessionDistribution.bento})</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: "#D4A27C" }} />
              <span>Routine ({data.sessionDistribution.routine})</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InsightsTab({ data }: { data: AnalyticsData }) {
  const isImproving = data.focusScoreTrend > 0;
  const animatedScore = useAnimatedCounter(data.focusScore);
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerProps = prefersReducedMotion ? {} : {
    variants: staggerContainer,
    initial: "hidden",
    animate: "visible"
  };

  const itemProps = prefersReducedMotion ? {} : { variants: staggerItem };

  if (data.totalSessions < 5) {
    return (
      <motion.div className={styles.tabContent} {...containerProps}>
        <motion.div className={styles.emptyState} {...itemProps}>
          <p>Complete at least 5 sessions to unlock insights!</p>
          <p className={styles.progressNote}>You&apos;ve completed {data.totalSessions} so far.</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.tabContent}
      style={{ gap: "24px" }}
      {...containerProps}
    >
      <motion.div className={styles.scoreHero} {...itemProps}>
        <span className={styles.label}>Your Focus Score</span>
        <div className={styles.heroRow}>
          <motion.span
            className={styles.heroScore}
            style={{ color: getScoreColor(data.focusScore) }}
            initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {prefersReducedMotion ? data.focusScore : animatedScore}%
          </motion.span>
          <div className={`${styles.trend} ${isImproving ? styles.trendUp : styles.trendDown}`}>
            {isImproving ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            <span>{Math.abs(data.focusScoreTrend)}% from last week</span>
          </div>
        </div>
      </motion.div>

      <motion.div className={styles.smartInsights} {...itemProps}>
        <h3>Smart Insights</h3>
        <motion.div
          className={styles.insightCards}
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: "🔥", text: `You're on fire! ${data.currentStreak}-day streak and counting.` },
            { icon: "📈", text: data.focusScoreTrend >= 0 ? `Your focus score improved ${data.focusScoreTrend}% this week.` : `Focus score down ${Math.abs(data.focusScoreTrend)}% - you got this!` },
            { icon: "⏰", text: data.insights.focusSweetSpot ? `You focus best in ${data.insights.focusSweetSpot.duration} sessions.` : "Complete more sessions to find your sweet spot!" },
          ].map((insight, i) => (
            <motion.div
              key={i}
              className={styles.insightCard}
              variants={prefersReducedMotion ? {} : staggerItem}
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            >
              <span className={styles.insightIcon}>{insight.icon}</span>
              <p>{insight.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div className={styles.personalInsights} {...itemProps}>
        <h3>Personal Insights</h3>
        <motion.div
          className={styles.insightsGrid}
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className={styles.insightItem} variants={prefersReducedMotion ? {} : staggerItem}>
            <span className={styles.insightLabel}>🌅 Peak Performance</span>
            <span className={styles.insightValue}>{data.insights.peakPerformance?.window || "Not enough data"}</span>
            {data.insights.peakPerformance && <span className={styles.insightScore}>{data.insights.peakPerformance.score}% avg</span>}
          </motion.div>
          <motion.div className={styles.insightItem} variants={prefersReducedMotion ? {} : staggerItem}>
            <span className={styles.insightLabel}>🎯 Focus Sweet Spot</span>
            <span className={styles.insightValue}>{data.insights.focusSweetSpot?.duration || "Not enough data"}</span>
            {data.insights.focusSweetSpot && <span className={styles.insightScore}>{data.insights.focusSweetSpot.score}% avg</span>}
          </motion.div>
          <motion.div className={styles.insightItem} variants={prefersReducedMotion ? {} : staggerItem}>
            <span className={styles.insightLabel}>⏱️ Average Session</span>
            <span className={styles.insightValue}>{data.insights.averageSession} minutes</span>
          </motion.div>
          <motion.div className={styles.insightItem} variants={prefersReducedMotion ? {} : staggerItem}>
            <span className={styles.insightLabel}>📊 Monthly Total</span>
            <span className={styles.insightValue}>
              {data.insights.monthlyTotal.hours}h {data.insights.monthlyTotal.minutes}m
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const AWARDS = {
  TASK_STARTER: { name: "Task Starter", description: "Complete 5 focus sessions", icon: "🎯", threshold: 5, category: "Focus Mastery" },
  PERFECT_FOCUS: { name: "Perfect Focus", description: "Achieve 25 perfect focus scores", icon: "💯", threshold: 25, category: "Focus Mastery" },
  FOCUS_CHAMPION: { name: "Focus Champion", description: "Complete 50 sessions with 90%+ focus", icon: "🏆", threshold: 50, category: "Focus Mastery" },
  STEADY_PERFORMER: { name: "Steady Performer", description: "Complete 20 sessions between 25-45 min", icon: "⚡", threshold: 20, category: "Focus Mastery" },
  TIMER_SPECIALIST: { name: "Timer Specialist", description: "Complete 50 timer sessions", icon: "⏱️", threshold: 50, category: "ADHD Superpowers" },
  COMEBACK_CHAMPION: { name: "Comeback Champion", description: "Complete 5 sessions with 4+ pauses", icon: "💪", threshold: 5, category: "ADHD Superpowers" },
  ZEN_MASTER: { name: "Zen Master", description: "20 perfect sessions with no pauses", icon: "🧘", threshold: 20, category: "ADHD Superpowers" },
  NO_PAUSE_PRO: { name: "No-Pause Pro", description: "Complete 30 sessions without pausing", icon: "🚀", threshold: 30, category: "ADHD Superpowers" },
  BENTO_MASTER: { name: "Bento Master", description: "Complete 25 bento box sessions", icon: "🍱", threshold: 25, category: "Consistency Builder" },
  ROUTINE_CHAMPION: { name: "Routine Champion", description: "Complete 25 routine sessions", icon: "📅", threshold: 25, category: "Consistency Builder" },
  ROUTINE_BUILDER: { name: "Routine Builder", description: "Maintain a 30-day focus streak", icon: "🔥", threshold: 30, category: "Consistency Builder" },
  PERSISTENCE_MASTER: { name: "Persistence Master", description: "30 sessions with 1-3 pauses", icon: "🎖️", threshold: 30, category: "Consistency Builder" },
};

type AwardKey = keyof typeof AWARDS;

function AwardsTab({ data }: { data: AnalyticsData }) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Focus Mastery");
  const prefersReducedMotion = usePrefersReducedMotion();

  const categories = ["Focus Mastery", "ADHD Superpowers", "Consistency Builder"];
  const getAwardsByCategory = (category: string): AwardKey[] => {
    return (Object.keys(AWARDS) as AwardKey[]).filter((key) => AWARDS[key].category === category);
  };

  const nextAward = data.awards.nextAward ? AWARDS[data.awards.nextAward.type as AwardKey] : null;
  const progress = data.awards.nextAward ? (data.awards.nextAward.progress / data.awards.nextAward.total) * 100 : 0;

  return (
    <motion.div
      className={styles.tabContent}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {nextAward && data.awards.nextAward && (
        <motion.div
          className={styles.nextAward}
          initial={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
          animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, ...springTransition }}
        >
          <span className={styles.label}>Your Next Award</span>
          <div className={styles.awardPreview}>
            <motion.span
              className={styles.awardIcon}
              animate={prefersReducedMotion ? {} : { rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {nextAward.icon}
            </motion.span>
            <div className={styles.awardInfo}>
              <span className={styles.awardName}>{nextAward.name}</span>
              <span className={styles.awardDesc}>{nextAward.description}</span>
            </div>
          </div>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={prefersReducedMotion ? { width: `${progress}%` } : { width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
          </div>
          <span className={styles.progressText}>
            {data.awards.nextAward.progress} / {data.awards.nextAward.total}
          </span>
        </motion.div>
      )}

      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category}
          className={styles.category}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * (categoryIndex + 1) }}
        >
          <motion.button
            className={styles.categoryHeader}
            onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          >
            <span>{category}</span>
            <motion.span
              className={styles.expandIcon}
              animate={{ rotate: expandedCategory === category ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {expandedCategory === category ? "−" : "+"}
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {expandedCategory === category && (
              <motion.div
                className={styles.awardsList}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {getAwardsByCategory(category).map((key, i) => {
                  const award = AWARDS[key];
                  const isUnlocked = data.awards.unlocked.includes(key);

                  return (
                    <motion.div
                      key={key}
                      className={`${styles.awardCard} ${isUnlocked ? styles.awardCardUnlocked : styles.awardCardLocked}`}
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                    >
                      <span className={styles.awardCardIcon}>{award.icon}</span>
                      <div className={styles.awardDetails}>
                        <span className={styles.awardDetailsName}>{award.name}</span>
                        <span className={styles.awardDetailsDesc}>{award.description}</span>
                        {isUnlocked && <span className={styles.unlockedBadge}>Unlocked ✓</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
}

function HistoryTab({ data }: { data: AnalyticsData }) {
  const [sessionCount, setSessionCount] = useState<25 | 50 | 100>(25);
  const prefersReducedMotion = usePrefersReducedMotion();

  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getTypeBadgeColor = (type: string): string => {
    switch (type) {
      case "TIMER": return "#C5C9A4";
      case "BENTO": return "#7A6052";
      case "ROUTINE": return "#D4A27C";
      default: return "#C5C9A4";
    }
  };

  if (data.recentSessions.length === 0) {
    return (
      <motion.div className={styles.tabContent}>
        <div className={styles.emptyState}>
          <p>No sessions yet. Complete your first focus session!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.tabContent}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={styles.historyHeader}
        initial={prefersReducedMotion ? {} : { y: -10, opacity: 0 }}
        animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
      >
        <select
          value={sessionCount}
          onChange={(e) => setSessionCount(Number(e.target.value) as 25 | 50 | 100)}
          className={styles.countSelect}
        >
          <option value={25}>Last 25 sessions</option>
          <option value={50}>Last 50 sessions</option>
          <option value={100}>Last 100 sessions</option>
        </select>
      </motion.div>

      <motion.div
        className={styles.sessionsList}
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {data.recentSessions.map((session) => (
          <motion.div
            key={session.id}
            className={styles.sessionCard}
            variants={prefersReducedMotion ? {} : staggerItem}
            whileHover={prefersReducedMotion ? {} : { x: 4 }}
          >
            <div className={styles.sessionRow}>
              <span
                className={styles.typeBadge}
                style={{ backgroundColor: getTypeBadgeColor(session.type) }}
              >
                {session.type.toLowerCase()}
              </span>
              <span className={styles.sessionTime}>{formatTime(session.completedAt)}</span>
            </div>

            <div className={styles.sessionDetails}>
              <span className={styles.taskName}>{session.taskName}</span>
              <span className={styles.duration}>{session.duration} min</span>
            </div>

            <div className={styles.sessionScore}>
              <span
                className={styles.sessionScoreValue}
                style={{ color: getScoreColor(session.focusScore) }}
              >
                {session.focusScore}%
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className={styles.loadingState}>
      <Loader2 className={styles.spinner} size={32} />
      <p>Loading your analytics...</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        const response = await fetch("/api/analytics");
        if (response.ok) {
          const analyticsData = await response.json();
          setData(analyticsData);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const tabs: { id: AnalyticsTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
    { id: "insights", label: "Insights", icon: <Lightbulb size={18} /> },
    { id: "awards", label: "Awards", icon: <Trophy size={18} /> },
    { id: "history", label: "History", icon: <History size={18} /> },
  ];

  const renderTabContent = () => {
    if (loading) return <LoadingState />;
    if (!data) return <div className={styles.emptyState}><p>Unable to load analytics data.</p></div>;

    switch (activeTab) {
      case "overview": return <OverviewTab key="overview" data={data} />;
      case "insights": return <InsightsTab key="insights" data={data} />;
      case "awards": return <AwardsTab key="awards" data={data} />;
      case "history": return <HistoryTab key="history" data={data} />;
      default: return <OverviewTab key="overview" data={data} />;
    }
  };

  return (
    <motion.div
      className={styles.analyticsPage}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <nav className={styles.tabNav}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {activeTab === tab.id && !prefersReducedMotion && (
              <motion.div
                className={styles.activeIndicator}
                layoutId="activeTab"
                transition={springTransition}
              />
            )}
          </motion.button>
        ))}
      </nav>

      <div className={styles.contentArea}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={prefersReducedMotion ? {} : tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
