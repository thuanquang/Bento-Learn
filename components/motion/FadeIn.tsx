"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { fadeInUp, usePrefersReducedMotion } from "@/lib/motion";
import { ReactNode } from "react";

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: ReactNode;
    delay?: number;
    duration?: number;
    y?: number;
}

export function FadeIn({
    children,
    delay = 0,
    duration = 0.4,
    y = 20,
    ...props
}: FadeInProps) {
    const prefersReducedMotion = usePrefersReducedMotion();

    if (prefersReducedMotion) {
        return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay, ease: "easeOut" }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default FadeIn;
