
"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface PillButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "glass";
    size?: "sm" | "md" | "lg";
}

export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-accent text-white hover:bg-accent/90 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-transparent",
            secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
            glass: "glass-button text-white hover:bg-white/10",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        };

        return (
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                ref={ref}
                className={cn(
                    "rounded-full font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

PillButton.displayName = "PillButton";
