"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { PillButton } from "@/components/ui/PillButton";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2, Layers, Smartphone } from "lucide-react";

const projects = [
    {
        id: 1,
        title: "GES Syllabus App",
        category: "Mobile • Education",
        description: "A comprehensive syllabus app for the Ghana Education Service. Offline access, real-time updates.",
        icon: <Smartphone className="w-6 h-6 text-blue-400" />,
        tech: ["React Native", "Firebase", "Offline-First"],
        span: "col-span-1 md:col-span-2",
    },
    {
        id: 2,
        title: "Rebry E-Commerce",
        category: "Web • Retail",
        description: "High-performance fashion store with 3D product previews and AI recommendations.",
        icon: <Layers className="w-6 h-6 text-purple-400" />,
        tech: ["Next.js", "Shopify", "WebGL"],
        span: "col-span-1",
    },
    {
        id: 3,
        title: "FinTrack Dashboard",
        category: "SaaS • Finance",
        description: "Real-time financial analytics dashboard for small businesses.",
        icon: <Code2 className="w-6 h-6 text-emerald-400" />,
        tech: ["TypeScript", "D3.js", "Supabase"],
        span: "col-span-1",
    },
    {
        id: 4,
        title: "Agency Portfolio",
        category: "Web • Design",
        description: "You are looking at it. Dark Spatial UI with focus on performance.",
        icon: <ArrowUpRight className="w-6 h-6 text-white" />,
        tech: ["Next.js 15", "Tailwind 4", "Framer Motion"],
        span: "col-span-1 md:col-span-2",
    },
];

export function ProjectGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            {projects.map((project, i) => (
                <GlassCard
                    key={project.id}
                    className={`hover:border-accent/50 transition-colors cursor-pointer group/card flex flex-col justify-between h-full min-h-[250px] ${project.span}`}
                    spotlight={true}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white/5 rounded-xl backdrop-blur-md border border-white/10 group-hover/card:bg-accent/20 transition-colors">
                            {project.icon}
                        </div>
                        <PillButton variant="glass" size="sm" className="opacity-0 group-hover/card:opacity-100 transition-opacity">
                            <ArrowUpRight className="w-4 h-4" />
                        </PillButton>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                        <p className="text-gray-300 text-sm mb-4">{project.category}</p>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {project.tech.map(t => (
                                <span key={t} className="text-xs px-2 py-1 bg-black/5 border border-black/5 rounded-full text-gray-600 font-medium">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
