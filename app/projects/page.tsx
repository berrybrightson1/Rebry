import { ProjectGallery } from "@/components/features/ProjectGallery";
import { GlassCard } from "@/components/ui/GlassCard";

export default function ProjectsPage() {
    return (
        <main className="container mx-auto px-4 pt-32 max-w-6xl pb-20">

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Selected Works
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    A curated collection of my latest web applications, system designs, and graphic art pieces.
                </p>
            </div>

            {/* Gallery */}
            <ProjectGallery />

        </main>
    );
}
