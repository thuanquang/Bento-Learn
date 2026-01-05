"use client";

import { motion } from "framer-motion";
import { springTransition, usePrefersReducedMotion } from "@/lib/motion";
import { ReactNode, CSSProperties } from "react";

interface TapScaleProps {
    children: ReactNode;
    scale?: number;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
}

export function TapScale({
    children,
    scale = 0.97,
    className,
    style,
    onClick,
}: TapScaleProps) {
    const prefersReducedMotion = usePrefersReducedMotion();

    if (prefersReducedMotion) {
        return (
            <div className={className} style={style} onClick={onClick}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            whileTap={{ scale }}
            transition={springTransition}
            className={className}
            style={style}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}

export default TapScale;
