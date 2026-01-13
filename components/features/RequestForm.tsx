"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { PillButton } from "@/components/ui/PillButton";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";

// Schema
const formSchema = z.object({
    businessName: z.string().min(2, "Business name is required"),
    serviceType: z.enum(["ecommerce", "corporate", "webapp", "landing"]),
    budget: z.string(),
    whatsapp: z.string().min(10, "Valid WhatsApp number required"),
    email: z.string().email("Invalid email address"),
    description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function RequestForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Form Data:", data);
        setIsSubmitting(false);
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000); // Reset success after 5s
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <GlassCard key="success" className="text-center py-16 flex flex-col items-center justify-center border-green-500/30">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                        >
                            <Check className="w-10 h-10 text-white" strokeWidth={3} />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
                        <p className="text-gray-300">We'll be in touch via WhatsApp shortly.</p>
                    </GlassCard>
                ) : (
                    <GlassCard key="form">
                        <h2 className="text-2xl font-bold text-white mb-6">Start a Project</h2>
                        <p className="text-gray-300 mb-6">Tell me about your vision.</p>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            <div>
                                <Input placeholder="Business Name" {...register("businessName")} />
                                {errors.businessName && <p className="text-red-400 text-xs mt-1 ml-1">{errors.businessName.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <select
                                        {...register("serviceType")}
                                        defaultValue=""
                                        className="flex h-12 w-full rounded-xl border border-spatial-border bg-white/40 px-4 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer hover:bg-white/50 transition-colors"
                                    >
                                        <option value="" disabled>Service Type</option>
                                        <option value="ecommerce" className="bg-gray-900 text-white">E-Commerce</option>
                                        <option value="corporate" className="bg-gray-900 text-white">Corporate Site</option>
                                        <option value="webapp" className="bg-gray-900 text-white">Web App</option>
                                        <option value="landing" className="bg-gray-900 text-white">Landing Page</option>
                                    </select>
                                    {errors.serviceType && <p className="text-red-500 text-xs mt-1 ml-1">{errors.serviceType.message}</p>}
                                </div>
                                <div>
                                    <select
                                        {...register("budget")}
                                        defaultValue=""
                                        className="flex h-12 w-full rounded-xl border border-spatial-border bg-white/40 px-4 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer hover:bg-white/50 transition-colors"
                                    >
                                        <option value="" disabled>Budget Range</option>
                                        <option value="low" className="bg-gray-900 text-white">$500 - $1k</option>
                                        <option value="medium" className="bg-gray-900 text-white">$1k - $3k</option>
                                        <option value="high" className="bg-gray-900 text-white">$3k+</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Input placeholder="WhatsApp Number" type="tel" {...register("whatsapp")} />
                                    {errors.whatsapp && <p className="text-red-400 text-xs mt-1 ml-1">{errors.whatsapp.message}</p>}
                                </div>
                                <div>
                                    <Input placeholder="Email Address" type="email" {...register("email")} />
                                    {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>}
                                </div>
                            </div>

                            <textarea
                                placeholder="Tell us a bit about your project..."
                                {...register("description")}
                                className="flex min-h-[100px] w-full rounded-xl border border-spatial-border bg-black/20 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent text-foreground transition-all duration-200 hover:bg-black/30 resize-none"
                            />

                            <PillButton type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Request <Send className="w-4 h-4" />
                                    </>
                                )}
                            </PillButton>
                        </form>
                    </GlassCard>
                )}
            </AnimatePresence>
        </div>
    );
}
