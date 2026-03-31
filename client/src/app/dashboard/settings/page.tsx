"use client";

import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import {
    User,
    Palette,
    Settings as SettingsIcon,
    Bell,
    Shield,
    Moon,
    Sun,
    Monitor,
    ChevronRight,
    Sparkles,
    Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const { user } = useUser();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState("appearance");

    // Editor Settings State
    const [editorSettings, setEditorSettings] = useState({
        fontSize: 14,
        minimap: true,
        wordWrap: false,
        tabSize: 4,
    });

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("codenship-editor-settings");
        if (stored) {
            try {
                setEditorSettings(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse editor settings", e);
            }
        }
    }, []);

    const updateEditorSetting = (key: string, value: any) => {
        const newSettings = { ...editorSettings, [key]: value };
        setEditorSettings(newSettings);
        localStorage.setItem("codenship-editor-settings", JSON.stringify(newSettings));
    };

    if (!mounted) return null;

    const sections = [
        {
            id: "profile",
            label: "Profile",
            icon: User,
            description: "Manage your personal information and account security.",
        },
        {
            id: "appearance",
            label: "Appearance",
            icon: Palette,
            description: "Customize how CodeNShip looks on your device.",
        },
        {
            id: "editor",
            label: "Code Editor",
            icon: Code2,
            description: "Personalize your coding environment and behavior.",
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: Bell,
            description: "Choose what updates you want to receive.",
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-10 space-y-10 max-w-[1200px] mx-auto animate-in fade-in duration-500">

            {/* HEADER */}
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest">
                    <SettingsIcon size={16} />
                    System Preferences
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
                <p className="text-muted-foreground text-lg font-medium">
                    Manage your account settings and workspace preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* SIDE NAV */}
                <div className="lg:col-span-4 space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-xl transition-all group text-left",
                                activeSection === section.id
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg transition-colors",
                                activeSection === section.id ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-background"
                            )}>
                                <section.icon size={20} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-bold text-sm">{section.label}</p>
                                <p className="text-xs opacity-60 truncate">{section.description}</p>
                            </div>
                            <ChevronRight size={16} className="opacity-40" />
                        </button>
                    ))}
                </div>

                {/* CONTENT AREA */}
                <div className="lg:col-span-8 space-y-8 animate-in slide-in-from-right-4 duration-500">

                    {/* APPEARANCE SECTION */}
                    {activeSection === "appearance" && (
                        <div className="bg-muted/30 border border-border/50 rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Palette size={20} className="text-primary" />
                                    Appearance
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Customize the theme and interface scaling.
                                </p>
                            </div>

                            {/* THEME SELECTOR */}
                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Select Theme</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: "light", label: "Light", icon: Sun, bg: "bg-white text-black" },
                                        { id: "dark", label: "Dark", icon: Moon, bg: "bg-zinc-950 text-white" },
                                        { id: "system", label: "System", icon: Monitor, bg: "bg-gradient-to-br from-white to-zinc-950 text-foreground" },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTheme(t.id)}
                                            className={cn(
                                                "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all group",
                                                theme === t.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border/50 hover:border-border hover:bg-muted/50"
                                            )}
                                        >
                                            <div className={cn("w-full aspect-video rounded-lg flex items-center justify-center border shadow-sm", t.bg)}>
                                                <t.icon size={24} className={cn(theme === t.id && "animate-bounce")} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-tighter">{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EDITOR SECTION */}
                    {activeSection === "editor" && (
                        <div className="bg-muted/30 border border-border/50 rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Code2 size={20} className="text-primary" />
                                    Code Editor
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Manage your editor preferences and behavior.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Font Size */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Font Size</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="10"
                                            max="30"
                                            value={editorSettings.fontSize}
                                            onChange={(e) => updateEditorSetting("fontSize", parseInt(e.target.value))}
                                            className="flex-1 accent-primary"
                                        />
                                        <span className="text-sm font-mono font-bold w-8">{editorSettings.fontSize}</span>
                                    </div>
                                </div>

                                {/* Tab Size */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Tab Size</label>
                                    <select
                                        value={editorSettings.tabSize}
                                        onChange={(e) => updateEditorSetting("tabSize", parseInt(e.target.value))}
                                        className="w-full bg-muted border border-border/50 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    >
                                        <option value={2}>2 Spaces</option>
                                        <option value={4}>4 Spaces</option>
                                        <option value={8}>8 Spaces</option>
                                    </select>
                                </div>

                                {/* Minimap Toggle */}
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border/30">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold tracking-tight">Show Minimap</p>
                                        <p className="text-xs text-muted-foreground">Display a small preview of your code.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={editorSettings.minimap}
                                        onChange={(e) => updateEditorSetting("minimap", e.target.checked)}
                                        className="size-5 rounded border-border text-primary focus:ring-primary"
                                    />
                                </div>

                                {/* Word Wrap Toggle */}
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border/30">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold tracking-tight">Word Wrap</p>
                                        <p className="text-xs text-muted-foreground">Wrap long lines to fit the editor width.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={editorSettings.wordWrap}
                                        onChange={(e) => updateEditorSetting("wordWrap", e.target.checked)}
                                        className="size-5 rounded border-border text-primary focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* USER PROFILE SECTION */}
                    <div className="bg-muted/30 border border-border/50 rounded-3xl p-8 flex items-center justify-between group overflow-hidden relative">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Sparkles size={120} className="text-primary" />
                        </div>

                        <div className="flex items-center gap-6 relative z-10">
                            <img
                                src={user?.imageUrl}
                                alt="avatar"
                                className="w-20 h-20 rounded-2xl border-2 border-primary/20 shadow-xl"
                            />
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black">{user?.fullName}</h3>
                                <p className="text-muted-foreground font-medium">{user?.primaryEmailAddress?.emailAddress}</p>
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Pro Member</span>
                                    <span className="bg-muted text-muted-foreground text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter italic">Joined Jan 2024</span>
                                </div>
                            </div>
                        </div>

                        <Button variant="outline" className="rounded-xl relative z-10">
                            Edit Profile
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
