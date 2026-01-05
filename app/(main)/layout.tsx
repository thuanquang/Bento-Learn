"use client";

import { SideNav, BottomNav } from "@/components/navigation/side-nav";
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
          {/* Desktop/Tablet: Side Navigation */}
          <SideNav />

          {/* Mobile: Bottom Navigation */}
          <BottomNav />

          {/* Main Content Area */}
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </AuthProvider>
    </TimerProvider>
  );
}
