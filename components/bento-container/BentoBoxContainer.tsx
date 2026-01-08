"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useBoxTheme } from "@/lib/box-theme-context";
import { useNavigationTransition } from "@/lib/navigation-transition-context";
import styles from "./bento-container.module.css";

// Animation timing constants
const LID_CLOSE_DURATION = 0.3; // 300ms
const LID_OPEN_DURATION = 0.3; // 300ms

// ============================================
// COMPONENT
// ============================================

interface BentoBoxContainerProps {
    children: React.ReactNode;
}

export function BentoBoxContainer({ children }: BentoBoxContainerProps) {
    const prefersReducedMotion = useReducedMotion();
    const { selectedDesign } = useBoxTheme();
    const { phase, onLidClosed, onLidOpened } = useNavigationTransition();

    // Get box and lid components from selected design
    const BoxComponent = selectedDesign.BoxComponent;
    const LidComponent = selectedDesign.LidComponent;

    // Track phase for callbacks
    const phaseRef = useRef(phase);
    phaseRef.current = phase;

    // ============================================
    // ANIMATION HANDLERS
    // ============================================

    const handleLidCloseComplete = useCallback(() => {
        if (phaseRef.current === "closing") {
            console.log('[BentoBox] Lid close animation complete');
            onLidClosed();
        }
    }, [onLidClosed]);

    const handleLidOpenComplete = useCallback(() => {
        if (phaseRef.current === "opening") {
            console.log('[BentoBox] Lid open animation complete');
            onLidOpened();
        }
    }, [onLidOpened]);

    // ============================================
    // LID ANIMATION VARIANTS
    // ============================================

    const lidVariants = {
        hidden: {
            y: "-100%",
            opacity: 0,
        },
        visible: {
            y: "0%",
            opacity: 1,
        },
    };

    // Show lid during closing, navigating, and opening phases
    const shouldShowLid = phase !== "idle";

    // Animate to visible during closing/navigating, to hidden during opening
    const lidAnimateState = phase === "opening" ? "hidden" : "visible";

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className={styles.bentoContainer}>
            <div className={styles.bentoContainerInner}>
                <BoxComponent>
                    {/* Content Area - always shows current children */}
                    {/* The navigation is delayed until lid is closed, so this always shows the right content */}
                    <div style={{ height: "100%" }}>
                        {children}
                    </div>
                </BoxComponent>

                {/* Lid Component with Animation */}
                {shouldShowLid && (
                    <motion.div
                        key="bento-lid" // Stable key to prevent remount issues
                        className={styles.lidWrapper}
                        // Start visible if we're in navigating phase (lid is already closed)
                        // Start hidden only during initial closing phase
                        initial={phase === "closing" ? "hidden" : "visible"}
                        animate={lidAnimateState}
                        variants={lidVariants}
                        transition={{
                            duration: prefersReducedMotion ? 0 :
                                (phase === "closing" ? LID_CLOSE_DURATION : LID_OPEN_DURATION),
                            ease: "easeInOut",
                        }}
                        onAnimationComplete={(definition) => {
                            console.log('[BentoBox] Animation complete:', definition, 'phase:', phaseRef.current);
                            if (definition === "visible" && phaseRef.current === "closing") {
                                handleLidCloseComplete();
                            } else if (definition === "hidden" && phaseRef.current === "opening") {
                                handleLidOpenComplete();
                            }
                        }}
                    >
                        <LidComponent />
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default BentoBoxContainer;
