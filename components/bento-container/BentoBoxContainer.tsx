"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useBoxThemeOptional } from "@/lib/box-theme-context";
import { getDefaultDesign } from "@/lib/box-designs";
import styles from "./bento-container.module.css";

// ============================================
// TYPES
// ============================================

interface BentoBoxContainerProps {
    children: React.ReactNode;
}

// ============================================
// COMPONENT
// ============================================

export const BentoBoxContainer: React.FC<BentoBoxContainerProps> = ({ children }) => {
    const pathname = usePathname();
    const prevPathname = useRef(pathname);
    const prefersReducedMotion = useReducedMotion();
    const isFirstRender = useRef(true);

    // Get box theme context (may be null if no provider)
    const boxTheme = useBoxThemeOptional();
    const selectedDesign = boxTheme?.selectedDesign || getDefaultDesign();

    // Lid animation state: "hidden" | "closing" | "closed" | "opening"
    const [lidState, setLidState] = useState<"hidden" | "closing" | "closed" | "opening">("hidden");

    // Get the box and lid components
    const BoxComponent = selectedDesign.BoxComponent;
    const LidComponent = selectedDesign.LidComponent;

    // ============================================
    // NAVIGATION DETECTION & ANIMATION
    // ============================================

    useEffect(() => {
        // Skip animation on first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Detect pathname change
        if (pathname !== prevPathname.current) {
            prevPathname.current = pathname;

            if (prefersReducedMotion) {
                // Skip animation for reduced motion preference
                return;
            }

            // Start closing animation
            setLidState("closing");
        }
    }, [pathname, prefersReducedMotion]);

    // Handle animation completion callbacks
    const handleLidAnimationComplete = (definition: string) => {
        if (definition === "closed") {
            // Lid finished closing, now open it
            setTimeout(() => {
                setLidState("opening");
            }, 100); // Brief pause before opening
        } else if (definition === "hidden") {
            // Lid finished opening (returned to hidden)
            setLidState("hidden");
        }
    };

    // ============================================
    // RENDER
    // ============================================

    const showLid = lidState !== "hidden";

    return (
        <div className={styles.bentoContainer}>
            <div className={styles.bentoContainerInner}>
                {/* The Bento Box */}
                <BoxComponent>
                    {/* Content - no AnimatePresence, lid handles transition */}
                    {children}
                </BoxComponent>

                {/* The Lid (animated on navigation) */}
                <AnimatePresence>
                    {showLid && (
                        <motion.div
                            key="lid"
                            initial={{ y: "-100%", opacity: 0 }}
                            animate={
                                lidState === "closing" || lidState === "closed"
                                    ? { y: "0%", opacity: 1 }
                                    : { y: "-100%", opacity: 0 }
                            }
                            exit={{ y: "-100%", opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: lidState === "closing" ? "easeOut" : "easeIn"
                            }}
                            onAnimationComplete={() => {
                                if (lidState === "closing") {
                                    handleLidAnimationComplete("closed");
                                } else if (lidState === "opening") {
                                    handleLidAnimationComplete("hidden");
                                }
                            }}
                            style={{
                                position: "absolute",
                                inset: 0,
                                zIndex: 100,
                            }}
                        >
                            <LidComponent />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BentoBoxContainer;
