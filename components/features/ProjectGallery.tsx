"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { featuredProjects, graphicDesignProjects, type StaticProject } from "@/data/static-projects";
import { PortfolioLightbox } from "@/components/features/PortfolioLightbox";

export type ProjectGalleryTab = "apps" | "graphics";

const graphicBentoClasses = [
    "col-span-2 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
];

export function ProjectGallery({
    showFilter = true,
    activeTab: controlledActiveTab,
    onTabChange,
}: {
    showFilter?: boolean;
    activeTab?: ProjectGalleryTab;
    onTabChange?: (tab: ProjectGalleryTab) => void;
}) {
    const [internalActiveTab, setInternalActiveTab] = useState<ProjectGalleryTab>("apps");
    const [selectedGraphicIndex, setSelectedGraphicIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const activeTab = controlledActiveTab ?? internalActiveTab;
    const setActiveTab = onTabChange ?? setInternalActiveTab;
    const filteredProjects = activeTab === "apps" ? featuredProjects : graphicDesignProjects;

    return (
        <div className="w-full flex flex-col items-center gap-8">
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

            <div className="w-full relative min-h-[500px]">
                {filteredProjects.length === 0 ? (
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
                            className={cn(
                                activeTab === "apps"
                                    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                                    : "grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-3 sm:block sm:columns-2 sm:gap-4 sm:space-y-4 lg:columns-3"
                            )}
                        >
                            {filteredProjects.map((item, index) => (
                                <ProjectCard
                                    key={item.id}
                                    item={item}
                                    variant={activeTab}
                                    bentoClass={activeTab === "graphics" ? graphicBentoClasses[index % graphicBentoClasses.length] : undefined}
                                    onGraphicClick={() => {
                                        setSelectedGraphicIndex(index);
                                        setLightboxOpen(true);
                                    }}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            <PortfolioLightbox
                items={graphicDesignProjects}
                currentIndex={selectedGraphicIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onSelect={setSelectedGraphicIndex}
            />
        </div>
    );
}

function ProjectCard({
    item,
    variant,
    bentoClass,
    onGraphicClick,
}: {
    item: StaticProject;
    variant: "apps" | "graphics";
    bentoClass?: string;
    onGraphicClick: () => void;
}) {
    if (variant === "graphics") {
        return (
            <motion.button
                type="button"
                onClick={onGraphicClick}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35 }}
                className={cn(
                    "relative group block h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:mb-4 sm:h-auto sm:break-inside-avoid",
                    bentoClass
                )}
                aria-label={`Preview ${item.title}`}
            >
                <div className="h-full overflow-hidden bg-black sm:h-auto">
                    <Image
                        src={item.image}
                        alt={`${item.title} artwork`}
                        width={1600}
                        height={1000}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-auto sm:object-contain"
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                <div className="absolute bottom-0 left-0 flex w-full items-end justify-between gap-2 p-3 sm:gap-4 sm:p-5">
                    <div className="min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-blue-200 sm:text-xs sm:font-bold">{item.category}</span>
                        <h3 className="line-clamp-2 text-xs font-semibold leading-tight text-white sm:text-xl sm:font-bold">{item.title}</h3>
                    </div>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-black transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
                        <ArrowUpRight className="w-3.5 h-3.5 sm:h-4 sm:w-4" />
                    </span>
                </div>
            </motion.button>
        );
    }

    return (
        <motion.a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.35 }}
            className="relative group mb-4 block break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={`Open ${item.title}`}
        >
            <div className={cn("overflow-hidden bg-black", variant === "apps" && "aspect-[16/10]")}>
                <Image
                    src={item.image}
                    alt={`${item.title} website screenshot`}
                    width={1600}
                    height={1000}
                    className={cn(
                        "w-full transition-transform duration-700 group-hover:scale-105",
                        variant === "apps" ? "h-full object-cover" : "h-auto object-contain"
                    )}
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
            <div className="absolute bottom-0 left-0 flex w-full items-end justify-between gap-4 p-5">
                <div className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wider text-blue-200">{item.category}</span>
                    <h3 className="truncate text-xl font-bold text-white">{item.title}</h3>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-black transition-transform group-hover:scale-105">
                    <ArrowUpRight className="w-4 h-4" />
                </span>
            </div>
        </motion.a>
    );
}
