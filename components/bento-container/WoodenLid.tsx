"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LidProps } from "@/lib/box-designs";
import styles from "./bento-container.module.css";

/**
 * WoodenLid - Matching wooden lid for the default bento box
 * Animates to cover/uncover the box during navigation transitions
 */
export const WoodenLid: React.FC<LidProps> = ({ className, style }) => {
    return (
        <motion.div
            className={`${styles.woodenLid} ${className || ""}`}
            style={style}
        >
            {/* Lid surface with wood grain */}
            <div className={styles.lidSurface}>
                {/* Central handle/grip */}
                <div className={styles.lidHandle} aria-hidden="true">
                    <div className={styles.lidHandleInner} />
                </div>
            </div>

            {/* Lid edge shadow for depth */}
            <div className={styles.lidEdge} aria-hidden="true" />

            {/* Wood grain texture overlay */}
            <div className={styles.woodGrainOverlay} aria-hidden="true" />
        </motion.div>
    );
};

export default WoodenLid;
