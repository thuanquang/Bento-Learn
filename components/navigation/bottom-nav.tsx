"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, Timer, Package, User } from "lucide-react";
import { springTransition, usePrefersReducedMotion } from "@/lib/motion";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/analytics", label: "Analytics", icon: <BarChart3 size={24} /> },
  { href: "/timer", label: "Timer", icon: <Timer size={24} /> },
  { href: "/focus-box", label: "Focus Box", icon: <Package size={24} /> },
  { href: "/profile", label: "Profile", icon: <User size={24} /> },
];

export function BottomNav() {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.nav
      initial={prefersReducedMotion ? {} : { y: 100 }}
      animate={prefersReducedMotion ? {} : { y: 0 }}
      transition={{ delay: 0.3, ...springTransition }}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(197, 201, 164, 0.3)",
        padding: "8px 16px",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        zIndex: 100,
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "8px 16px",
              borderRadius: "12px",
              color: isActive ? "#3A3A3A" : "#6B6B6B",
              textDecoration: "none",
              minWidth: "64px",
              position: "relative",
            }}
          >
            {isActive && !prefersReducedMotion && (
              <motion.div
                layoutId="navActiveIndicator"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(197, 201, 164, 0.25)",
                  borderRadius: "12px",
                  zIndex: -1,
                }}
                transition={springTransition}
              />
            )}
            {isActive && prefersReducedMotion && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(197, 201, 164, 0.25)",
                  borderRadius: "12px",
                  zIndex: -1,
                }}
              />
            )}
            <motion.span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isActive ? "#7A6052" : "inherit",
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.85 }}
              transition={springTransition}
            >
              {item.icon}
            </motion.span>
            <span style={{ fontSize: "11px", fontWeight: 500 }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </motion.nav>
  );
}
