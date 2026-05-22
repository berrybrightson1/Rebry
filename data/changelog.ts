export interface ChangelogEntry {
    version: string;
    date: string;
    groups: Array<{
        title: string;
        items: string[];
    }>;
}

export const changelog: ChangelogEntry[] = [
    {
        version: "0.1.1",
        date: "May 22, 2026",
        groups: [
            {
                title: "Portfolio",
                items: [
                    "Rebuilt the project showcase around real website screenshots and live project links.",
                    "Added a polished graphic design gallery with mobile bento tiles and a fullscreen preview viewer.",
                    "Optimized portfolio images so the gallery loads faster without losing visual quality.",
                ],
            },
            {
                title: "Services",
                items: [
                    "Added a dedicated Services page with a bento-style layout for websites, apps, graphics, 3D visuals, and content creation.",
                    "Separated Services from the project request flow so visitors can browse offerings before starting an enquiry.",
                ],
            },
            {
                title: "Requests",
                items: [
                    "Updated the project request form to open WhatsApp with a structured enquiry message.",
                    "Added a message preview so visitors can review their request before sending.",
                ],
            },
            {
                title: "Experience",
                items: [
                    "Moved the site to Geist typography for a cleaner interface feel.",
                    "Improved mobile spacing, footer density, route metadata, and overall static-site performance.",
                    "Removed the old backend/admin flow so the portfolio now runs as a simpler public-folder driven site.",
                ],
            },
        ],
    },
];
