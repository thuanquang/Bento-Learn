"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, Timer, Package, User } from "lucide-react";
import { springTransition, usePrefersReducedMotion } from "@/lib/motion";
import styles from "./navigation.module.css";

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

export function SideNav() {
    const pathname = usePathname();
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <motion.nav
            className={styles.sideNav}
            initial={prefersReducedMotion ? {} : { x: -100, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { x: 0, opacity: 1 }}
            transition={{ delay: 0.1, ...springTransition }}
            aria-label="Main navigation"
        >
            {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.sideNavItem} ${isActive ? styles.sideNavItemActive : ""}`}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {isActive && !prefersReducedMotion && (
                            <motion.div
                                layoutId="sideNavActiveIndicator"
                                className={styles.activeIndicator}
                                transition={springTransition}
                            />
                        )}
                        {isActive && prefersReducedMotion && (
                            <div className={styles.activeIndicator} />
                        )}
                        <motion.span
                            className={styles.sideNavIcon}
                            whileTap={prefersReducedMotion ? {} : { scale: 0.85 }}
                            transition={springTransition}
                        >
                            {item.icon}
                        </motion.span>
                        <span className={styles.sideNavLabel}>{item.label}</span>
                        <span className={styles.tooltip} role="tooltip" aria-hidden="true">
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </motion.nav>
    );
}

// Bottom navigation for mobile
export function BottomNav() {
    const pathname = usePathname();
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <motion.nav
            className={styles.bottomNav}
            initial={prefersReducedMotion ? {} : { y: 100 }}
            animate={prefersReducedMotion ? {} : { y: 0 }}
            transition={{ delay: 0.3, ...springTransition }}
            aria-label="Main navigation"
        >
            {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.bottomNavItem} ${isActive ? styles.bottomNavItemActive : ""}`}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {isActive && !prefersReducedMotion && (
                            <motion.div
                                layoutId="bottomNavActiveIndicator"
                                className={styles.activeIndicator}
                                transition={springTransition}
                            />
                        )}
                        {isActive && prefersReducedMotion && (
                            <div className={styles.activeIndicator} />
                        )}
                        <motion.span
                            className={styles.bottomNavIcon}
                            whileTap={prefersReducedMotion ? {} : { scale: 0.85 }}
                            transition={springTransition}
                        >
                            {item.icon}
                        </motion.span>
                        <span className={styles.bottomNavLabel}>{item.label}</span>
                    </Link>
                );
            })}
        </motion.nav>
    );
}
