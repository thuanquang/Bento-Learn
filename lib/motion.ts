"use client";

// Shared Framer Motion configuration and utilities
import { Variants, Transition } from "framer-motion";
import { useEffect, useState } from "react";

// Spring Transitions
export const springTransition: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
};

export const gentleSpring: Transition = {
    type: "spring",
    stiffness: 200,
    damping: 25,
};

export const snappySpring: Transition = {
    type: "spring",
    stiffness: 400,
    damping: 35,
};

// Fade In Variants
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 }
    },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: springTransition
    },
};

// Stagger Container Variants
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" }
    },
};

export const staggerItemScale: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: springTransition
    },
};

// Interactive Variants
export const tapScale = {
    whileTap: { scale: 0.97 },
    transition: springTransition,
};

export const hoverLift = {
    whileHover: { y: -2 },
    transition: gentleSpring,
};

// Tab Content Variants
export const tabContentVariants: Variants = {
    hidden: { opacity: 0, x: 10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.2 }
    },
    exit: {
        opacity: 0,
        x: -10,
        transition: { duration: 0.15 }
    },
};

// Modal Variants
export const modalOverlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContentVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: springTransition
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.15 }
    },
};

// Celebration Variants
export const celebrationBounce: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 15,
        }
    },
};

export const countUp: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    },
};

// Reduced Motion Hook
export function usePrefersReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return prefersReducedMotion;
}

// Utility to disable animations when reduced motion is preferred
export function getMotionProps(
    prefersReducedMotion: boolean,
    variants: Variants
): { variants?: Variants; initial?: string; animate?: string } {
    if (prefersReducedMotion) {
        return {};
    }
    return {
        variants,
        initial: "hidden",
        animate: "visible",
    };
}
