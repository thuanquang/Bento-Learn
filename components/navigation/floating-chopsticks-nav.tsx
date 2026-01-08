"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
    motion,
    useMotionValue,
    animate,
} from "framer-motion";
import { BarChart3, Timer, Package, User } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { useNavigationTransition } from "@/lib/navigation-transition-context";
import styles from "./floating-chopsticks-nav.module.css";

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { href: "/analytics", label: "Analytics", icon: <BarChart3 size={22} /> },
    { href: "/timer", label: "Timer", icon: <Timer size={22} /> },
    { href: "/focus-box", label: "Focus Box", icon: <Package size={22} /> },
    { href: "/profile", label: "Profile", icon: <User size={22} /> },
];

// Constants
const CLOSED_WIDTH = 60;
const OPEN_WIDTH = 280;
const MENU_HEIGHT = 72;
const PADDING = 20;
const CHOPSTICK_SPREAD = 110; // How far each chopstick moves outward

// Spring config for smooth animations
const springConfig = {
    type: "spring" as const,
    stiffness: 300,
    damping: 28,
};

const smoothSpring = {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
};

export function FloatingChopsticksNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [hasDragged, setHasDragged] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const constraintsRef = useRef<HTMLDivElement>(null);

    // Use motion values for smooth position updates
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const pathname = usePathname();
    const { navigateWithTransition } = useNavigationTransition();
    const prefersReducedMotion = usePrefersReducedMotion();

    // Initialize position to bottom-right
    useEffect(() => {
        const initialX = window.innerWidth - CLOSED_WIDTH - PADDING;
        const initialY = window.innerHeight - MENU_HEIGHT - PADDING;
        x.set(initialX);
        y.set(initialY);
    }, [x, y]);

    // Clamp position within viewport bounds
    const clampPosition = useCallback(() => {
        const currentWidth = isOpen ? OPEN_WIDTH : CLOSED_WIDTH;
        const maxX = window.innerWidth - currentWidth - PADDING;
        const maxY = window.innerHeight - MENU_HEIGHT - PADDING;

        const currentX = x.get();
        const currentY = y.get();

        const clampedX = Math.max(PADDING, Math.min(currentX, maxX));
        const clampedY = Math.max(PADDING, Math.min(currentY, maxY));

        if (currentX !== clampedX || currentY !== clampedY) {
            animate(x, clampedX, smoothSpring);
            animate(y, clampedY, smoothSpring);
        }
    }, [isOpen, x, y]);

    // Re-clamp on window resize
    useEffect(() => {
        const handleResize = () => clampPosition();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [clampPosition]);

    // Re-clamp when menu opens/closes (width changes)
    useEffect(() => {
        clampPosition();
    }, [isOpen, clampPosition]);

    const handleToggle = () => {
        // Only toggle if we didn't just finish dragging
        if (!hasDragged) {
            setIsOpen((prev) => !prev);
        }
        setHasDragged(false);
    };

    const handleDragStart = () => {
        setIsDragging(true);
        setHasDragged(false);
    };

    const handleDrag = () => {
        // Mark that actual dragging occurred
        setHasDragged(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        // Clamp to viewport after drag ends
        requestAnimationFrame(() => {
            clampPosition();
        });
    };

    const handleNavClick = (href: string) => {
        // Use the transition-aware navigation
        navigateWithTransition(href);
        setIsOpen(false);
    };


    // Animation duration based on preference
    const animDuration = prefersReducedMotion ? 0 : 0.35;

    return (
        <>
            {/* Invisible constraints container covering the viewport */}
            <div
                ref={constraintsRef}
                style={{
                    position: "fixed",
                    top: PADDING,
                    left: PADDING,
                    right: PADDING,
                    bottom: PADDING,
                    pointerEvents: "none",
                    zIndex: 999,
                }}
            />

            <motion.div
                ref={containerRef}
                className={styles.floatingContainer}
                drag
                dragMomentum={false}
                dragElastic={0.1}
                dragConstraints={constraintsRef}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                style={{
                    x,
                    y,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    cursor: isDragging ? "grabbing" : "grab",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={springConfig}
                role="navigation"
                aria-label="Main navigation menu"
            >
                <motion.div
                    className={`${styles.chopsticksButton} ${isOpen ? styles.open : ""}`}
                    onClick={handleToggle}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleToggle();
                        }
                        if (e.key === "Escape" && isOpen) {
                            setIsOpen(false);
                        }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    // Animate the container width
                    animate={{
                        width: isOpen ? OPEN_WIDTH : CLOSED_WIDTH,
                    }}
                    transition={{
                        duration: animDuration,
                        ease: [0.4, 0, 0.2, 1],
                    }}
                >
                    {/* Left Chopstick - only translates X, no rotation */}
                    <motion.div
                        className={styles.chopstick}
                        animate={{
                            x: isOpen ? -CHOPSTICK_SPREAD : 0,
                        }}
                        transition={{
                            duration: animDuration,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                    />

                    {/* Scroll Menu Container - clips content for reveal effect */}
                    <div className={styles.scrollWrapper}>
                        <motion.div
                            className={styles.scrollMenu}
                            animate={{
                                width: isOpen ? OPEN_WIDTH - 40 : 0,
                            }}
                            transition={{
                                duration: animDuration,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                        >
                            {/* Nav items always exist, just get revealed by the scroll width */}
                            <div className={styles.navItemsContainer}>
                                {navItems.map((item) => {
                                    const isActive =
                                        pathname === item.href ||
                                        pathname.startsWith(item.href + "/");

                                    return (
                                        <motion.button
                                            key={item.href}
                                            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isOpen) {
                                                    handleNavClick(item.href);
                                                }
                                            }}
                                            whileHover={prefersReducedMotion || !isOpen ? {} : { scale: 1.1 }}
                                            whileTap={prefersReducedMotion || !isOpen ? {} : { scale: 0.95 }}
                                            title={item.label}
                                            aria-label={item.label}
                                            aria-current={isActive ? "page" : undefined}
                                            tabIndex={isOpen ? 0 : -1}
                                        >
                                            {item.icon}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Chopstick - only translates X, no rotation */}
                    <motion.div
                        className={styles.chopstick}
                        animate={{
                            x: isOpen ? CHOPSTICK_SPREAD : 0,
                        }}
                        transition={{
                            duration: animDuration,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                    />
                </motion.div>
            </motion.div>
        </>
    );
}

export default FloatingChopsticksNav;
