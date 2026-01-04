"use client";

import { useState } from "react";
import {
  BarChart3,
  Lightbulb,
  Trophy,
  History,
  Flame,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import styles from "./analytics.module.css";

type AnalyticsTab = "overview" | "insights" | "awards" | "history";

// Mock data - in production this would come from the database
const mockData = {
  userName: "Alex",
  focusScore: 87,
  focusScoreTrend: 5,
  currentStreak: 5,
  totalSessions: 42,
  totalFocusMinutes: 1260,
  sessionDistribution: {
    timer: 20,
    bento: 15,
    routine: 7,
  },
  recentSessions: [
    { id: "1", type: "TIMER", taskName: "Deep Work", duration: 25, focusScore: 100, completedAt: new Date() },
    { id: "2", type: "BENTO", taskName: "Email Batch", duration: 15, focusScore: 85, completedAt: new Date(Date.now() - 3600000) },
    { id: "3", type: "TIMER", taskName: "Code Review", duration: 45, focusScore: 72, completedAt: new Date(Date.now() - 7200000) },
  ],
  insights: {
    peakPerformance: { window: "Morning (9-12am)", score: 92 },
    focusSweetSpot: { duration: "25-30 min", score: 94 },
    averageSession: 27,
    monthlyTotal: { hours: 21, minutes: 0 },
  },
  awards: {
    unlocked: ["TASK_STARTER", "TIMER_SPECIALIST"],
    nextAward: { type: "PERFECT_FOCUS", progress: 8, total: 25 },
  },
};

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

// Tab components
function OverviewTab() {
  const [sessionCount, setSessionCount] = useState<25 | 50 | 100>(25);

  const total = mockData.sessionDistribution.timer +
    mockData.sessionDistribution.bento +
    mockData.sessionDistribution.routine;

  return (
    <div className={styles.tabContent}>
      <div className={styles.greetingCard}>
        <h2>{getGreeting()}, {mockData.userName}!</h2>
        <p className={styles.date}>{formatDate()}</p>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.focusScoreCard}>
          <span className={styles.label}>Focus Score</span>
          <div
            className={styles.scoreBadge}
            style={{ backgroundColor: getScoreColor(mockData.focusScore) }}
          >
            <span className={styles.score}>{mockData.focusScore}%</span>
          </div>
        </div>

        <div className={styles.streakCard}>
          <span className={styles.label}>Current Streak</span>
          <div className={styles.streakValue}>
            <Flame size={24} className={styles.flameIcon} />
            <span className={styles.days}>{mockData.currentStreak}</span>
            <span className={styles.suffix}>days</span>
          </div>
        </div>
      </div>

      <div className={styles.chartCard}>
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
          <div className={styles.pieVisual}>
            <div
              className={styles.pie}
              style={{
                background: `conic-gradient(
                  #C5C9A4 0deg ${(mockData.sessionDistribution.timer / total) * 360}deg,
                  #7A6052 ${(mockData.sessionDistribution.timer / total) * 360}deg ${((mockData.sessionDistribution.timer + mockData.sessionDistribution.bento) / total) * 360}deg,
                  #D4A27C ${((mockData.sessionDistribution.timer + mockData.sessionDistribution.bento) / total) * 360}deg 360deg
                )`
              }}
            />
          </div>
          <div className={styles.pieLegend}>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: "#C5C9A4" }} />
              <span>Timer ({mockData.sessionDistribution.timer})</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: "#7A6052" }} />
              <span>Bento ({mockData.sessionDistribution.bento})</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: "#D4A27C" }} />
              <span>Routine ({mockData.sessionDistribution.routine})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightsTab() {
  const isImproving = mockData.focusScoreTrend > 0;

  return (
    <div className={styles.tabContent} style={{ gap: "24px" }}>
      <div className={styles.scoreHero}>
        <span className={styles.label}>Your Focus Score</span>
        <div className={styles.heroRow}>
          <span
            className={styles.heroScore}
            style={{ color: getScoreColor(mockData.focusScore) }}
          >
            {mockData.focusScore}%
          </span>
          <div className={`${styles.trend} ${isImproving ? styles.trendUp : styles.trendDown}`}>
            {isImproving ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            <span>{Math.abs(mockData.focusScoreTrend)}% from last week</span>
          </div>
        </div>
      </div>

      <div className={styles.smartInsights}>
        <h3>Smart Insights</h3>
        <div className={styles.insightCards}>
          <div className={styles.insightCard}>
            <span className={styles.insightIcon}>🔥</span>
            <p>You&apos;re on fire! {mockData.currentStreak}-day streak and counting.</p>
          </div>
          <div className={styles.insightCard}>
            <span className={styles.insightIcon}>📈</span>
            <p>Your focus score improved {mockData.focusScoreTrend}% this week.</p>
          </div>
          <div className={styles.insightCard}>
            <span className={styles.insightIcon}>⏰</span>
            <p>You focus best in {mockData.insights.focusSweetSpot.duration} sessions.</p>
          </div>
        </div>
      </div>

      <div className={styles.personalInsights}>
        <h3>Personal Insights</h3>
        <div className={styles.insightsGrid}>
          <div className={styles.insightItem}>
            <span className={styles.insightLabel}>🌅 Peak Performance</span>
            <span className={styles.insightValue}>{mockData.insights.peakPerformance.window}</span>
            <span className={styles.insightScore}>{mockData.insights.peakPerformance.score}% avg</span>
          </div>
          <div className={styles.insightItem}>
            <span className={styles.insightLabel}>🎯 Focus Sweet Spot</span>
            <span className={styles.insightValue}>{mockData.insights.focusSweetSpot.duration}</span>
            <span className={styles.insightScore}>{mockData.insights.focusSweetSpot.score}% avg</span>
          </div>
          <div className={styles.insightItem}>
            <span className={styles.insightLabel}>⏱️ Average Session</span>
            <span className={styles.insightValue}>{mockData.insights.averageSession} minutes</span>
          </div>
          <div className={styles.insightItem}>
            <span className={styles.insightLabel}>📊 Monthly Total</span>
            <span className={styles.insightValue}>
              {mockData.insights.monthlyTotal.hours}h {mockData.insights.monthlyTotal.minutes}m
            </span>
          </div>
        </div>
      </div>
    </div>
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

function AwardsTab() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Focus Mastery");

  const categories = ["Focus Mastery", "ADHD Superpowers", "Consistency Builder"];
  const getAwardsByCategory = (category: string): AwardKey[] => {
    return (Object.keys(AWARDS) as AwardKey[]).filter((key) => AWARDS[key].category === category);
  };

  const nextAward = AWARDS[mockData.awards.nextAward.type as AwardKey];
  const progress = (mockData.awards.nextAward.progress / mockData.awards.nextAward.total) * 100;

  return (
    <div className={styles.tabContent}>
      <div className={styles.nextAward}>
        <span className={styles.label}>Your Next Award</span>
        <div className={styles.awardPreview}>
          <span className={styles.awardIcon}>{nextAward.icon}</span>
          <div className={styles.awardInfo}>
            <span className={styles.awardName}>{nextAward.name}</span>
            <span className={styles.awardDesc}>{nextAward.description}</span>
          </div>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.progressText}>
          {mockData.awards.nextAward.progress} / {mockData.awards.nextAward.total}
        </span>
      </div>

      {categories.map((category) => (
        <div key={category} className={styles.category}>
          <button
            className={styles.categoryHeader}
            onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
          >
            <span>{category}</span>
            <span className={styles.expandIcon}>{expandedCategory === category ? "−" : "+"}</span>
          </button>

          {expandedCategory === category && (
            <div className={styles.awardsList}>
              {getAwardsByCategory(category).map((key) => {
                const award = AWARDS[key];
                const isUnlocked = mockData.awards.unlocked.includes(key);

                return (
                  <div
                    key={key}
                    className={`${styles.awardCard} ${isUnlocked ? styles.awardCardUnlocked : styles.awardCardLocked}`}
                  >
                    <span className={styles.awardCardIcon}>{award.icon}</span>
                    <div className={styles.awardDetails}>
                      <span className={styles.awardDetailsName}>{award.name}</span>
                      <span className={styles.awardDetailsDesc}>{award.description}</span>
                      {isUnlocked && <span className={styles.unlockedBadge}>Unlocked ✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function HistoryTab() {
  const [sessionCount, setSessionCount] = useState<25 | 50 | 100>(25);

  const formatTime = (date: Date): string => {
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

  return (
    <div className={styles.tabContent}>
      <div className={styles.historyHeader}>
        <select
          value={sessionCount}
          onChange={(e) => setSessionCount(Number(e.target.value) as 25 | 50 | 100)}
          className={styles.countSelect}
        >
          <option value={25}>Last 25 sessions</option>
          <option value={50}>Last 50 sessions</option>
          <option value={100}>Last 100 sessions</option>
        </select>
      </div>

      <div className={styles.sessionsList}>
        {mockData.recentSessions.map((session) => (
          <div key={session.id} className={styles.sessionCard}>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");

  const tabs: { id: AnalyticsTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
    { id: "insights", label: "Insights", icon: <Lightbulb size={18} /> },
    { id: "awards", label: "Awards", icon: <Trophy size={18} /> },
    { id: "history", label: "History", icon: <History size={18} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "insights": return <InsightsTab />;
      case "awards": return <AwardsTab />;
      case "history": return <HistoryTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className={styles.analyticsPage}>
      <nav className={styles.tabNav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.contentArea}>
        {renderTabContent()}
      </div>
    </div>
  );
}
