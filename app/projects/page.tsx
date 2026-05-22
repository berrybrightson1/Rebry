import type { Metadata } from "next";
import { ProjectsPageClient } from "@/components/features/ProjectsPageClient";

export const metadata: Metadata = {
    title: "Portfolio",
    description: "Explore Rebry Creatives website builds, web apps, ecommerce projects, and graphic design work.",
    openGraph: {
        title: "Portfolio | Rebry Creatives",
        description: "Selected websites, apps, ecommerce builds, and graphic design work by Rebry Creatives.",
        url: "/projects",
    },
};

export default function ProjectsPage() {
    return <ProjectsPageClient />;
}
