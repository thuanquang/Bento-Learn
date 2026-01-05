"use client";

import { motion } from "framer-motion";
import { springTransition, usePrefersReducedMotion } from "@/lib/motion";
import styles from "./navigation.module.css";

export interface RightSidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface RightSidebarProps {
    items: RightSidebarItem[];
    activeId: string;
    onItemClick: (id: string) => void;
    ariaLabel?: string;
}

export function RightSidebar({ items, activeId, onItemClick, ariaLabel = "Secondary navigation" }: RightSidebarProps) {
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <motion.nav
            className={styles.rightSidebar}
            initial={prefersReducedMotion ? {} : { x: 100, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { x: 0, opacity: 1 }}
            transition={{ delay: 0.2, ...springTransition }}
            aria-label={ariaLabel}
        >
            {items.map((item) => {
                const isActive = activeId === item.id;

                return (
                    <button
                        key={item.id}
                        onClick={() => onItemClick(item.id)}
                        className={`${styles.rightSidebarItem} ${isActive ? styles.rightSidebarItemActive : ""}`}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {isActive && !prefersReducedMotion && (
                            <motion.div
                                layoutId="rightSidebarActiveIndicator"
                                className={styles.activeIndicator}
                                transition={springTransition}
                            />
                        )}
                        {isActive && prefersReducedMotion && (
                            <div className={styles.activeIndicator} />
                        )}
                        <motion.span
                            className={styles.rightSidebarIcon}
                            whileTap={prefersReducedMotion ? {} : { scale: 0.85 }}
                            transition={springTransition}
                        >
                            {item.icon}
                        </motion.span>
                        <span className={styles.rightSidebarLabel}>{item.label}</span>
                        <span className={styles.rightTooltip} role="tooltip" aria-hidden="true">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </motion.nav>
    );
}

// Mobile horizontal tabs component
interface MobileTabsProps {
    items: RightSidebarItem[];
    activeId: string;
    onItemClick: (id: string) => void;
}

export function MobileTabs({ items, activeId, onItemClick }: MobileTabsProps) {
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <div className={styles.mobileTabs} role="tablist">
            {items.map((item) => {
                const isActive = activeId === item.id;

                return (
                    <motion.button
                        key={item.id}
                        onClick={() => onItemClick(item.id)}
                        className={`${styles.mobileTabItem} ${isActive ? styles.mobileTabItemActive : ""}`}
                        role="tab"
                        aria-selected={isActive}
                        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    >
                        <span className={styles.mobileTabIcon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
}
