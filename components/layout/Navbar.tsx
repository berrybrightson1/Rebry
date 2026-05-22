"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Services", href: "/services" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
        >
            <div className="glass-panel px-1.5 py-1.5 rounded-full flex items-center gap-2 border border-white/20 shadow-xl backdrop-blur-2xl bg-white/10">
                {links.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "relative px-4 py-2 text-sm font-semibold transition-all duration-300 z-10",
                                isActive ? "text-gray-900" : "text-white/80 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="active-nav-pill"
                                    className="absolute inset-0 -z-10 bg-white rounded-full shadow-lg"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            {link.name}
                        </Link>
                    );
                })}
            </div>
        </motion.nav>
    );
}
