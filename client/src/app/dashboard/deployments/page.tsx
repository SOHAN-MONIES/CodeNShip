"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Copy, ExternalLink, Globe, LayoutTemplate, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Deployment {
    id: string;
    projectId: string;
    fileId: string;
    slug: string;
    url?: string;
    createdAt: string;
}

export default function DeploymentsPage() {
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDeployments() {
            try {
                const res = await fetch("http://localhost:8000/api/deployments");
                if (res.ok) {
                    const data = await res.json();
                    setDeployments(data);
                }
            } catch (e) {
                console.error("Failed to fetch deployments:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchDeployments();
    }, []);

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        alert("Copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Globe className="h-8 w-8 animate-pulse text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-background p-6 lg:p-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Rocket className="h-8 w-8 text-purple-500" />
                        Deployments
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage your deployed HTML sites and public links.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {deployments.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-xl">
                        <LayoutTemplate className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No Deployments Yet</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">
                            Deploy your HTML files from the editor to see them here as live, shareable websites.
                        </p>
                    </div>
                ) : (
                    deployments.map((dep) => {
                        const url = dep.url || `http://localhost:8000/d/${dep.slug}`;
                        return (
                            <div
                                key={dep.id}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-5 w-5 text-purple-400" />
                                            <span className="font-semibold text-lg">{dep.slug}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-sm text-muted-foreground mb-6">
                                        <p>Project ID: <span className="font-mono text-xs">{dep.projectId.substring(0, 8)}...</span></p>
                                        <p>Deployed: {format(new Date(dep.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-purple-500 transition-colors"
                                        onClick={() => window.open(url, "_blank")}
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Visit Site
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => copyToClipboard(url)}
                                        title="Copy URL"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
