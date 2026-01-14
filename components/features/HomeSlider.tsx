"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { PillButton } from "../ui/PillButton";
import { ArrowUpRight } from "lucide-react";
import { getProjectsAction } from "@/app/actions/projects";
import { Lightbox } from "../ui/Lightbox";

interface Project {
    id: string;
    title: string;
    category: string;
    image_url: string;
    description?: string;
    gallery?: string[];
    project_url?: string;
}

export function HomeSlider() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    useEffect(() => {
        async function fetchWebApps() {
            setLoading(true);
            const result = await getProjectsAction();
            if (result.success && result.data) {
                // Filter Web Apps and Mobile Apps for the slider
                const webApps = (result.data as Project[]).filter(p => p.category === 'Web App' || p.category === 'Mobile App');
                setProjects(webApps);
            }
            setLoading(false);
        }
        fetchWebApps();
    }, []);

    useEffect(() => {
        // Only auto-slide if lightbox is NOT open
        if (projects.length <= 1 || lightboxOpen) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % projects.length);
        }, 2000); // 2 seconds per slide
        return () => clearInterval(timer);
    }, [projects.length, lightboxOpen]);

    if (loading) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full bg-transparent" />
            </div>
        );
    }

    if (projects.length === 0) {
        // Fallback or Empty State - keeping the tablet frame for structure
        return (
            <div className="w-full flex flex-col items-center justify-center">
                <div className="relative w-full max-w-4xl aspect-[16/10] bg-black rounded-[2rem] border-[8px] border-neutral-800 shadow-2xl overflow-hidden ring-1 ring-[var(--spatial-border)] flex items-center justify-center">
                    <p className="text-gray-500">No Web Apps to display yet.</p>
                </div>
            </div>
        )
    }

    const currentProject = projects[currentIndex];

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
                            className="absolute inset-0 cursor-pointer"
                            onClick={() => setLightboxOpen(true)}
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${currentProject.image_url})` }}
                            >
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white mb-4 backdrop-blur-md">
                                    {currentProject.category}
                                </span>
                                <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                    {currentProject.title}
                                </h3>
                                {/* Description is optional/might be missing in DB, so we conditionally render or just omit if clean */}
                                {currentProject.description && (
                                    <p className="text-gray-300 max-w-lg text-lg mb-8 line-clamp-2 md:line-clamp-none">
                                        {currentProject.description}
                                    </p>
                                )}

                                <PillButton variant="glass" className="hover:bg-white/20 mt-4">
                                    View Project <ArrowUpRight className="w-4 h-4 ml-2" />
                                </PillButton>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-xl z-50 pointer-events-none border-b border-x border-neutral-800/50" />
            </div>

            {/* Indicators */}
            {projects.length > 1 && (
                <div className="flex gap-3 mt-8">
                    {projects.map((_, idx) => (
                        <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/20"}`} />
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {currentProject && (
                <Lightbox
                    isOpen={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                    imageSrc={currentProject.image_url}
                    images={currentProject.gallery}
                    title={currentProject.title}
                    category={currentProject.category}
                    projectUrl={currentProject.project_url}
                    onNextProject={() => setCurrentIndex((prev) => (prev + 1) % projects.length)}
                    onPrevProject={() => setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)}
                />
            )}
        </div>
    );
}
