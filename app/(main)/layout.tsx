"use client";

import { BottomNav } from "@/components/navigation/bottom-nav";
import { AuthProvider } from "@/lib/auth-context";
import { TimerProvider } from "@/lib/timer-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimerProvider>
      <AuthProvider>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}>
          <main style={{
            flex: 1,
            paddingBottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
            overflowY: "auto",
          }}>
            {children}
          </main>
          <BottomNav />
        </div>
      </AuthProvider>
    </TimerProvider>
  );
}
