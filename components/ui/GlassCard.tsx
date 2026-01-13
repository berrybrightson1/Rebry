"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    spotlight?: boolean;
}

export function GlassCard({ children, className, spotlight = true, ...props }: GlassCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current || !spotlight) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
        if (spotlight) setOpacity(1);
    };

    const handleMouseLeave = () => {
        if (spotlight) setOpacity(0);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "glass-panel rounded-3xl p-6 relative overflow-hidden group transition-colors duration-300",
                className
            )}
            {...props}
        >
            {spotlight && (
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 transform-gpu"
                    style={{
                        opacity,
                        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.15), transparent 40%)`,
                    }}
                />
            )}
            <div className="relative z-10">{children}</div>
        </motion.div >
    );
}
// Retrying GlassCard with proper spotlight logic in the main component
