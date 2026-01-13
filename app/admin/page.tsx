"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { PillButton } from "@/components/ui/PillButton";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import {
    Mail, MessageSquare, Trash2, Settings, User, LogOut, Camera,
    Lock, ArrowRight, ShieldCheck, LayoutDashboard, CheckCircle,
    Clock, PieChart, TrendingUp, DollarSign, Search, Filter, Menu, X
} from "lucide-react";
import { AlertModal } from "@/components/ui/AlertModal";
import { getSubmissionsAction, deleteSubmissionAction, updateSubmissionStatusAction } from "@/app/actions/submit-project";
import { Submission } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                color: "bg-indigo-600/5",
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

    // Fetch data when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        const result = await getSubmissionsAction();
        if (result.success) {
            setSubmissions(result.data);
        }
    };

    const showAlert = (title: string, message: string, type: "error" | "success" | "info" | "warning" = "error", onConfirm?: () => void) => {
        setAlertConfig({ isOpen: true, title, message, type, onConfirm });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        if (password === "admin123") {
            setIsAuthenticated(true);
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
                    showAlert("Deleted", "Request removed successfully.", "success");
                } else {
                    showAlert("Error", "Failed to delete request.", "error");
                }
            }
        );
    };

    const handleStatusUpdate = async (id: string, clickedStatus: Submission['status']) => {
        // Find current status
        const currentSub = submissions.find(s => s.id === id);
        if (!currentSub) return;

        // If clicking the active status, revert to 'New' (unless it's already New, then do nothing or stay New)
        // This allows "deselecting" Contacted/Completed back to default state
        const newStatus = (currentSub.status === clickedStatus && clickedStatus !== 'New') ? 'New' : clickedStatus;

        if (currentSub.status === newStatus) return; // No change

        const result = await updateSubmissionStatusAction(id, newStatus);
        if (result.success) {
            setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
        } else {
            showAlert("Error", "Failed to update status.", "error");
        }
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
    const estimatedValue = submissions.reduce((acc, curr) => {
        let val = 0;
        if (curr.budget === 'less-1k') val = 500;
        else if (curr.budget === '1k-5k') val = 2500;
        else if (curr.budget === '5k-10k') val = 7500;
        else if (curr.budget === '10k+') val = 15000;
        return acc + val;
    }, 0);

    const filteredSubmissions = submissions.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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

                {/* Background ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative"
                >
                    <GlassCard className="p-0 overflow-hidden border-white/10 shadow-2xl">
                        {/* Animated Header */}
                        <div className="relative h-40 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center overflow-hidden">
                            {/* Abstract Shapes */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-[40%] blur-3xl -translate-y-1/2 translate-x-1/4"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-[40%] blur-3xl translate-y-1/2 -translate-x-1/4"
                            />

                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                                className="relative z-10 w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg"
                            >
                                <Lock className="w-10 h-10 text-white" />

                                <motion.div
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1e293b]"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                        </div>

                        <div className="p-8 space-y-6 bg-black/40 backdrop-blur-xl">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                                <p className="text-gray-400 text-sm mt-1">Authenticate to access the dashboard</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Input
                                            type="password"
                                            placeholder="Enter Secure Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pl-10 h-12 transition-all focus:border-blue-500/50 focus:bg-blue-500/5"
                                        />
                                        <ShieldCheck className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full font-medium shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Unlock Dashboard <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <div className="text-center">
                                <a href="/" className="text-xs text-gray-500 hover:text-white transition-colors">Return to Website</a>
                            </div>
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

                {/* Mobile Header Toggle */}
                <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-black/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shadow-xl">
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Admin Panel</span>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Sidebar - Mobile Overlay & Desktop Sticky */}
                <aside className={`
                    fixed md:sticky top-[60px] md:top-0 left-0 h-[calc(100vh-60px)] md:h-screen
                    w-64 bg-black/95 md:bg-black/20 backdrop-blur-2xl md:backdrop-blur-none border-r border-white/5 p-6 flex flex-col z-40 transition-transform duration-300
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    <div className="mb-10 hidden md:block">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Admin Panel</h2>
                        <p className="text-xs text-gray-500 mt-1">Manage your empire</p>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {[
                            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                            { id: 'requests', icon: MessageSquare, label: 'Requests', count: newLeads > 0 ? newLeads : undefined },
                            { id: 'analytics', icon: PieChart, label: 'Analytics' },
                            { id: 'settings', icon: Settings, label: 'Settings' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
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
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Log Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold">Good Evening, Berry</h1>
                                <p className="text-gray-400 text-sm">Here's what's happening with your projects today.</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer overflow-hidden border-2 border-white/10">
                                    <img
                                        src="/berry_brightson.jpeg"
                                        alt="Berry"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Total Requests', value: totalRequests, icon: MessageSquare, gradient: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/30', text: 'text-blue-400', iconBg: 'bg-blue-500/20' },
                                        { label: 'New Leads', value: newLeads, icon: User, gradient: 'from-green-500/20 to-green-600/5', border: 'border-green-500/30', text: 'text-green-400', iconBg: 'bg-green-500/20' },
                                        { label: 'Projects Won', value: completedProjects, icon: CheckCircle, gradient: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/30', text: 'text-purple-400', iconBg: 'bg-purple-500/20' },
                                        { label: 'Pipeline Value', value: `$${(estimatedValue / 1000).toFixed(1)}k`, icon: DollarSign, gradient: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/30', text: 'text-amber-400', iconBg: 'bg-amber-500/20' },
                                    ].map((stat, i) => (
                                        <GlassCard key={i} className={`p-6 flex items-center gap-4 border ${stat.border} bg-gradient-to-br ${stat.gradient} relative overflow-hidden group`}>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.iconBg} ${stat.text} group-hover:scale-110 transition-transform`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                                                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                            </div>
                                        </GlassCard>
                                    ))}
                                </div>

                                {/* Recent Requests Table */}
                                <GlassCard className="p-0 overflow-hidden border-white/10">
                                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            Recent Requests
                                            <span className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">{totalRequests}</span>
                                        </h3>
                                        <button onClick={() => setActiveTab('requests')} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 group">
                                            View All
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-black/20 text-gray-400 text-xs uppercase">
                                                <tr>
                                                    <th className="px-6 py-4 font-medium">Client</th>
                                                    <th className="px-6 py-4 font-medium">Type</th>
                                                    <th className="px-6 py-4 font-medium">Budget</th>
                                                    <th className="px-6 py-4 font-medium">Status</th>
                                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-sm">
                                                {submissions.slice(0, 5).map((sub) => (
                                                    <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-white">{sub.name}</td>
                                                        <td className="px-6 py-4 text-gray-400">{sub.projectType}</td>
                                                        <td className="px-6 py-4 text-gray-400">{sub.budget}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${sub.status === 'New' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                sub.status === 'Contacted' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                                    'bg-green-500/10 text-green-400 border-green-500/20'
                                                                }`}>
                                                                {sub.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button onClick={() => setActiveTab('requests')} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all">
                                                                <ArrowRight className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </GlassCard>
                            </div>
                        )}

                        {activeTab === 'requests' && (
                            <div className="space-y-6">
                                {/* Filters */}
                                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            placeholder="Search by name or email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 bg-black/40 border-white/10"
                                        />
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                        {['All', 'New', 'Contacted', 'Completed'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setStatusFilter(status as any)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Full List */}
                                <div className="grid gap-4">
                                    {filteredSubmissions.length === 0 ? (
                                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-8 h-8 text-gray-600" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white">No requests found</h3>
                                            <p className="text-gray-500">Try adjusting your filters.</p>
                                        </div>
                                    ) : filteredSubmissions.map((sub) => (
                                        <GlassCard key={sub.id} className="p-6 border border-white/5 hover:border-white/10 transition-all group">
                                            <div className="flex flex-col gap-4">
                                                {/* Top Row: Info & Status */}
                                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-bold text-white max-w-[200px] truncate" title={sub.name}>{sub.name}</h3>
                                                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded whitespace-nowrap">{sub.date || 'No Date'}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {sub.email}</span>
                                                            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {sub.budget}</span>
                                                            <span className="flex items-center gap-1"><LayoutDashboard className="w-3 h-3" /> {sub.projectType}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5 self-start">
                                                        <button
                                                            onClick={() => handleStatusUpdate(sub.id, 'New')}
                                                            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${sub.status === 'New' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                                                            title="Mark New"
                                                        >
                                                            <User className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(sub.id, 'Contacted')}
                                                            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${sub.status === 'Contacted' ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                                                            title="Mark Contacted"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(sub.id, 'Completed')}
                                                            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${sub.status === 'Completed' ? 'bg-green-500 text-white' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                                                            title="Mark Completed"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Bottom Row: Message & Actions */}
                                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                                    <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5 text-sm text-gray-300 min-h-[5.5rem] flex items-center">
                                                        "{sub.description}"
                                                    </div>

                                                    <div className="flex md:flex-col gap-2 shrink-0">
                                                        <a
                                                            href={`mailto:${sub.email}`}
                                                            className="flex-1 md:flex-none px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center justify-center rounded-xl transition-colors border border-white/5 h-10 w-full md:w-20"
                                                        >
                                                            Reply
                                                        </a>
                                                        <button
                                                            onClick={() => handleDelete(sub.id)}
                                                            className="flex-1 md:flex-none px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center rounded-xl transition-colors border border-red-500/20 h-10 w-full md:w-20 group"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <GlassCard className="p-6">
                                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-green-400" />
                                            Project Growth
                                        </h3>
                                        <div className="h-64 flex items-end justify-between gap-2">
                                            {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                                                <div key={i} className="w-full bg-white/5 hover:bg-blue-500/50 transition-colors rounded-t-lg relative group" style={{ height: `${h}%` }}>
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {h}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-4 uppercase">
                                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6">
                                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                            <PieChart className="w-5 h-5 text-purple-400" />
                                            Project Types
                                        </h3>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Web Applications', value: 45, color: 'bg-blue-500' },
                                                { label: 'Mobile Apps', value: 30, color: 'bg-purple-500' },
                                                { label: 'Graphic Design', value: 15, color: 'bg-pink-500' },
                                                { label: 'Consulting', value: 10, color: 'bg-green-500' },
                                            ].map((item, i) => (
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
                                    </GlassCard>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-2xl mx-auto space-y-6">
                                <GlassCard className="p-6">
                                    <h3 className="text-lg font-bold mb-6">Profile Settings</h3>
                                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8 text-center md:text-left">
                                        <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl relative group cursor-pointer border-2 border-white/10 shrink-0">
                                            <img
                                                src="/berry_brightson.jpeg"
                                                alt="Berry Brightson"
                                                className="w-full h-full object-cover"
                                            />
                                            <div onClick={() => showAlert("Info", "Avatar upload is disabled in this demo.", "info")} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold">{settings.displayName}</h4>
                                            <p className="text-gray-400">{settings.email}</p>
                                            <button onClick={() => showAlert("Info", "Avatar upload is disabled in this demo.", "info")} className="mt-2 text-sm text-blue-400 hover:text-white transition-colors">Change Avatar</button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">Display Name</label>
                                            <Input
                                                value={settings.displayName}
                                                onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                                                className="bg-white/5 border-white/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">Email Address</label>
                                            <Input
                                                value={settings.email}
                                                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                                                className="bg-white/5 border-white/10"
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <PillButton onClick={handleSaveSettings} className="w-full justify-center">Save Changes</PillButton>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6">
                                    <h3 className="text-lg font-bold mb-6">System Preferences</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => handleTogglePreference('emailNotifications')}>
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <h4 className="font-medium text-white">Email Notifications</h4>
                                                    <p className="text-xs text-gray-500">Receive emails for new requests</p>
                                                </div>
                                            </div>
                                            <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.emailNotifications ? 'bg-blue-600' : 'bg-white/10'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.emailNotifications ? 'right-1' : 'left-1'}`} />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => handleTogglePreference('twoFactor')}>
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <h4 className="font-medium text-white">2FA Security</h4>
                                                    <p className="text-xs text-gray-500">Enable two-factor authentication</p>
                                                </div>
                                            </div>
                                            <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.twoFactor ? 'bg-blue-600' : 'bg-white/10'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.twoFactor ? 'right-1' : 'left-1'}`} />
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
