'use client';

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    type?: "error" | "success" | "info" | "warning";
}

export function AlertModal({ isOpen, onClose, onConfirm, title, message, type = "error" }: AlertModalProps) {
    useEffect(() => {
        if (isOpen && !onConfirm) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose, onConfirm]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="pointer-events-auto"
                    >
                        <GlassCard className="pl-2 pr-3 md:pr-6 py-2 bg-[#1A1A1A] border-white/5 shadow-2xl rounded-[20px] md:rounded-full w-full max-w-[92vw] md:max-w-fit md:min-w-[320px] mx-auto ring-1 ring-white/5">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${type === 'error' ? 'bg-[#3A1D1D] text-[#FF4545]' :
                                    type === 'success' ? 'bg-[#1D3A24] text-[#45FF6E]' :
                                        type === 'warning' ? 'bg-[#3A2E1D] text-[#FFB845]' :
                                            'bg-[#1D263A] text-[#4589FF]'
                                    }`}>
                                    <AlertCircle className="w-5 h-5 stroke-[2.5px]" />
                                </div>

                                <div className="flex-1 text-left flex flex-col justify-center min-w-0">
                                    <h3 className="text-[14px] md:text-[15px] font-extrabold text-white leading-tight tracking-tight">{title}</h3>
                                    <p className="text-[12px] md:text-[13px] text-gray-400 mt-0.5 md:mt-1 leading-tight font-medium">{message}</p>
                                </div>

                                {onConfirm && (
                                    <div className="flex items-center gap-1 md:gap-2 pl-2 md:pl-4 border-l border-white/10 shrink-0">
                                        <button
                                            onClick={onClose}
                                            className="px-2 md:px-3 py-1 text-[11px] md:text-xs font-medium text-gray-400 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={onConfirm}
                                            className="px-3 md:px-3 py-1.5 md:py-1 text-[11px] md:text-xs font-bold bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
