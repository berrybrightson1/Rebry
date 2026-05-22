"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { PillButton } from "@/components/ui/PillButton";
import { Input } from "@/components/ui/Input";
import { ArrowRight, Check, Loader2, Send } from "lucide-react";

type ProjectType = "website" | "web-app" | "mobile-app" | "graphics" | "3d-modeling" | "content-creation" | "other";
type BudgetRange = "less-1k" | "1k-5k" | "5k-10k" | "10k+";

const projectTypes = [
    { id: "website", label: "Website Development" },
    { id: "web-app", label: "Web App / Portal" },
    { id: "mobile-app", label: "Mobile App" },
    { id: "graphics", label: "Graphic Design" },
    { id: "3d-modeling", label: "3D Product Modeling" },
    { id: "content-creation", label: "Content Creation" },
    { id: "other", label: "Other" },
];

const budgetRanges = [
    { id: "less-1k", label: "< $1,000" },
    { id: "1k-5k", label: "$1,000 - $5,000" },
    { id: "5k-10k", label: "$5,000 - $10,000" },
    { id: "10k+", label: "$10,000+" },
];

export function ProjectRequestForm() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [direction, setDirection] = useState(0);


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: "",
        projectType: "" as ProjectType | "",
        budget: "" as BudgetRange | "",
        timeline: "",
        description: "",
    });

    const selectedProjectType = projectTypes.find((type) => type.id === formData.projectType)?.label || formData.projectType || "Not selected";
    const selectedBudget = budgetRanges.find((range) => range.id === formData.budget)?.label || formData.budget || "Not selected";
    const whatsappMessage = [
        "Hello Rebry Creatives, I want to start a project.",
        "",
        `Name: ${formData.name || "Not provided"}`,
        `Email: ${formData.email || "Not provided"}`,
        `Client WhatsApp: ${formData.whatsapp || "Not provided"}`,
        `Service Needed: ${selectedProjectType}`,
        `Budget Range: ${selectedBudget}`,
        `Timeline: ${formData.timeline || "Not provided"}`,
        "",
        "Project Details:",
        formData.description || "Not provided",
    ].join("\n");

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 3) {
            setDirection(1);
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setDirection(-1);
            setStep(step - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const message = encodeURIComponent(whatsappMessage);

        window.open(`https://wa.me/233551171353?text=${message}`, "_blank", "noopener,noreferrer");
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsSubmitted(true);
        setIsSubmitting(false);
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring" as const,
                bounce: 0.3,
                duration: 0.5
            }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.3
            }
        })
    };

    if (isSubmitted) {
        return (
            <GlassCard className="max-w-3xl mx-auto p-0 border-accent/10">
                <div className="bg-black/40 backdrop-blur-xl p-12 md:p-16 rounded-[1.3rem] text-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="w-24 h-24 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                    >
                        <Check className="w-12 h-12 text-white" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold text-white mb-4"
                    >
                        Request Received!
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-300 mb-10 max-w-lg mx-auto text-lg"
                    >
                        Thanks for reaching out, {formData.name}. WhatsApp opened with your structured request.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-center"
                    >
                        <PillButton onClick={() => window.location.href = "/"} variant="glass" className="hover:bg-white/10">
                            Back to Home
                        </PillButton>
                    </motion.div>
                </div>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="max-w-3xl mx-auto p-0 border-accent/10">
            <div className="bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-[1.3rem] overflow-hidden relative min-h-[600px] flex flex-col">

                {/* Premium Progress Bar */}
                <div className="relative mb-12 px-4">
                    {/* Background Line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full" />

                    {/* Active Line - Animated */}
                    <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((step - 1) / 2) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />

                    {/* Steps */}
                    <div className="relative flex justify-between">
                        {[1, 2, 3].map((s) => {
                            const isActive = step >= s;
                            const isCompleted = step > s;

                            return (
                                <motion.div
                                    key={s}
                                    initial={false}
                                    animate={{
                                        backgroundColor: isActive ? "#3b82f6" : "#1f2937",
                                        borderColor: isActive ? "#3b82f6" : "rgba(255,255,255,0.1)",
                                        scale: step === s ? 1.1 : 1
                                    }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 relative transition-colors duration-500 ${isActive ? 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' : ''}`}
                                >
                                    {isCompleted ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Check className="w-5 h-5 text-white" />
                                        </motion.div>
                                    ) : (
                                        <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{s}</span>
                                    )}

                                    {/* Pulse effect for active step */}
                                    {step === s && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-blue-500"
                                            initial={{ opacity: 0.5, scale: 1 }}
                                            animate={{ opacity: 0, scale: 2 }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="flex-1 flex flex-col"
                        >
                            {step === 1 && (
                                <div className="space-y-8">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-3xl font-bold text-white mb-2">Let&apos;s start with the basics</h3>
                                        <p className="text-gray-400">We need a few details to get the conversation started.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-gray-400 group-focus-within:text-blue-400 transition-colors">Your Name</label>
                                            <Input
                                                placeholder="Berry Brightson"
                                                value={formData.name}
                                                onChange={(e) => handleChange("name", e.target.value)}
                                                className="bg-white/5 border-white/10 focus:border-blue-500/50 focus:bg-blue-500/5 transition-all h-12"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-gray-400 group-focus-within:text-blue-400 transition-colors">Email Address</label>
                                            <Input
                                                type="email"
                                                placeholder="berrybrightson@gmail.com"
                                                value={formData.email}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                                className="bg-white/5 border-white/10 focus:border-blue-500/50 focus:bg-blue-500/5 transition-all h-12"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-sm font-medium text-gray-400 group-focus-within:text-blue-400 transition-colors">WhatsApp (Optional)</label>
                                        <Input
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.whatsapp}
                                            onChange={(e) => handleChange("whatsapp", e.target.value)}
                                            className="bg-white/5 border-white/10 focus:border-blue-500/50 focus:bg-blue-500/5 transition-all h-12"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-3xl font-bold text-white mb-2">Project Scope</h3>
                                        <p className="text-gray-400">Choose the service and expected investment range.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-400">What are we building?</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {projectTypes.map((type) => (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => handleChange("projectType", type.id)}
                                                    className={`p-4 rounded-2xl border text-sm font-medium transition-all text-left flex flex-col gap-2 relative overflow-hidden ${formData.projectType === type.id ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"}`}
                                                >
                                                    <span className="relative z-10">{type.label}</span>
                                                    {formData.projectType === type.id && (
                                                        <motion.div
                                                            layoutId="projectTypeActive"
                                                            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-500 z-0"
                                                        />
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-400">Capital Range</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {budgetRanges.map((range) => (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    key={range.id}
                                                    type="button"
                                                    onClick={() => handleChange("budget", range.id)}
                                                    className={`p-3 rounded-xl border text-sm font-medium transition-all text-center relative overflow-hidden ${formData.budget === range.id ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"}`}
                                                >
                                                    <span className="relative z-10">{range.label}</span>
                                                    {formData.budget === range.id && (
                                                        <motion.div
                                                            layoutId="budgetActive"
                                                            className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-500 z-0"
                                                        />
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-3xl font-bold text-white mb-2">Final Touches</h3>
                                        <p className="text-gray-400">Tell us about your vision and timeline.</p>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-sm font-medium text-gray-400 group-focus-within:text-blue-400 transition-colors">Project Vision</label>
                                        <textarea
                                            className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5 focus:ring-1 focus:ring-purple-500/50 resize-none transition-all text-base"
                                            placeholder="Describe your goals, features, or any links to inspiration..."
                                            value={formData.description}
                                            onChange={(e) => handleChange("description", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-sm font-medium text-gray-400 group-focus-within:text-blue-400 transition-colors">Desired Timeline (Optional)</label>
                                        <Input
                                            placeholder="e.g. 2 months, ASAP"
                                            value={formData.timeline}
                                            onChange={(e) => handleChange("timeline", e.target.value)}
                                            className="bg-white/5 border-white/10 focus:border-purple-500/50 focus:bg-purple-500/5 transition-all h-12"
                                        />
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <h4 className="text-sm font-semibold text-white">WhatsApp message preview</h4>
                                            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-200">
                                                Opens WhatsApp
                                            </span>
                                        </div>
                                        <pre className="max-h-48 overflow-auto whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                                            {whatsappMessage}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="pt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between sm:items-center mt-auto">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="text-gray-400 hover:text-white text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Back
                            </button>
                        ) : <div />}

                        {step < 3 ? (
                            <PillButton
                                type="button"
                                onClick={handleNext}
                                disabled={(step === 1 && (!formData.name || !formData.email)) || (step === 2 && (!formData.projectType || !formData.budget))}
                                className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 border-none px-8 h-12"
                            >
                                Next Step <ArrowRight className="w-4 h-4 ml-2" />
                            </PillButton>
                        ) : (
                            <PillButton
                                type="submit"
                                size="lg"
                                disabled={isSubmitting || !formData.description}
                                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-none shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] px-10 h-14 text-lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-3 animate-spin" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        Open WhatsApp <Send className="w-5 h-5 ml-3" />
                                    </>
                                )}
                            </PillButton>
                        )}
                    </div>
                </form>
            </div>
        </GlassCard>
    );
}
