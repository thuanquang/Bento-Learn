"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { staggerContainer, staggerItem, staggerItemScale, usePrefersReducedMotion } from "@/lib/motion";
import { ReactNode } from "react";

interface StaggerContainerProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: ReactNode;
    staggerDelay?: number;
    initialDelay?: number;
}

export function StaggerContainer({
    children,
    staggerDelay = 0.08,
    initialDelay = 0.1,
    ...props
}: StaggerContainerProps) {
    const prefersReducedMotion = usePrefersReducedMotion();

    if (prefersReducedMotion) {
        return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: initialDelay,
                    },
                },
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: ReactNode;
    scale?: boolean;
}

export function StaggerItem({ children, scale = false, ...props }: StaggerItemProps) {
    const prefersReducedMotion = usePrefersReducedMotion();

    if (prefersReducedMotion) {
        return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
    }

    return (
        <motion.div
            variants={scale ? staggerItemScale : staggerItem}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default StaggerContainer;
