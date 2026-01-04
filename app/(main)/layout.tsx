"use client";

import { BottomNav } from "@/components/navigation/bottom-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
