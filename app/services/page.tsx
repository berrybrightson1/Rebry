import Link from "next/link";
import type { Metadata } from "next";
import {
    ArrowRight,
    Box,
    CheckCircle2,
    Clapperboard,
    Code2,
    Layers3,
    Palette,
    Smartphone,
    Sparkles,
} from "lucide-react";

const services = [
    {
        title: "Website Development",
        tag: "Online presence",
        description: "Responsive business websites, landing pages, portfolios, and product pages built to look sharp and load fast.",
        icon: Code2,
        className: "md:col-span-2 md:row-span-2",
        accent: "from-blue-500/20 to-cyan-400/10",
        points: ["Business websites", "Landing pages", "Portfolio sites"],
    },
    {
        title: "Web Apps",
        tag: "Systems",
        description: "Dashboards, portals, booking flows, internal tools, and web platforms with clean user experiences.",
        icon: Layers3,
        className: "md:col-span-2",
        accent: "from-violet-500/20 to-blue-500/10",
        points: ["Dashboards", "Client portals", "Custom workflows"],
    },
    {
        title: "Graphic Design",
        tag: "Visuals",
        description: "Flyers, social creatives, campaign artwork, product graphics, and branded layouts for digital promotion.",
        icon: Palette,
        className: "",
        accent: "from-fuchsia-500/20 to-pink-400/10",
        points: ["Flyers", "Social posts", "Campaign art"],
    },
    {
        title: "Mobile App Development",
        tag: "Product",
        description: "Mobile-first interfaces and app experiences for services, communities, ecommerce, and digital products.",
        icon: Smartphone,
        className: "",
        accent: "from-cyan-500/20 to-blue-500/10",
        points: ["App screens", "User flows", "Responsive UX"],
    },
    {
        title: "3D Product Modeling",
        tag: "Product visuals",
        description: "3D product mockups and render-ready visuals for launches, ads, ecommerce, and presentations.",
        icon: Box,
        className: "md:col-span-2",
        accent: "from-emerald-400/20 to-blue-400/10",
        points: ["Product mockups", "Render concepts", "Launch visuals"],
    },
    {
        title: "Content Creation",
        tag: "Campaigns",
        description: "Creative direction, short-form ideas, content planning, and launch assets that keep the brand consistent.",
        icon: Clapperboard,
        className: "md:col-span-2",
        accent: "from-amber-400/15 to-blue-500/10",
        points: ["Creative direction", "Content plans", "Launch assets"],
    },
];

export const metadata: Metadata = {
    title: "Services",
    description: "Websites, web apps, mobile app interfaces, graphic design, 3D product modeling, and content creation services from Rebry Creatives.",
    openGraph: {
        title: "Services | Rebry Creatives",
        description: "Explore Rebry Creatives services for websites, apps, graphics, 3D visuals, and content.",
        url: "/services",
    },
};

const workflow = ["Scope", "Design", "Build", "Launch"];

export default function ServicesPage() {
    return (
        <main className="container mx-auto max-w-6xl px-4 pt-28 md:pt-32 pb-20">
            <section className="mb-8 grid gap-4 md:grid-cols-4">
                <div className="md:col-span-3 rounded-3xl border border-white/10 bg-white/[0.045] p-6 md:p-8 backdrop-blur-sm overflow-hidden relative">
                    <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="relative">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm font-medium text-blue-100">
                            <Sparkles className="h-4 w-4" />
                            Rebry Creatives services
                        </div>
                        <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
                            Digital services arranged around how your brand actually grows.
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
                            Websites, apps, graphics, 3D product visuals, and content support handled with one clean creative direction.
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white text-black p-6 flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/45">Start here</p>
                        <h2 className="mt-3 text-3xl font-bold leading-none">Send a request</h2>
                    </div>
                    <Link
                        href="/request"
                        className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-5 font-semibold text-white transition-transform hover:scale-[1.02]"
                    >
                        WhatsApp brief <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            <section className="mb-8 grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-4">
                {services.map((service) => {
                    const Icon = service.icon;

                    return (
                        <article
                            key={service.title}
                            className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] ${service.className}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-80`} />
                            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/10" />
                            <div className="relative flex h-full flex-col">
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/35 text-white shadow-xl">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                                        {service.tag}
                                    </span>
                                </div>

                                <div className="mt-auto">
                                    <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">{service.title}</h2>
                                    <p className="mb-5 text-sm leading-relaxed text-gray-300">{service.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {service.points.map((point) => (
                                            <span
                                                key={point}
                                                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs font-medium text-gray-200"
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5 text-blue-200" />
                                                {point}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </section>

            <section className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm">
                    <h2 className="mb-5 text-2xl font-bold text-white">A simple delivery flow</h2>
                    <div className="grid gap-3 sm:grid-cols-4">
                        {workflow.map((item, index) => (
                            <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                                <span className="mb-5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
                                    {index + 1}
                                </span>
                                <p className="font-semibold text-white">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/35 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Next step</p>
                    <h2 className="mt-3 text-3xl font-bold text-white">Tell me what you need.</h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">
                        The request form turns your answers into a structured WhatsApp message, so the conversation starts with the useful details already included.
                    </p>
                    <Link
                        href="/request"
                        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 font-semibold text-black transition-transform hover:scale-[1.02]"
                    >
                        Open request form <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
