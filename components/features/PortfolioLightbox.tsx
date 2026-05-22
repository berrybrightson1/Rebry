"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { type StaticProject } from "@/data/static-projects";
import { cn } from "@/lib/utils";

interface PortfolioLightboxProps {
    items: StaticProject[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onSelect: (index: number) => void;
}

export function PortfolioLightbox({ items, currentIndex, isOpen, onClose, onSelect }: PortfolioLightboxProps) {
    const currentItem = items[currentIndex];
    const hasMultiple = items.length > 1;

    const showNext = useCallback(() => {
        onSelect((currentIndex + 1) % items.length);
    }, [currentIndex, items.length, onSelect]);

    const showPrev = useCallback(() => {
        onSelect((currentIndex - 1 + items.length) % items.length);
    }, [currentIndex, items.length, onSelect]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
            if (event.key === "ArrowRight" && hasMultiple) showNext();
            if (event.key === "ArrowLeft" && hasMultiple) showPrev();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [hasMultiple, isOpen, onClose, showNext, showPrev]);

    if (!currentItem) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-xl"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${currentItem.title} preview`}
                >
                    <div className="absolute inset-0 flex flex-col p-4 md:p-6">
                        <div className="flex items-center justify-between gap-4 pb-4">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                                    {currentItem.category}
                                </p>
                                <h2 className="truncate text-xl font-bold text-white md:text-2xl">
                                    {currentItem.title}
                                </h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={currentItem.image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-white hover:text-black"
                                    aria-label="Open full image"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white text-black transition-transform hover:scale-105"
                                    aria-label="Close preview"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="relative flex min-h-0 flex-1 items-center justify-center" onClick={(event) => event.stopPropagation()}>
                            {hasMultiple && (
                                <button
                                    type="button"
                                    onClick={showPrev}
                                    className="absolute left-0 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black md:left-2"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                            )}

                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={currentItem.id}
                                    initial={{ opacity: 0, scale: 0.97, y: 16 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.97, y: -16 }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative h-full w-full"
                                >
                                    <Image
                                        src={currentItem.image}
                                        alt={`${currentItem.title} artwork`}
                                        fill
                                        sizes="100vw"
                                        className="object-contain"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {hasMultiple && (
                                <button
                                    type="button"
                                    onClick={showNext}
                                    className="absolute right-0 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black md:right-2"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            )}
                        </div>

                        {hasMultiple && (
                            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide" onClick={(event) => event.stopPropagation()}>
                                {items.map((item, index) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => onSelect(index)}
                                        className={cn(
                                            "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white/5 transition-all md:h-20 md:w-20",
                                            index === currentIndex
                                                ? "border-white opacity-100"
                                                : "border-white/10 opacity-45 hover:opacity-85"
                                        )}
                                        aria-label={`Show ${item.title}`}
                                    >
                                        <Image
                                            src={item.image}
                                            alt=""
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
