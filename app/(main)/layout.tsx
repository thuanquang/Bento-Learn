"use client";

import { FloatingChopsticksNav } from "@/components/navigation/floating-chopsticks-nav";
import { AuthProvider } from "@/lib/auth-context";
import { TimerProvider } from "@/lib/timer-context";
import styles from "./layout.module.css";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimerProvider>
      <AuthProvider>
        <div className={styles.layoutContainer}>
          {/* Floating Chopsticks Navigation */}
          <FloatingChopsticksNav />

          {/* Main Content Area */}
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </AuthProvider>
    </TimerProvider>
  );
}
