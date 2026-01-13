import { ProjectRequestForm } from "@/components/features/ProjectRequestForm";

export default function RequestPage() {
    return (
        <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl min-h-screen flex flex-col items-center justify-center">

            {/* Header Section */}
            <div className="text-center mb-12 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Let’s Build <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Something Extraordinary
                    </span>
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
                    Ready to bring your vision to life? Fill out the details below, and let's craft a digital experience that stands out.
                </p>
            </div>

            {/* The Form */}
            <div className="w-full">
                <ProjectRequestForm />
            </div>

        </main>
    );
}
