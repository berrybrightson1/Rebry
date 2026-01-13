"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { GlassCard } from "../ui/GlassCard";
import { PillButton } from "../ui/PillButton";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

// Placeholder data for Web Apps
const projects = [
    {
        id: 1,
        title: "E-Commerce Dashboard",
        category: "Web App",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop", // Placeholder
        description: "A high-performance analytics dashboard for online retailers."
    },
    {
        id: 2,
        title: "AI Content Generator",
        category: "SaaS Platform",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2532&auto=format&fit=crop", // Placeholder
        description: "Next-generation content creation tool powered by LLMs."
    },
    {
        id: 3,
        title: "Fintech Mobile App",
        category: "Mobile Design",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop", // Placeholder
        description: "Secure and intuitive banking experience for the modern era."
    }
];

export function ProjectSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % projects.length);
        }, 3000); // 3 seconds for better readability than 2s

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center">

            {/* Tablet Frame */}
            <div className="relative w-full max-w-4xl aspect-[16/10] bg-black rounded-[2rem] border-[8px] border-neutral-800 shadow-2xl overflow-hidden ring-1 ring-white/10">

                {/* Screen Content */}
                <div className="relative w-full h-full bg-gray-900 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            {/* Background Image of Project */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${projects[currentIndex].image})` }}
                            >
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                            </div>

                            {/* Text Content Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                                <motion.span
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white mb-4 backdrop-blur-md"
                                >
                                    {projects[currentIndex].category}
                                </motion.span>
                                <motion.h3
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                                >
                                    {projects[currentIndex].title}
                                </motion.h3>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-gray-300 max-w-lg text-lg mb-8"
                                >
                                    {projects[currentIndex].description}
                                </motion.p>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <PillButton variant="glass" className="hover:bg-white/20">
                                        View Project <ArrowUpRight className="w-4 h-4 ml-2" />
                                    </PillButton>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Camera/Sensor Notch (Optional Detail) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20" />
            </div>

            {/* Slider Indicator */}
            <div className="flex gap-3 mt-8">
                {projects.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/20"
                            }`}
                    />
                ))}
            </div>

        </div>
    );
}
