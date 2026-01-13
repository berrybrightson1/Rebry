"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { PillButton } from "../ui/PillButton";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- DATA ---
const webApps = [
    {
        id: 1,
        title: "E-Commerce Dashboard",
        category: "Web App",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
        description: "A high-performance analytics dashboard for online retailers."
    },
    {
        id: 2,
        title: "AI Content Generator",
        category: "SaaS Platform",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2532&auto=format&fit=crop",
        description: "Next-generation content creation tool powered by LLMs."
    },
    {
        id: 3,
        title: "Fintech Mobile App",
        category: "Mobile Design",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
        description: "Secure and intuitive banking experience for the modern era."
    }
];

const graphics = [
    {
        id: 101,
        title: "Neon Brand Identity",
        category: "Branding",
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2500&auto=format&fit=crop",
        size: "large"
    },
    {
        id: 102,
        title: "Future Festival Poster",
        category: "Print Design",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2400&auto=format&fit=crop",
        size: "small"
    },
    {
        id: 103,
        title: "3D Cubist Abstract",
        category: "3D Art",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        size: "small"
    },
    {
        id: 104,
        title: "Editorial Layout",
        category: "Typography",
        image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=2500&auto=format&fit=crop",
        size: "large"
    }
];

export function ProjectGallery({ showFilter = true }: { showFilter?: boolean }) {
    const [activeTab, setActiveTab] = useState<"apps" | "graphics">("apps");

    return (
        <div className="w-full flex flex-col items-center gap-8">

            {/* 1. Category Switcher - Minimal Style */}
            {showFilter && (
                <div className="flex gap-2 items-center justify-center mb-4">
                    <span className="text-sm font-medium text-white/40 uppercase tracking-widest mr-4">Filter:</span>
                    <TabButton
                        isActive={activeTab === "apps"}
                        onClick={() => setActiveTab("apps")}
                        label="Web Apps"
                    />
                    <TabButton
                        isActive={activeTab === "graphics"}
                        onClick={() => setActiveTab("graphics")}
                        label="Graphic Design"
                    />
                </div>
            )}

            {/* 2. Content Area */}
            <div className="w-full relative min-h-auto md:min-h-[500px]">
                <AnimatePresence mode="wait">
                    {activeTab === "apps" ? (
                        <motion.div
                            key="apps"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <TabletSlider />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="graphics"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {graphics.map((item) => (
                                <GraphicCard key={item.id} item={item} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}

// --- SUB-COMPONENTS ---

function TabButton({ isActive, onClick, label }: { isActive: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative px-6 py-2 rounded-full text-sm font-semibold transition-colors z-10",
                isActive ? "text-black" : "text-white/60 hover:text-white"
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="active-gallery-tab"
                    className="absolute inset-0 bg-white rounded-full -z-10 shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            {label}
        </button>
    )
}

function TabletSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % webApps.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center">
            {/* Tablet Frame */}
            <div className="relative w-full max-w-4xl aspect-[16/10] bg-black rounded-[2rem] border-[8px] border-neutral-800 shadow-2xl overflow-hidden ring-1 ring-[var(--spatial-border)]">
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
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${webApps[currentIndex].image})` }}
                            >
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white mb-4 backdrop-blur-md">
                                    {webApps[currentIndex].category}
                                </span>
                                <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                    {webApps[currentIndex].title}
                                </h3>
                                <p className="text-gray-300 max-w-lg text-lg mb-8 line-clamp-2 md:line-clamp-none">
                                    {webApps[currentIndex].description}
                                </p>
                                <PillButton variant="glass" className="hover:bg-white/20">
                                    View Project <ArrowUpRight className="w-4 h-4 ml-2" />
                                </PillButton>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20" />
            </div>
            {/* Indicators */}
            <div className="flex gap-3 mt-8">
                {webApps.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/20"}`} />
                ))}
            </div>
        </div>
    );
}

function GraphicCard({ item }: { item: typeof graphics[0] }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm",
                item.size === "large" ? "md:row-span-2 aspect-[3/4]" : "aspect-[4/3]"
            )}
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-accent text-xs font-bold uppercase tracking-wider mb-2 block">{item.category}</span>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            </div>
        </motion.div>
    )
}
