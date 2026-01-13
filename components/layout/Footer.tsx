"use client";

import { Mail, MapPin, Phone, Instagram } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
    return (
        <footer className="w-full border-t border-white/10 mt-0 pt-8 pb-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-8 mb-12 md:mb-16">

                    {/* Brand Column - Full width on mobile */}
                    <div className="col-span-2 md:col-span-5 flex flex-col gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Rebry Creatives</h3>
                            <p className="text-gray-400 text-sm mt-3 leading-relaxed max-w-sm">
                                Crafting digital experiences that merge spatial design with high-performance engineering.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <SocialIcon
                                icon={<Instagram className="w-5 h-5" />}
                                href="https://www.instagram.com/rebrycreatives/"
                                username="@rebrycreatives"
                            />
                        </div>
                    </div>

                    {/* Navigation - Side by side on mobile */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-white font-bold mb-6">Explore</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/projects" className="hover:text-white transition-colors">Work</Link></li>
                            <li><Link href="/request" className="hover:text-white transition-colors">Services</Link></li>
                            <li><Link href="/admin" className="hover:text-white transition-colors">Admin</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                        </ul>
                    </div>

                    {/* Contact Details - Full width on mobile */}
                    <div className="col-span-2 md:col-span-3 flex flex-col gap-4 mt-4 md:mt-0">
                        <h4 className="text-white font-bold mb-2">Contact</h4>
                        <div className="space-y-4">
                            <a href="tel:0551171353" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">0551171353</span>
                            </a>
                            <a href="mailto:rebrycreatives@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">rebrycreatives@gmail.com</span>
                            </a>
                            <div className="flex items-center gap-3 text-gray-400 group">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">Titanium Road, Central University</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Minimal */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Rebry Creatives. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Designed by RebryCreatives
                    </p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href, username }: { icon: React.ReactNode, href: string, username?: string }) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial="initial"
            whileHover="hover"
            className="flex items-center bg-white/5 border border-white/5 rounded-full overflow-hidden h-10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors"
        >
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                {icon}
            </div>
            {username && (
                <motion.span
                    variants={{
                        initial: { width: 0, opacity: 0, paddingRight: 0 },
                        hover: { width: "auto", opacity: 1, paddingRight: 16 }
                    }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="whitespace-nowrap text-sm font-medium overflow-hidden"
                >
                    {username}
                </motion.span>
            )}
        </motion.a>
    )
}
