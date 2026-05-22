"use client";

import { useState } from "react";
import { ProjectGallery, type ProjectGalleryTab } from "@/components/features/ProjectGallery";

const pageCopy: Record<ProjectGalleryTab, { title: string; description: string }> = {
    apps: {
        title: "Websites & Apps",
        description: "Live websites, ecommerce storefronts, dashboards, and digital product interfaces built for real businesses.",
    },
    graphics: {
        title: "Graphic Design",
        description: "Campaign flyers, social media creatives, product visuals, and brand artwork designed for strong first impressions.",
    },
};

export function ProjectsPageClient() {
    const [activeTab, setActiveTab] = useState<ProjectGalleryTab>("apps");
    const copy = pageCopy[activeTab];

    return (
        <main className="container mx-auto px-4 pt-28 md:pt-32 max-w-6xl pb-20">
            <div className="text-center mb-10 md:mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {copy.title}
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    {copy.description}
                </p>
            </div>

            <ProjectGallery activeTab={activeTab} onTabChange={setActiveTab} />
        </main>
    );
}
