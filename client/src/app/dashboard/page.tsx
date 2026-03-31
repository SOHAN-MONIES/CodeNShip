"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Layout, Search, ArrowRight, Zap, FolderKanban, Sparkles, BarChart3 } from "lucide-react";
import ProjectCard from "./ProjectCard";
import CreateProjectDialog from "./CreateProjectDialog";
import { Project } from "@/types/project";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [open, setOpen] = useState(false);
    const { user } = useUser();

    // 🔹 FETCH PROJECTS
    useEffect(() => {
        if (!user) return;

        const fetchProjects = async () => {
            const res = await fetch(
                `http://localhost:8000/api/projects?userId=${user.id}`
            );

            const data = await res.json();
            setProjects(data);
        };

        fetchProjects();
    }, [user]);

    // 🔹 GREETING LOGIC
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // 🔹 DELETE LOGIC (FULL)
    const handleDelete = async (id: string) => {
        try {
            const confirmDelete = confirm(
                "Are you sure you want to delete this project?"
            );
            if (!confirmDelete) return;

            const res = await fetch(
                `http://localhost:8000/api/projects/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) {
                throw new Error("Delete failed");
            }

            // Remove from state instantly
            setProjects((prev) =>
                prev.filter((p) => p.id !== id)
            );

        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete project");
        }
    };

    const stats = [
        { label: "Total Projects", value: projects.length, icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Recently Active", value: projects.slice(0, 3).length, icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { label: "Community Shares", value: 0, icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* WELCOME HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest">
                        <Sparkles size={16} />
                        CodeNShip Overview
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        {getGreeting()}, <span className="text-primary">{user?.firstName || "Developer"}</span>
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium">
                        Welcome back! Here's what's happening in your workspace today.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group/search hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
                        <input
                            placeholder="Find a project..."
                            className="bg-muted px-9 py-2.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm w-64"
                        />
                    </div>
                    <Button
                        onClick={() => setOpen(true)}
                        size="lg"
                        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 gap-2 px-6"
                    >
                        <Plus className="h-5 w-5" />
                        Create New Project
                    </Button>
                </div>
            </div>

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="bg-muted/30 border border-border/50 p-6 rounded-2xl flex items-center gap-5 hover:bg-muted/50 transition-colors group"
                    >
                        <div className={cn("p-3.5 rounded-xl transition-all group-hover:scale-110", stat.bg, stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* PROJECTS SECTION */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Layout size={20} className="text-primary" />
                            Recent Projects
                        </h2>
                        <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            Active
                        </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted font-bold gap-2">
                        View All
                        <ArrowRight size={14} />
                    </Button>
                </div>

                {projects.length === 0 ? (
                    <div className="border border-dashed border-border/60 rounded-3xl p-20 text-center space-y-4 bg-muted/10">
                        <div className="mx-auto bg-muted rounded-full w-16 h-16 flex items-center justify-center">
                            <FolderKanban size={32} className="text-muted-foreground/40" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-bold text-foreground">No projects found</p>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                It looks like you haven't created any projects yet. Start your journey with a new one!
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => setOpen(true)} className="rounded-xl border-primary/20 hover:bg-primary/5 text-primary">
                            Create First Project
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, i) => (
                            <div key={project.id} className="animate-in fade-in slide-in-from-bottom-5 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                <ProjectCard
                                    project={project}
                                    onDelete={handleDelete}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Dialog */}
            <CreateProjectDialog
                open={open}
                setOpen={setOpen}
                onCreated={(p: Project) =>
                    setProjects((prev) => [...prev, p])
                }
            />
        </div>
    );
}