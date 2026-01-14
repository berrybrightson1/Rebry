"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { PillButton } from "@/components/ui/PillButton";
import { Input } from "@/components/ui/Input";
import { useState, useEffect, useRef } from "react";
import {
    Mail, MessageSquare, Trash2, Settings, User, LogOut, Camera,
    Lock, ArrowRight, ShieldCheck, LayoutDashboard, CheckCircle,
    Clock, PieChart, TrendingUp, DollarSign, Search, Filter, Menu, X, Phone,
    ArrowLeft, RefreshCw, MessageCircle, Briefcase, Users, Upload, Image as ImageIcon, HardDrive
} from "lucide-react";
import { AlertModal } from "@/components/ui/AlertModal";
import { getSubmissionsAction, deleteSubmissionAction, updateSubmissionStatusAction } from "@/app/actions/submit-project";
import { getProjectsAction, createProjectAction, deleteProjectAction } from "@/app/actions/projects";
import { supabase } from "@/utils/supabase/client"; // Client-side for storage

import { motion, AnimatePresence } from "framer-motion";

// Define locally since we changed the source
interface Submission {
    id: string;
    name: string;
    email: string;
    whatsapp: string;
    projectType: string;
    budget: string;
    description: string;
    status: 'New' | 'Contacted' | 'Completed';
    date: string;
    createdAt: string;
}

interface Project {
    id: string;
    title: string;
    category: string;
    image_url: string;
    width: number;
    height: number;
    created_at: string;
    gallery?: string[];
    project_url?: string;
}



export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Master-Detail State
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

    // Projects State - General Upload (Left)
    const [projects, setProjects] = useState<Project[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadConfig, setUploadConfig] = useState({ title: "", category: "Web App" });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Web & Mobile Upload State (Right)
    const [isUploadingWeb, setIsUploadingWeb] = useState(false);
    const [uploadConfigWeb, setUploadConfigWeb] = useState({ title: "", category: "Web App", project_url: "" });
    const [selectedFilesWeb, setSelectedFilesWeb] = useState<File[]>([]);
    const [dragActiveWeb, setDragActiveWeb] = useState(false);
    const fileInputRefWeb = useRef<HTMLInputElement>(null);



    // Background Blobs State
    const [blobs, setBlobs] = useState<{ color: string, className: string, style: React.CSSProperties }[]>([]);

    useEffect(() => {
        setBlobs([
            {
                color: "bg-blue-600/10",
                className: "w-[600px] md:w-[800px] h-[600px] md:h-[800px] blur-[100px] md:blur-[120px]",
                style: { top: `${Math.random() * 60 - 30}%`, left: `${Math.random() * 50 - 25}%` }
            },
            {
                color: "bg-purple-600/10",
                className: "w-[600px] md:w-[800px] h-[600px] md:h-[800px] blur-[100px] md:blur-[120px]",
                style: { bottom: `${Math.random() * 40 - 20}%`, right: `${Math.random() * 50 - 25}%` }
            },
            {
                color: "bg-pink-600/5",
                className: "w-[400px] md:w-[600px] h-[400px] md:h-[600px] blur-[80px] md:blur-[100px]",
                style: { top: `${Math.random() * 60 + 10}%`, right: `${Math.random() * 40 + 10}%` }
            },
        ]);
    }, []);

    // Alert State
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "error" as "error" | "success" | "info" | "warning", onConfirm: undefined as (() => void) | undefined });

    // Filter State
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Contacted" | "Completed">("All");

    // Fetch data loop
    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
            // Silent auto-refresh every 5 seconds
            const interval = setInterval(() => {
                fetchData(true);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const fetchData = async (silent = false) => {
        const [submissionsResult, projectsResult] = await Promise.all([
            getSubmissionsAction(),
            getProjectsAction()
        ]);

        if (submissionsResult.success) {
            setSubmissions(submissionsResult.data as Submission[]);
        }
        if (projectsResult.success) {
            setProjects(projectsResult.data as Project[]);
        }
    };


    const showAlert = (title: string, message: string, type: "error" | "success" | "info" | "warning" = "error", onConfirm?: () => void) => {
        setAlertConfig({ isOpen: true, title, message, type, onConfirm });
    };

    // Check for persisted session
    useEffect(() => {
        const isAuth = localStorage.getItem("adminAuthenticated");
        if (isAuth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        if (password === "0020") {
            setIsAuthenticated(true);
            localStorage.setItem("adminAuthenticated", "true");
        } else {
            showAlert("Access Denied", "Incorrect password.", "error");
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        showAlert(
            "Delete Request?",
            "This action cannot be undone.",
            "warning",
            async () => {
                const result = await deleteSubmissionAction(id);
                if (result.success) {
                    setSubmissions(prev => prev.filter(s => s.id !== id));
                    if (selectedSubmissionId === id) setSelectedSubmissionId(null);
                    showAlert("Deleted", "Request removed successfully.", "success");
                } else {
                    showAlert("Error", "Failed to delete request.", "error");
                }
            }
        );
    };

    const handleStatusUpdate = async (id: string, clickedStatus: Submission['status']) => {
        const currentSub = submissions.find(s => s.id === id);
        if (!currentSub) return;
        const newStatus = (currentSub.status === clickedStatus && clickedStatus !== 'New') ? 'New' : clickedStatus;
        if (currentSub.status === newStatus) return;

        const result = await updateSubmissionStatusAction(id, newStatus);
        if (result.success) {
            setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
        } else {
            showAlert("Error", "Failed to update status.", "error");
        }
    };

    // Project Handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setSelectedFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    // Web & Mobile Upload Handlers
    const handleDragWeb = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActiveWeb(true);
        } else if (e.type === "dragleave") {
            setDragActiveWeb(false);
        }
    };

    const handleDropWeb = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActiveWeb(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setSelectedFilesWeb(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileSelectWeb = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFilesWeb(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleUploadProject = async () => {
        if (selectedFiles.length === 0 || !uploadConfig.title) {
            showAlert("Missing Info", "Please provide a title and select at least one image.", "warning");
            return;
        }

        setIsUploading(true);
        try {
            const uploadedUrls: string[] = [];
            let mainImageDimensions = { w: 0, h: 0 };

            // Upload all files
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${i}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('projects')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('projects')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);

                // Get dimensions of first image for DB reqs
                if (i === 0) {
                    mainImageDimensions = await new Promise<{ w: number, h: number }>((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve({ w: img.width, h: img.height });
                        img.onerror = () => resolve({ w: 0, h: 0 });
                        img.src = URL.createObjectURL(file);
                    });
                }
            }

            // 4. Save to DB
            const result = await createProjectAction({
                title: uploadConfig.title,
                category: uploadConfig.category,
                image_url: uploadedUrls[0], // Main image
                width: mainImageDimensions.w,
                height: mainImageDimensions.h,
                gallery: uploadedUrls // All images
            });

            if (result.success) {
                showAlert("Success", "Project uploaded successfully!", "success");
                setUploadConfig({ title: "", category: "Web App" });
                setSelectedFiles([]);
                fetchData(); // Refresh list
            } else {
                throw new Error("Failed to save project record.");
            }

        } catch (error: unknown) {
            console.error("Upload failed", error);
            const message = error instanceof Error ? error.message : "Failed to upload project.";
            showAlert("Error", message, "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadProjectWeb = async () => {
        if (selectedFilesWeb.length === 0 || !uploadConfigWeb.title) {
            showAlert("Missing Info", "Please provide a title and select at least one image.", "warning");
            return;
        }

        setIsUploadingWeb(true);
        try {
            const uploadedUrls: string[] = [];
            let mainImageDimensions = { w: 0, h: 0 };

            // Upload all files
            for (let i = 0; i < selectedFilesWeb.length; i++) {
                const file = selectedFilesWeb[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${i}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('projects')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('projects')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);

                // Get dimensions of first image for DB reqs
                if (i === 0) {
                    mainImageDimensions = await new Promise<{ w: number, h: number }>((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve({ w: img.width, h: img.height });
                        img.onerror = () => resolve({ w: 0, h: 0 });
                        img.src = URL.createObjectURL(file);
                    });
                }
            }

            // Save to DB
            const result = await createProjectAction({
                title: uploadConfigWeb.title,
                category: uploadConfigWeb.category,
                image_url: uploadedUrls[0], // Main image
                width: mainImageDimensions.w,
                height: mainImageDimensions.h,
                gallery: uploadedUrls, // All images
                project_url: uploadConfigWeb.project_url // Project link
            });

            if (result.success) {
                showAlert("Success", "Project uploaded successfully!", "success");
                setUploadConfigWeb({ title: "", category: "Web App", project_url: "" });
                setSelectedFilesWeb([]);
                fetchData(); // Refresh list
            } else {
                throw new Error("Failed to save project record.");
            }

        } catch (error: unknown) {
            console.error("Upload failed", error);
            const message = error instanceof Error ? error.message : "Failed to upload project.";
            showAlert("Error", message, "error");
        } finally {
            setIsUploadingWeb(false);
        }
    };

    const handleDeleteProject = async (id: string) => {
        showAlert(
            "Delete Project",
            "Are you sure you want to delete this project? This action cannot be undone.",
            "warning",
            async () => {
                const result = await deleteProjectAction(id);
                if (result.success) {
                    setProjects(prev => prev.filter(p => p.id !== id));
                    showAlert("Success", "Project deleted successfully", "success");
                } else {
                    showAlert("Error", "Failed to delete project", "error");
                }
            }
        );
    };

    // Settings State
    const [settings, setSettings] = useState({
        displayName: "Berry Admin",
        email: "berry@rebrycreatives.com",
        emailNotifications: true,
        twoFactor: false
    });

    const handleSaveSettings = () => {
        showAlert("Success", "Profile settings updated successfully!", "success");
    };

    const handleTogglePreference = (key: 'emailNotifications' | 'twoFactor') => {
        setSettings(prev => {
            const newVal = !prev[key];
            const name = key === 'emailNotifications' ? 'Email Notifications' : '2FA Security';
            showAlert("Preferences Updated", `${name} ${newVal ? 'Enabled' : 'Disabled'}.`, "info");
            return { ...prev, [key]: newVal };
        });
    };

    // Derived Stats
    const totalRequests = submissions.length;
    const newLeads = submissions.filter(s => s.status === 'New').length;
    const completedProjects = submissions.filter(s => s.status === 'Completed').length;

    // Value approximation
    const estimatedValue = submissions.reduce((acc, curr) => {
        let val = 0;
        if (curr.budget === 'less-1k' || curr.budget === 'low') val = 500;
        else if (curr.budget === '1k-5k' || curr.budget === 'medium') val = 2500;
        else if (curr.budget === '5k-10k' || curr.budget === 'high') val = 7500;
        else if (curr.budget === '10k+') val = 15000;
        else val = 1000; // default fallout
        return acc + val;
    }, 0);

    const filteredSubmissions = submissions.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Analytics Data Calculation
    const projectTypesCount = submissions.reduce((acc, curr) => {
        acc[curr.projectType] = (acc[curr.projectType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const projectTypesData = Object.keys(projectTypesCount).map(type => ({
        label: type === "web-app" ? "Web App" : type === "mobile-app" ? "Mobile App" : type.charAt(0).toUpperCase() + type.slice(1),
        value: Math.round((projectTypesCount[type] / totalRequests) * 100) || 0,
        color: type === 'web-app' ? 'bg-blue-500' : type === 'mobile-app' ? 'bg-purple-500' : 'bg-pink-500' // rudimentary coloring
    }));

    const selectedSubmission = submissions.find(s => s.id === selectedSubmissionId);

    if (!isAuthenticated) {
        return (
            <main className="container mx-auto px-4 h-screen flex items-center justify-center overflow-hidden relative">
                <AlertModal
                    isOpen={alertConfig.isOpen}
                    onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    type={alertConfig.type}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -z-10" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative"
                >
                    <GlassCard className="p-0 overflow-hidden border-white/10 shadow-2xl">
                        <div className="relative h-40 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center overflow-hidden">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                                className="relative z-10 w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg"
                            >
                                <Lock className="w-10 h-10 text-white" />
                            </motion.div>
                        </div>
                        <div className="p-8 space-y-6 bg-black/40 backdrop-blur-xl">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                                <p className="text-gray-400 text-sm mt-1">Authenticate to access the dashboard</p>
                            </div>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        placeholder="Enter Passcode"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-center h-12 text-lg tracking-widest"
                                        autoFocus
                                    />
                                </div>
                                <PillButton type="submit" className="w-full justify-center" disabled={isLoading}>
                                    {isLoading ? "Unlocking..." : "Unlock Dashboard"}
                                </PillButton>
                            </form>
                        </div>
                    </GlassCard>
                </motion.div>
            </main>
        );
    }

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white pt-[60px] md:pt-0 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                {blobs.map((blob, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className={`absolute rounded-full transition-all duration-1000 ease-in-out ${blob.color} ${blob.className}`}
                        style={blob.style}
                    />
                ))}
            </div>

            <div className="relative z-10 flex w-full h-full">
                <AlertModal
                    isOpen={alertConfig.isOpen}
                    onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onConfirm={alertConfig.onConfirm}
                />

                {/* Mobile Header */}
                <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-black/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shadow-xl">
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Admin Panel</span>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white/10 rounded-lg">
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Sidebar */}
                <aside className={`
                    fixed md:sticky top-[60px] md:top-0 left-0 h-[calc(100vh-60px)] md:h-screen
                    w-64 bg-black/95 md:bg-black/20 backdrop-blur-2xl md:backdrop-blur-none border-r border-white/5 p-6 flex flex-col z-40 transition-transform duration-300
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    <div className="mb-10 hidden md:block">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Rebry Admin</h2>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {[
                            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                            { id: 'requests', icon: MessageSquare, label: 'Requests', count: newLeads > 0 ? newLeads : undefined },
                            { id: 'projects', icon: Briefcase, label: 'Projects' },
                            { id: 'clients', icon: Users, label: 'Clients' },
                            { id: 'analytics', icon: PieChart, label: 'Analytics' },
                            { id: 'settings', icon: Settings, label: 'Settings' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); setSelectedSubmissionId(null); }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </div>
                                {item.count !== undefined && (
                                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto">
                        <button onClick={() => { setIsAuthenticated(false); localStorage.removeItem("adminAuthenticated"); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10">
                            <LogOut className="w-5 h-5" /> Log Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold">Dashboard</h1>
                                <p className="text-gray-400 text-sm">Overview of your activity.</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer overflow-hidden border-2 border-white/10">
                                <img src="/berry_brightson.jpeg" alt="Berry" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Stats Grid - Distinct Colors */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <GlassCard className="p-6 border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <p className="text-gray-400 text-xs font-medium uppercase">Total Requests</p>
                                        <h3 className="text-2xl font-bold text-white">{totalRequests}</h3>
                                    </GlassCard>

                                    <GlassCard className="p-6 border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent">
                                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 mb-4">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <p className="text-gray-400 text-xs font-medium uppercase">New Leads</p>
                                        <h3 className="text-2xl font-bold text-white">{newLeads}</h3>
                                    </GlassCard>

                                    <GlassCard className="p-6 border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <p className="text-gray-400 text-xs font-medium uppercase">Projects Won</p>
                                        <h3 className="text-2xl font-bold text-white">{completedProjects}</h3>
                                    </GlassCard>

                                    <GlassCard className="p-6 border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <p className="text-gray-400 text-xs font-medium uppercase">Pipeline Value</p>
                                        <h3 className="text-2xl font-bold text-white">${(estimatedValue / 1000).toFixed(1)}k</h3>
                                    </GlassCard>
                                </div>
                            </div>
                        )}

                        {activeTab === 'requests' && (
                            <AnimatePresence mode="wait">
                                {selectedSubmissionId ? (
                                    <motion.div
                                        key="detail"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        {/* Detail View */}
                                        <GlassCard className="p-0 overflow-hidden">
                                            <div className="p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                                                <button
                                                    onClick={() => setSelectedSubmissionId(null)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors border border-white/10 shrink-0"
                                                    title="Back to List"
                                                >
                                                    <ArrowLeft className="w-5 h-5" />
                                                </button>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <button onClick={() => handleStatusUpdate(selectedSubmission!.id, 'New')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedSubmission?.status === 'New' ? 'bg-blue-500 text-white border-blue-500' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>New</button>
                                                    <button onClick={() => handleStatusUpdate(selectedSubmission!.id, 'Contacted')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedSubmission?.status === 'Contacted' ? 'bg-yellow-500 text-black border-yellow-500' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>Contacted</button>
                                                    <button onClick={() => handleStatusUpdate(selectedSubmission!.id, 'Completed')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedSubmission?.status === 'Completed' ? 'bg-green-500 text-white border-green-500' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>Completed</button>
                                                </div>
                                            </div>

                                            {selectedSubmission && (
                                                <div className="p-6 md:p-10 space-y-8">
                                                    {/* Header Info */}
                                                    <div>
                                                        <h2 className="text-3xl font-bold text-white mb-2">{selectedSubmission.name}</h2>
                                                        <p className="text-gray-400 flex items-center gap-2">
                                                            <span>Submission on {new Date(selectedSubmission.createdAt).toLocaleDateString()}</span>
                                                            <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                                            <span>{selectedSubmission.projectType}</span>
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                        <div className="md:col-span-2 space-y-8">
                                                            {/* Message */}
                                                            <div>
                                                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Project Description</h3>
                                                                <div className="bg-white/5 rounded-2xl p-6 text-gray-200 leading-relaxed text-lg border border-white/5 whitespace-pre-wrap">
                                                                    {selectedSubmission.description}
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex gap-4">
                                                                {selectedSubmission.whatsapp && (
                                                                    <a
                                                                        href={`https://wa.me/${selectedSubmission.whatsapp.replace(/\D/g, '')}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex-1 bg-green-600 hover:bg-green-500 text-white h-12 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                                                                    >
                                                                        <MessageCircle className="w-5 h-5" />
                                                                        Chat on WhatsApp
                                                                    </a>
                                                                )}
                                                                {selectedFiles.length > 0 && (
                                                                    <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="w-16 h-16 rounded-lg border-2 border-dashed border-white/20 hover:border-white/40 flex items-center justify-center transition-colors group" aria-label="Add more files"><span className="text-2xl text-white/40 group-hover:text-white/60 transition-colors">+</span></button>
                                                                )}
                                                                <a
                                                                    href={`mailto:${selectedSubmission.email}`}
                                                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white h-12 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border border-white/10"
                                                                >
                                                                    <Mail className="w-5 h-5" />
                                                                    Reply via Email
                                                                </a>
                                                                <button
                                                                    onClick={() => handleDelete(selectedSubmission.id)}
                                                                    className="w-12 h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/20"
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Sidebar Details */}
                                                        <div className="space-y-6">
                                                            <div className="bg-black/20 rounded-2xl p-6 border border-white/5 space-y-4">
                                                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Contact Info</h3>
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <label className="text-xs text-gray-500">Email</label>
                                                                        <p className="text-white">{selectedSubmission.email}</p>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-xs text-gray-500">WhatsApp</label>
                                                                        <p className="text-white">{selectedSubmission.whatsapp || 'N/A'}</p>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-xs text-gray-500">Budget</label>
                                                                        <p className="text-white font-medium text-green-400 capitalize">{selectedSubmission.budget}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </GlassCard>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="list"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        {/* Filters & Search */}
                                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <div className="relative w-full md:w-96">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <Input
                                                    placeholder="Search requests..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 bg-black/40 border-white/10"
                                                />
                                            </div>
                                            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                                                <PillButton onClick={() => fetchData()} size="sm" className="w-10 h-10 p-0 bg-white/10 border-white/10 hover:bg-white/20 shrink-0">
                                                    <RefreshCw className="w-4 h-4" />
                                                </PillButton>
                                                {['All', 'New', 'Contacted', 'Completed'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => setStatusFilter(status as "All" | "New" | "Contacted" | "Completed")}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === status
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                                                            }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Requests Grid */}
                                        <div className="grid gap-4">
                                            {filteredSubmissions.length === 0 ? (
                                                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Search className="w-8 h-8 text-gray-600" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-white">No requests found</h3>
                                                </div>
                                            ) : (
                                                filteredSubmissions.map((sub) => (
                                                    <GlassCard
                                                        key={sub.id}
                                                        className={`p-6 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group ${sub.status === 'New' ? 'bg-blue-500/5' : ''}`}
                                                        onClick={() => setSelectedSubmissionId(sub.id)}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-3">
                                                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{sub.name}</h3>
                                                                    {sub.status === 'New' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                                                                </div>
                                                                <p className="text-sm text-gray-400 line-clamp-1">{sub.description}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`text-xs px-2 py-1 rounded-full border ${sub.status === 'New' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' :
                                                                    sub.status === 'Contacted' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' :
                                                                        'text-green-400 border-green-500/20 bg-green-500/10'
                                                                    }`}>{sub.status}</span>
                                                                <p className="text-xs text-gray-500 mt-2">{new Date(sub.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    </GlassCard>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}



                        {activeTab === 'clients' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-white">Client Directory</h3>
                                    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-400">
                                        Total Clients: <span className="text-white font-bold ml-2">
                                            {new Set(submissions.map(s => s.email)).size}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from(new Set(submissions.map(s => s.email))).map((email) => {
                                        const clientSubs = submissions.filter(s => s.email === email);
                                        const mainProfile = clientSubs[0];
                                        const totalSpent = clientSubs.reduce((acc, curr) => {
                                            let val = 0;
                                            if (curr.budget === 'less-1k' || curr.budget === 'low') val = 500;
                                            else if (curr.budget === '1k-5k' || curr.budget === 'medium') val = 2500;
                                            else if (curr.budget === '5k-10k' || curr.budget === 'high') val = 7500;
                                            else if (curr.budget === '10k+') val = 15000;
                                            else val = 1000;
                                            return acc + val;
                                        }, 0);

                                        return (
                                            <GlassCard key={email} className="p-6 relative overflow-hidden group">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-white font-bold text-lg border border-white/10">
                                                        {mainProfile.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                                                        {clientSubs.length} Request{clientSubs.length !== 1 ? 's' : ''}
                                                    </span>
                                                </div>

                                                <h4 className="text-lg font-bold text-white mb-1 truncate" title={mainProfile.name}>{mainProfile.name}</h4>
                                                <div className="space-y-2 mb-4">
                                                    <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                                        <Mail className="w-3 h-3" /> {email}
                                                    </a>
                                                    {mainProfile.whatsapp && (
                                                        <a href={`https://wa.me/${mainProfile.whatsapp.replace(/\D/g, '')}`} target="_blank" className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors">
                                                            <Phone className="w-3 h-3" /> {mainProfile.whatsapp}
                                                        </a>
                                                    )}
                                                    {selectedFiles.length > 0 && (
                                                        <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="w-16 h-16 rounded-lg border-2 border-dashed border-white/20 hover:border-white/40 flex items-center justify-center transition-colors group" aria-label="Add more files"><span className="text-2xl text-white/40 group-hover:text-white/60 transition-colors">+</span></button>
                                                    )}
                                                </div>

                                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                                    <span className="text-xs text-gray-500 uppercase tracking-widest">Est. Value</span>
                                                    <span className="text-green-400 font-bold">${(totalSpent / 1000).toFixed(1)}k</span>
                                                </div>
                                            </GlassCard>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab === 'projects' && (
                            <div className="space-y-8">
                                {/* Upload Forms - Side by Side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Upload Form 1 - General Projects */}
                                    <GlassCard className="p-6 space-y-4">
                                        <h3 className="text-lg font-bold text-white mb-2">Upload New Project</h3>
                                        <p className="text-xs text-gray-400 -mt-2 mb-4">For Graphics Design on homepage</p>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-gray-400">Project Title</label>
                                                <Input
                                                    value={uploadConfig.title}
                                                    onChange={(e) => setUploadConfig(prev => ({ ...prev, title: e.target.value }))}
                                                    placeholder="e.g. Neon Brand Identity"
                                                    className="bg-black/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-gray-400">Category</label>
                                                <select
                                                    value={uploadConfig.category}
                                                    onChange={(e) => setUploadConfig(prev => ({ ...prev, category: e.target.value }))}
                                                    className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all cursor-pointer hover:bg-white/10"
                                                >
                                                    <option value="Web App" className="bg-neutral-900 text-white">Web App</option>
                                                    <option value="Mobile App" className="bg-neutral-900 text-white">Mobile App</option>
                                                    <option value="Branding" className="bg-neutral-900 text-white">Branding</option>
                                                    <option value="Print Design" className="bg-neutral-900 text-white">Print Design</option>
                                                    <option value="3D Art" className="bg-neutral-900 text-white">3D Art</option>
                                                </select>
                                            </div>

                                            {/* Dropzone */}
                                            <div
                                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragActive ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5"}`}
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept="image/*" multiple />
                                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                                    {selectedFiles.length > 0 ? (
                                                        selectedFiles.map((file, i) => (
                                                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 shadow-sm group">
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    className="w-full h-full object-cover"
                                                                    alt="Preview"
                                                                />
                                                                <button onClick={(e) => { e.stopPropagation(); setSelectedFiles(prev => prev.filter((_, idx) => idx !== i)); }} className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove file"><X className="w-3 h-3 text-white" /></button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                                            <Upload className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                    {selectedFiles.length > 0 && (
                                                        <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="w-16 h-16 rounded-lg border-2 border-dashed border-white/20 hover:border-white/40 flex items-center justify-center transition-colors group" aria-label="Add more files"><span className="text-2xl text-white/40 group-hover:text-white/60 transition-colors">+</span></button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-400">
                                                    {selectedFiles.length > 0
                                                        ? `${selectedFiles.length} file(s) selected`
                                                        : "Drag images here or click to browse"}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">Supports multiple files</p>
                                            </div>

                                            <PillButton
                                                onClick={handleUploadProject}
                                                disabled={isUploading || selectedFiles.length === 0}
                                                className="w-full justify-center"
                                            >
                                                {isUploading ? "Uploading..." : "Publish Project"}
                                            </PillButton>

                                            {/* Layout Guide */}
                                            <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-white/5">
                                                <p className="font-medium text-gray-400">Recommended ratios:</p>
                                                <div className="flex gap-3">
                                                    <span>4:5</span>
                                                    <span>1:1</span>
                                                    <span>16:9</span>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>

                                    {/* Upload Form 2 - Web & Mobile Pages ONLY */}
                                    <GlassCard className="p-6 space-y-4 border-2 border-blue-500/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            <h3 className="text-lg font-bold text-white">Upload Web & Mobile Pages</h3>
                                        </div>
                                        <p className="text-xs text-gray-400 -mt-2 mb-4">For tablet frame display on homepage</p>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-gray-400">Project Title</label>
                                                <Input
                                                    value={uploadConfigWeb.title}
                                                    onChange={(e) => setUploadConfigWeb(prev => ({ ...prev, title: e.target.value }))}
                                                    placeholder="e.g. Neon Dashboard"
                                                    className="bg-black/20 border-blue-500/20 focus:border-blue-500/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-gray-400">Project URL (Live/Demo Link)</label>
                                                <Input
                                                    value={uploadConfigWeb.project_url}
                                                    onChange={(e) => setUploadConfigWeb(prev => ({ ...prev, project_url: e.target.value }))}
                                                    placeholder="e.g. https://example.com"
                                                    className="bg-black/20 border-blue-500/20 focus:border-blue-500/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-gray-400">Page Type</label>
                                                <select
                                                    value={uploadConfigWeb.category}
                                                    onChange={(e) => setUploadConfigWeb(prev => ({ ...prev, category: e.target.value }))}
                                                    className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all cursor-pointer hover:bg-white/10"
                                                >
                                                    <option value="Web App" className="bg-neutral-900 text-white">Web App</option>
                                                    <option value="Mobile App" className="bg-neutral-900 text-white">Mobile App</option>
                                                </select>
                                            </div>

                                            {/* Dropzone */}
                                            <div
                                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragActiveWeb ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5"}`}
                                                onDragEnter={handleDragWeb}
                                                onDragLeave={handleDragWeb}
                                                onDragOver={handleDragWeb}
                                                onDrop={handleDropWeb}
                                                onClick={() => fileInputRefWeb.current?.click()}
                                            >
                                                <input ref={fileInputRefWeb} type="file" className="hidden" onChange={handleFileSelectWeb} accept="image/*" multiple />
                                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                                    {selectedFilesWeb.length > 0 ? (
                                                        selectedFilesWeb.map((file, i) => (
                                                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 shadow-sm group">
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    className="w-full h-full object-cover"
                                                                    alt="Preview"
                                                                />
                                                                <button onClick={(e) => { e.stopPropagation(); setSelectedFilesWeb(prev => prev.filter((_, idx) => idx !== i)); }} className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove file"><X className="w-3 h-3 text-white" /></button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                                            <Upload className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                    {selectedFilesWeb.length > 0 && (
                                                        <button onClick={(e) => { e.stopPropagation(); fileInputRefWeb.current?.click(); }} className="w-16 h-16 rounded-lg border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 flex items-center justify-center transition-colors group" aria-label="Add more files"><span className="text-2xl text-blue-400/60 group-hover:text-blue-400 transition-colors">+</span></button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-400">
                                                    {selectedFilesWeb.length > 0
                                                        ? `${selectedFilesWeb.length} file(s) selected`
                                                        : "Drag images here or click to browse"}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">Supports multiple files</p>
                                            </div>

                                            <PillButton
                                                onClick={handleUploadProjectWeb}
                                                disabled={isUploadingWeb || selectedFilesWeb.length === 0}
                                                className="w-full justify-center"
                                            >
                                                {isUploadingWeb ? "Uploading..." : "Publish Project"}
                                            </PillButton>

                                            {/* Layout Guide */}
                                            <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-blue-500/20">
                                                <p className="font-medium text-blue-400">Tablet ratio:</p>
                                                <div className="flex gap-3">
                                                    <span className="text-blue-400 font-bold">16:9</span>
                                                    <span className="text-gray-600">(Landscape)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </div>

                                {/* List */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">Gallery ({projects.length})</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {projects.map((project) => (
                                            <div key={project.id} className="relative group aspect-[4/5] rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                                                    <p className="text-sm font-bold text-white line-clamp-1">{project.title}</p>
                                                    <p className="text-xs text-gray-400 mb-3">{project.category}</p>
                                                    <button
                                                        onClick={() => handleDeleteProject(project.id)}
                                                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <GlassCard className="p-6">
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <PieChart className="w-5 h-5 text-purple-400" />
                                        Project Types
                                    </h3>
                                    {totalRequests > 0 ? (
                                        <div className="space-y-4">
                                            {projectTypesData.map((item, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-300">{item.label}</span>
                                                        <span className="text-white font-bold">{item.value}%</span>
                                                    </div>
                                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-gray-500">No data available</div>
                                    )}
                                </GlassCard>

                                <GlassCard className="p-6 flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                            <TrendingUp className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <p className="text-gray-400">Growth data will appear here once more requests come in.</p>
                                    </div>
                                </GlassCard>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            // Simplified Settings
                            <div className="max-w-xl mx-auto">
                                <GlassCard className="p-8 text-center">
                                    <h3 className="text-xl font-bold mb-2">Settings</h3>
                                    <p className="text-gray-400 mb-6">Manage your admin preferences.</p>
                                    <div className="space-y-4 text-left">
                                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                                            <span>Email Notifications</span>
                                            <div className="w-10 h-6 bg-green-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        )}
                    </div>
                </main>
            </div >
        </div >
    );
}
