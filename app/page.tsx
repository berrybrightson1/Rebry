import { GlassCard } from "@/components/ui/GlassCard";
import { PillButton } from "@/components/ui/PillButton";
import { HomeSlider } from "@/components/features/HomeSlider";
import { HeroSection } from "@/components/features/HeroSection";
import { PremiumCTA } from "@/components/features/PremiumCTA";
import { Mail, Phone, Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto px-4 pt-24 md:pt-32 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 md:mb-12">
        {/* Sidebar / Profile Area (Col 1) */}
        <aside className="lg:col-span-1 flex flex-col gap-4 md:gap-6">
          <GlassCard className="text-center flex flex-col items-center sticky top-28">
            <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-[0_0_40px_rgba(59,130,246,0.3)] mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-black/50 bg-gray-800">
                <img
                  src="/berry_brightson.jpeg"
                  alt="Berry"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Rebry Creatives</h1>
            <p className="text-gray-300 text-sm mb-6">Full Stack Developer &<br />Digital Agency</p>

            <div className="flex flex-col w-full gap-3">
              <a href="https://wa.me/233551171353" target="_blank" rel="noopener noreferrer" className="w-full">
                <PillButton variant="glass" size="sm" className="w-full justify-center text-gray-300 hover:text-white hover:bg-green-500/10 hover:border-green-500/20">
                  <Phone className="w-4 h-4" /> WhatsApp
                </PillButton>
              </a>
              <a href="mailto:rebrycreatives@gmail.com" className="w-full">
                <PillButton variant="glass" size="sm" className="w-full justify-center text-gray-300 hover:text-white hover:bg-blue-500/10 hover:border-blue-500/20">
                  <Mail className="w-4 h-4" /> Mail
                </PillButton>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-full">
                <PillButton variant="glass" size="sm" className="w-full justify-center text-gray-300 hover:text-white">
                  <Github className="w-4 h-4" /> GitHub
                </PillButton>
              </a>
            </div>
          </GlassCard>
        </aside>

        {/* Main Content (Col 3) */}
        <section className="lg:col-span-3 flex flex-col gap-6 md:gap-8">

          {/* Project Gallery (Restored as Hero) */}
          <div className="w-full">
            <HomeSlider />
          </div>

          {/* Text Content (Premium Animated Section) */}
          <HeroSection />

          {/* Spacer for ID scrolling */}
          <div id="projects" className="-mt-16 pt-16 md:-mt-20 md:pt-20" />


          <PremiumCTA />

        </section>
      </div>
    </main>
  );
}
