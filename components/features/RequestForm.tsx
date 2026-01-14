"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    whatsapp: z.string().min(10, "Invalid WhatsApp number"),
    projectType: z.string().min(1, "Please select a project type"),
    budget: z.string().min(1, "Please select a budget range"),
    description: z.string().min(10, "Please describe your project"),
});

type FormData = z.infer<typeof formSchema>;

export default function RequestForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const { submitProjectRequest } = await import("@/app/actions/submit-project");
            const result = await submitProjectRequest(data);

            if (result.success) {
                setIsSuccess(true);
                reset();
                setTimeout(() => setIsSuccess(false), 5000);
            } else {
                console.error("Submission failed");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Fields would go here - preserving implementation structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Name / Business</label>
                    <input {...register("name")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-colors" placeholder="e.g., Berry Inc." />
                    {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <input {...register("email")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-colors" placeholder="hello@example.com" />
                    {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">WhatsApp Number</label>
                    <input {...register("whatsapp")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-colors" placeholder="+1 234 567 8900" />
                    {errors.whatsapp && <p className="text-red-400 text-xs">{errors.whatsapp.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Project Type</label>
                    <select {...register("projectType")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 focus:text-white focus:border-blue-500/50 outline-none transition-colors appearance-none" >
                        <option value="">Select Type</option>
                        <option value="web-app">Web Application</option>
                        <option value="mobile-app">Mobile App</option>
                        <option value="website">Website</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.projectType && <p className="text-red-400 text-xs">{errors.projectType.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Budget Range</label>
                <select {...register("budget")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 focus:text-white focus:border-blue-500/50 outline-none transition-colors appearance-none">
                    <option value="">Select Budget</option>
                    <option value="less-1k">&lt; $1k</option>
                    <option value="1k-5k">$1k - $5k</option>
                    <option value="5k-10k">$5k - $10k</option>
                    <option value="10k+">$10k+</option>
                </select>
                {errors.budget && <p className="text-red-400 text-xs">{errors.budget.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Project Description</label>
                <textarea {...register("description")} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-colors resize-none" placeholder="Tell us about your idea..." />
                {errors.description && <p className="text-red-400 text-xs">{errors.description.message}</p>}
            </div>

            <PillButton type="submit" className="w-full justify-center group" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Request <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </PillButton>

            {isSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                    Request submitted successfully! We'll allow you to connect Supabase soon.
                </div>
            )}
        </form>
    );
}
