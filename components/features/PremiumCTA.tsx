"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";

export function PremiumCTA() {
    return (
        <section className="py-2 md:py-8 w-full">
            <div className="w-full">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 text-center md:text-left">

                    {/* Subtle aesthetic glow */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight"
                        >
                            Ready to <span className="text-blue-200">scale up?</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-base md:text-lg text-gray-400 leading-relaxed font-light"
                        >
                            Stop guessing. Start building. Let's create the digital solution your business strictly deserves.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative z-10 flex-shrink-0 w-full md:w-auto"
                    >
                        <Link href="/request" className="block w-full md:w-auto">
                            <PillButton size="lg" className="w-full md:w-auto h-12 md:h-14 px-6 md:px-10 text-base md:text-lg bg-white text-black hover:bg-gray-200 border-none shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 font-semibold group justify-center whitespace-nowrap">
                                Start a Project Flow <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 text-black group-hover:translate-x-1 transition-transform" />
                            </PillButton>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
