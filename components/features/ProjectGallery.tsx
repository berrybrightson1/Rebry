"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { PillButton } from "../ui/PillButton";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- DATA ---
import { Lightbox } from "../ui/Lightbox";
import { getProjectsAction } from "@/app/actions/projects";

interface Project {
    id: string;
    title: string;
    category: string;
    image_url: string;
    width: number;
    height: number;
    description?: string;
    gallery?: string[];
    project_url?: string;
}

// Fallback data (optional, can be empty)
const webApps: Project[] = [];
const graphics: Project[] = [];


export function ProjectGallery({ showFilter = true }: { showFilter?: boolean }) {
    const [activeTab, setActiveTab] = useState<"apps" | "graphics">("apps");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

    useEffect(() => {
        async function loadProjects() {
            setLoading(true);
            const result = await getProjectsAction();
            if (result.success && result.data) {
                setProjects(result.data as Project[]);
            }
            setLoading(false);
        }
        loadProjects();
    }, []);

    // Filter projects based on active tab
    // We'll treat "Web App" & "Mobile App" as 'apps'
    // Everything else as 'graphics'
    const filteredProjects = projects.filter(p => {
        if (activeTab === 'apps') {
            return p.category === 'Web App' || p.category === 'Mobile App';
        } else {
            return p.category !== 'Web App' && p.category !== 'Mobile App';
        }
    });

    const openLightbox = (index: number) => {
        setSelectedProjectIndex(index);
        setLightboxOpen(true);
    };

    const handleNext = () => {
        setSelectedProjectIndex((prev) => (prev + 1) % filteredProjects.length);
    };

    const handlePrev = () => {
        setSelectedProjectIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
    };

    const currentProject = filteredProjects[selectedProjectIndex];

    return (
        <div className="w-full flex flex-col items-center gap-8">

            {/* 1. Category Switcher */}
            {showFilter && (
                <div className="flex gap-2 items-center justify-center mb-4 flex-wrap">
                    <span className="text-sm font-medium text-white/40 uppercase tracking-widest mr-2 md:mr-4">Filter:</span>
                    <button
                        onClick={() => setActiveTab("apps")}
                        className={cn(
                            "px-3 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === "apps"
                                ? "bg-white text-black"
                                : "bg-white/10 text-white hover:bg-white/20"
                        )}
                    >
                        Web & Mobile
                    </button>
                    <button
                        onClick={() => setActiveTab("graphics")}
                        className={cn(
                            "px-3 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === "graphics"
                                ? "bg-white text-black"
                                : "bg-white/10 text-white hover:bg-white/20"
                        )}
                    >
                        Graphic Design
                    </button>
                </div>
            )}

            {/* 2. Content Area */}
            <div className="w-full relative min-h-[500px]">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                        <h3 className="text-gray-400">No projects found in this category.</h3>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
                        >
                            {filteredProjects.map((item, index) => (
                                <div key={item.id} className="break-inside-avoid">
                                    <GraphicCard
                                        item={item}
                                        onClick={() => openLightbox(index)}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

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
                    onNextProject={handleNext}
                    onPrevProject={handlePrev}
                />
            )}
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



// Reusing GraphicCard for all items now for consistency in Masonry
function GraphicCard({ item, onClick }: { item: Project, onClick: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer"
            onClick={onClick}
        >
            <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-accent text-xs font-bold uppercase tracking-wider mb-2 block">{item.category}</span>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            </div>

            {/* Hover Icon */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-full backdrop-blur-md">
                <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
        </motion.div>
    )
}

