"use client";

import { FloatingChopsticksNav } from "@/components/navigation/floating-chopsticks-nav";
import { BentoBoxContainer } from "@/components/bento-container";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { TimerProvider } from "@/lib/timer-context";
import { BoxThemeProvider } from "@/lib/box-theme-context";
import styles from "./layout.module.css";

// Inner component that uses auth context
function MainLayoutInner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <BoxThemeProvider userId={user?.id}>
      <div className={styles.layoutContainer}>
        {/* Floating Chopsticks Navigation - outside the bento box */}
        <FloatingChopsticksNav />

        {/* Main Content Area - wrapped in Bento Box */}
        <main className={styles.mainContent}>
          <BentoBoxContainer>
            {children}
          </BentoBoxContainer>
        </main>
      </div>
    </BoxThemeProvider>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimerProvider>
      <AuthProvider>
        <MainLayoutInner>{children}</MainLayoutInner>
      </AuthProvider>
    </TimerProvider>
  );
}
