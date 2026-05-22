import { ProjectRequestForm } from "@/components/features/ProjectRequestForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Start a Project",
    description: "Send Rebry Creatives a structured WhatsApp project request for websites, apps, graphic design, 3D product modeling, or content creation.",
    openGraph: {
        title: "Start a Project | Rebry Creatives",
        description: "Send a structured WhatsApp project request to Rebry Creatives.",
        url: "/request",
    },
};

export default function RequestPage() {
    return (
        <main className="container mx-auto px-4 pt-28 md:pt-32 pb-20 max-w-4xl min-h-screen flex flex-col items-center justify-center">
            <div className="text-center mb-12 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Let&apos;s Build <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Something Extraordinary
                    </span>
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
                    Fill out the details below and send a structured WhatsApp request straight to Rebry Creatives.
                </p>
            </div>

            <div className="w-full">
                <ProjectRequestForm />
            </div>
        </main>
    );
}
