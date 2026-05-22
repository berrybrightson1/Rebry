"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, Palette, Cpu, Layers, type LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PillButton } from "@/components/ui/PillButton";

export function HeroSection() {
    return (
        <GlassCard className="relative overflow-hidden w-full border-none shadow-none bg-transparent p-0">
            {/* Dynamic Background Mesh */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10 z-0" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse z-0" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
                {/* Left Column: Text & Buttons */}
                <div className="flex flex-col gap-6 max-w-xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-4">
                            Building Digital <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                                Masterpieces
                            </span>
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-300 leading-relaxed font-light max-w-lg"
                    >
                        Specialized in high-performance web platforms, mobile applications, and immersive UI experiences that define the future of interaction.
                    </motion.p>

                    {/* Buttons - Stacked Vertically on Mobile, Row on Desktop if needed, but keeping simple stack flow */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2"
                    >
                        <Link href="/request" className="w-full sm:w-auto group">
                            <PillButton size="lg" className="w-full sm:w-auto justify-center whitespace-nowrap bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all duration-500 border-none">
                                <span className="relative z-10 flex items-center">
                                    Get a Website Built <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </PillButton>
                        </Link>
                        <Link href="/projects" className="w-full sm:w-auto">
                            <PillButton variant="secondary" size="lg" className="w-full sm:w-auto justify-center bg-white/5 text-gray-300 hover:bg-white/10 border-white/10 hover:border-white/20 hover:text-white backdrop-blur-md">
                                View Work
                            </PillButton>
                        </Link>
                    </motion.div>
                </div>

                {/* Right Column: Animated Visual */}
                <div className="relative w-full md:w-auto flex items-center justify-center min-h-[300px] md:min-h-auto md:pr-10">

                    {/* Floating Orb Container */}
                    <div className="relative w-64 h-64">
                        {/* Central Glowing Core */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-accent/20 rounded-full blur-3xl"
                        />

                        {/* Orbiting Elements */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border border-white/10 border-dashed"
                        />

                        {/* Icons Floating */}
                        <FloatingIcon icon={Code2} delay={0} x={-60} y={-40} color="text-blue-400" />
                        <FloatingIcon icon={Palette} delay={1} x={60} y={-40} color="text-purple-400" />
                        <FloatingIcon icon={Cpu} delay={2} x={-40} y={60} color="text-pink-400" />
                        <FloatingIcon icon={Layers} delay={3} x={50} y={50} color="text-cyan-400" />

                        {/* Central Icon */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <div className="w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                <Code2 className="w-10 h-10 text-white" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}

function FloatingIcon({ icon: Icon, delay, x, y, color }: { icon: LucideIcon, delay: number, x: number, y: number, color: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 1,
                scale: 1,
                x: [x, x + 10, x],
                y: [y, y - 10, y]
            }}
            transition={{
                opacity: { duration: 0.5, delay },
                scale: { duration: 0.5, delay },
                x: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay * 2 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay * 1.5 }
            }}
            className="absolute left-1/2 top-1/2 -ml-6 -mt-6"
        >
            <div className={`w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-lg ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </motion.div>
    )
}
