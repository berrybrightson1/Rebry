"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    images?: string[]; // Array of images to cycle through
    imageSrc?: string; // Fallback or initial image
    title?: string;
    category?: string;
    // External navigation handles (for navigating BETWEEN projects) - REMOVED, not needed
    onNextProject?: () => void;
    onPrevProject?: () => void;
    projectUrl?: string;
}

export function Lightbox({ isOpen, onClose, images = [], imageSrc, title, category, projectUrl }: LightboxProps) {

    // Internal state for cycling through the PROJECT'S images (if multiple)
    const [internalIndex, setInternalIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Combine prop imageSrc with images array if needed, or use images array
    // We want a robust list.
    const displayImages = images.length > 0 ? images : (imageSrc ? [imageSrc] : []);

    useEffect(() => {
        setInternalIndex(0); // Reset when project changes
    }, [title]); // Assuming title changes with project

    // Auto-slide logic for internal images
    useEffect(() => {
        if (displayImages.length <= 1 || isPaused) return;

        const timer = setInterval(() => {
            setInternalIndex((prev) => (prev + 1) % displayImages.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [displayImages.length, isPaused]);

    // Lock scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const currentImage = displayImages[internalIndex];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
                onClick={onClose}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    aria-label="Close lightbox"
                >
                    <X className="w-6 h-6" />
                </button>

                <div
                    className="relative w-full max-w-6xl max-h-full flex flex-col items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                    // Pause Interactions
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImage} // Key change triggers animation
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            src={currentImage}
                            alt={title || "Project Image"}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
                        />
                    </AnimatePresence>


                    {(title || category) && (
                        <div className="mt-4 text-center">
                            {category && (
                                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-gray-300 mb-2 border border-white/5">
                                    {category}
                                </span>
                            )}
                            {title && <h3 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h3>}

                            {projectUrl && (
                                <a
                                    href={projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-wider shadow-xl shadow-white/5"
                                >
                                    View Project <ChevronRight className="w-4 h-4" />
                                </a>
                            )}

                            {displayImages.length > 1 && (
                                <div className="flex gap-2 justify-center mt-2">
                                    {displayImages.map((_, idx) => (
                                        <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === internalIndex ? "w-6 bg-white" : "w-1.5 bg-white/30"}`} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Internal Image Navigation (Small arrows on image for gallery cycling) */}
                    {displayImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setInternalIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/70 hover:bg-black/90 rounded-full text-white backdrop-blur-sm transition-colors z-10"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setInternalIndex((prev) => (prev + 1) % displayImages.length);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/70 hover:bg-black/90 rounded-full text-white backdrop-blur-sm transition-colors z-10"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
