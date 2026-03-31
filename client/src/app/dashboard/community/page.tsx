"use client";

import {
    Compass,
    Sparkles,
    Flame,
    Code2,
    Globe,
    Layout,
    Cpu,
    Cloud,
    Search,
    ArrowUpRight,
    Star,
    Layers,
    Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CommunityPage() {
    const templates = [
        {
            title: "Next.js Boilerplate",
            type: "Web",
            icon: Globe,
            description: "A complete setup with Tailwind, shadcn/ui, and Prisma.",
            stars: 124,
            tech: ["React", "Next.js", "TS"],
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Python Data Science",
            type: "Python",
            icon: Cpu,
            description: "Pre-configured environment with NumPy, Pandas, and Matplotlib.",
            stars: 89,
            tech: ["Python", "Jupyter"],
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "C++ Game Engine",
            type: "C++",
            icon: Flame,
            description: "Core architecture for a lightweight OpenGL-based 2D engine.",
            stars: 215,
            tech: ["C++", "OpenGL"],
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            title: "Fullstack Java App",
            type: "Java",
            icon: Coffee,
            description: "Spring Boot backend with a React admin dashboard.",
            stars: 67,
            tech: ["Java", "Spring", "React"],
            color: "text-red-500",
            bg: "bg-red-500/10"
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-10 space-y-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* HERO SECTION */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 p-8 md:p-16 flex flex-col items-center text-center space-y-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />

                <div className="relative z-10 flex items-center gap-2 text-primary font-black text-sm uppercase tracking-[0.3em]">
                    <Sparkles size={16} />
                    Discovery Engine
                </div>
                <h1 className="relative z-10 text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
                    Build faster with <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">blueprints.</span>
                </h1>
                <p className="relative z-10 text-zinc-400 text-lg md:text-xl max-w-2xl font-medium">
                    Explore a vast library of pre-built templates and community projects to kickstart your next big idea.
                </p>

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 pt-4">
                    <div className="relative group/search w-full sm:w-[400px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-500 group-focus-within/search:text-primary transition-colors" />
                        <input
                            placeholder="Explore templates, users, or languages..."
                            className="w-full bg-zinc-900 border border-zinc-800 px-12 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white font-medium"
                        />
                    </div>
                    <Button size="lg" className="rounded-2xl h-[56px] px-8 bg-white text-black hover:bg-zinc-200 font-bold transition-all active:scale-95">
                        Browse Full Library
                    </Button>
                </div>
            </div>

            {/* CURATED TEMPLATES */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <Layers size={28} className="text-primary" />
                            Curated Templates
                        </h2>
                        <p className="text-muted-foreground font-medium">Verified blueprints to help you get started immediately.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" className="font-bold">Trending</Button>
                        <Button variant="link" className="font-bold text-primary">View All →</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {templates.map((template, i) => (
                        <div
                            key={i}
                            className="bg-muted/30 border border-border/50 rounded-3xl p-6 flex flex-col gap-5 hover:bg-muted/50 transition-all group hover:-translate-y-2"
                        >
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12", template.bg, template.color)}>
                                <template.icon size={24} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold tracking-tight">{template.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                    {template.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1 border-t border-border/50 mt-auto pt-5">
                                {template.tech.map((t, idx) => (
                                    <span key={idx} className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold">
                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                    {template.stars}
                                </div>
                                <Button size="sm" variant="ghost" className="h-8 rounded-lg font-bold gap-2 text-primary hover:text-primary hover:bg-primary/10">
                                    Clone
                                    <ArrowUpRight size={14} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* COMMUNITY FEED SIMULATION */}
            <div className="bg-muted/30 border border-border/50 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
                <div className="absolute -right-20 -bottom-20 opacity-10 blur-3xl w-80 h-80 bg-primary/20 rounded-full" />

                <div className="flex-1 space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                        <Share2 size={12} />
                        Community Stats
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter">Connect with 5,000+ developers.</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                        CodeNShip is more than an IDE. It's a place to share knowledge, find mentors, and collaborate on world-changing code.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <Button className="rounded-xl h-12 px-6 font-bold shadow-lg shadow-primary/20">Join the Discord</Button>
                        <Button variant="outline" className="rounded-xl h-12 px-6 font-bold">Follow Updates</Button>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4 relative z-10">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={cn(
                            "aspect-square rounded-[2rem] bg-background border border-border/60 p-6 flex flex-col justify-between transition-transform hover:scale-105 shadow-xl",
                            i % 2 === 0 ? "translate-y-6" : ""
                        )}>
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-muted-foreground">Recent project</p>
                                <p className="text-sm font-black italic">"Super cool neural network demo..."</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Missing Coffee icon fix
function Coffee(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" x2="6" y1="2" y2="4" />
            <line x1="10" x2="10" y1="2" y2="4" />
            <line x1="14" x2="14" y1="2" y2="4" />
        </svg>
    )
}
