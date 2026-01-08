"use client";

import React from "react";
import { motion } from "framer-motion";
import type { BoxProps } from "@/lib/box-designs";
import styles from "./bento-container.module.css";

/**
 * WoodenBox - Default bento box design (top-down view)
 * A warm, traditional wooden bento box with natural wood grain appearance
 */
export const WoodenBox: React.FC<BoxProps> = ({ children, className, style }) => {
    return (
        <motion.div
            className={`${styles.woodenBox} ${className || ""}`}
            style={style}
            layout
        >
            {/* Inner content area */}
            <div className={styles.woodenBoxInner}>
                {children}
            </div>

            {/* Wood grain texture overlay */}
            <div className={styles.woodGrainOverlay} aria-hidden="true" />

            {/* Corner details for bento box aesthetic */}
            <div className={styles.boxCorner} data-position="top-left" aria-hidden="true" />
            <div className={styles.boxCorner} data-position="top-right" aria-hidden="true" />
            <div className={styles.boxCorner} data-position="bottom-left" aria-hidden="true" />
            <div className={styles.boxCorner} data-position="bottom-right" aria-hidden="true" />
        </motion.div>
    );
};

export default WoodenBox;
