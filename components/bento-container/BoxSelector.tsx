"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { useBoxTheme } from "@/lib/box-theme-context";
import type { BentoBoxDesign } from "@/lib/box-designs";
import styles from "./box-selector.module.css";

interface BoxDesignInfo {
    id: string;
    name: string;
    description: string;
    previewColor: string;
    unlockRequirement?: {
        type: string;
        value: string | number;
        description: string;
    };
}

export const BoxSelector: React.FC = () => {
    const { selectedDesign, allDesigns, unlockedDesignIds, setSelectedDesign, isLoading } = useBoxTheme();
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const isUnlocked = (designId: string) => unlockedDesignIds.includes(designId);
    const isSelected = (designId: string) => selectedDesign.id === designId;

    const handleSelect = (design: BentoBoxDesign) => {
        if (isUnlocked(design.id) && !isSelected(design.id)) {
            setSelectedDesign(design.id);
        }
    };

    return (
        <div className={styles.boxSelectorContainer}>
            <h3 className={styles.sectionTitle}>Bento Box Style</h3>
            <p className={styles.sectionDescription}>
                Choose your bento box design. Unlock more by completing focus sessions!
            </p>

            <div className={styles.designGrid}>
                {allDesigns.map((design, index) => {
                    const unlocked = isUnlocked(design.id);
                    const selected = isSelected(design.id);

                    return (
                        <motion.button
                            key={design.id}
                            className={`${styles.designCard} ${selected ? styles.selected : ""} ${!unlocked ? styles.locked : ""}`}
                            onClick={() => handleSelect(design)}
                            disabled={!unlocked || isLoading}
                            onMouseEnter={() => setHoveredId(design.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            whileHover={unlocked ? { scale: 1.02 } : undefined}
                            whileTap={unlocked ? { scale: 0.98 } : undefined}
                        >
                            {/* Color Preview */}
                            <div
                                className={styles.colorPreview}
                                style={{ backgroundColor: design.previewColor }}
                            >
                                {/* Selected indicator */}
                                {selected && (
                                    <motion.div
                                        className={styles.selectedIndicator}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                    >
                                        <Check size={20} strokeWidth={3} />
                                    </motion.div>
                                )}

                                {/* Lock overlay */}
                                {!unlocked && (
                                    <div className={styles.lockOverlay}>
                                        <Lock size={24} />
                                    </div>
                                )}
                            </div>

                            {/* Design info */}
                            <div className={styles.designInfo}>
                                <span className={styles.designName}>{design.name}</span>
                                {!unlocked && design.unlockRequirement && (
                                    <span className={styles.unlockHint}>
                                        {design.unlockRequirement.description}
                                    </span>
                                )}
                                {unlocked && !selected && (
                                    <span className={styles.selectHint}>Click to select</span>
                                )}
                                {selected && (
                                    <span className={styles.activeLabel}>Active</span>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {isLoading && (
                <div className={styles.savingIndicator}>
                    Saving...
                </div>
            )}
        </div>
    );
};

export default BoxSelector;
