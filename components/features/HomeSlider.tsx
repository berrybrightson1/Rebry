"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { featuredProjects } from "@/data/static-projects";

const slideDurationMs = 2000;

export function HomeSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentProject = featuredProjects[currentIndex];

    useEffect(() => {
        if (featuredProjects.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
        }, slideDurationMs);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="relative w-full max-w-4xl aspect-[16/10] bg-black rounded-[2rem] border-[8px] border-black shadow-2xl overflow-hidden ring-1 ring-white/15">
                <div className="relative w-full h-full bg-gray-950 overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.a
                            key={currentProject.id}
                            href={currentProject.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ x: "7%", opacity: 0, scale: 1.015, filter: "blur(8px)" }}
                            animate={{ x: "0%", opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ x: "-7%", opacity: 0, scale: 0.985, filter: "blur(8px)" }}
                            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                            aria-label={`Open ${currentProject.title}`}
                        >
                            <motion.div
                                className="absolute inset-0"
                                initial={{ scale: 1.04 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Image
                                    src={currentProject.image}
                                    alt={`${currentProject.title} website screenshot`}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 896px"
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>

                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.58)_73%,rgba(0,0,0,0.96)_100%)]" />
                            <div className="absolute inset-x-0 bottom-[12%] z-10 flex flex-col items-center px-5 text-center sm:bottom-[13%] md:bottom-[14%]">
                                <motion.h3
                                    initial={{ y: 24, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                                    className="max-w-[92%] text-balance text-[clamp(1.8rem,4.8vw,3.65rem)] font-bold uppercase leading-[0.95] tracking-normal text-white drop-shadow-[0_12px_32px_rgba(0,0,0,0.7)]"
                                >
                                    {currentProject.title}
                                </motion.h3>
                                <motion.span
                                    initial={{ y: 18, opacity: 0, scale: 0.92 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.22, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                    className="mt-5 grid h-12 w-12 place-items-center rounded-full bg-white text-black shadow-[0_14px_35px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14"
                                    aria-hidden="true"
                                >
                                    <ArrowUpRight className="h-6 w-6 sm:h-7 sm:w-7" />
                                </motion.span>
                            </div>
                        </motion.a>
                    </AnimatePresence>
                </div>

                <div className="absolute top-0 left-1/2 z-20 h-7 w-32 -translate-x-1/2 rounded-b-xl border-x border-b border-black/70 bg-black pointer-events-none" />
            </div>

            {featuredProjects.length > 1 && (
                <div className="flex gap-3 mt-8" aria-label="Featured project slides">
                    {featuredProjects.map((project, idx) => (
                        <button
                            key={project.id}
                            type="button"
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/20 hover:bg-white/40"}`}
                            aria-label={`Show ${project.title}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
