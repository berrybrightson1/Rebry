"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { changelog } from "@/data/changelog";

export function UpdatesModal() {
    const [isOpen, setIsOpen] = useState(false);
    const latest = changelog[0];

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="hover:text-white transition-colors text-left"
            >
                Updates
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-xl"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="updates-title"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#080d18] p-5 shadow-2xl md:p-6"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                                    Version {latest.version} - {latest.date}
                                </p>
                                <h2 id="updates-title" className="mt-2 text-2xl font-bold text-white">
                                    What&apos;s new
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-black transition-transform hover:scale-105"
                                aria-label="Close updates"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {latest.groups.map((group) => (
                                <section key={group.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                    <h3 className="mb-3 font-semibold text-white">{group.title}</h3>
                                    <ul className="space-y-2 text-sm leading-relaxed text-gray-300">
                                        {group.items.map((item) => (
                                            <li key={item} className="flex gap-2">
                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
