"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import FileExplorer from "@/components/file-explorer/FileExplorer";
import { FileNode } from "@/types/file";
import { useParams } from "next/navigation";
import { getLanguageFromFileName } from "@/lib/getLanguage";
import { Button } from "@/components/ui/button";
import {
    Play,
    Save,
    Terminal as TerminalIcon,
    Trash2,
    FileCode,
    Loader2,
    Cpu,
    Wand2,
    Globe,
    Rocket,
    Sparkles,
    Share2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectWorkspace() {
    const { id: projectId } = useParams();
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [files, setFiles] = useState<FileNode[]>([]);
    const [selectedFile, setSelectedFile] =
        useState<FileNode | null>(null);
    const [code, setCode] = useState("");
    const [language, setLanguage] =
        useState<string>("plaintext");
    const [output, setOutput] = useState<string>("");
    const [isRunning, setIsRunning] = useState(false);
    const [input, setInput] =
        useState<string>("");
    const [editorSettings, setEditorSettings] = useState({
        fontSize: 14,
        minimap: true,
        wordWrap: false,
        tabSize: 4,
    });
    const [isDeploying, setIsDeploying] = useState(false);
    const [isAskingAI, setIsAskingAI] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const socketRef = useRef<Socket | null>(null);

    function buildTree(flatFiles: any[]): FileNode[] {
        const map: Record<string, any> = {};
        const roots: FileNode[] = [];

        flatFiles.forEach((file) => {
            map[file.id] = { ...file, children: [] };
        });

        flatFiles.forEach((file) => {
            if (file.parentId) {
                map[file.parentId]?.children.push(map[file.id]);
            } else {
                roots.push(map[file.id]);
            }
        });

        return roots;
    }


    const fetchFiles = useCallback(async () => {
        if (!projectId) return;

        const res = await fetch(
            `http://localhost:8000/api/files?projectId=${projectId}`
        );

        const data = await res.json();
        const tree = buildTree(data);
        setFiles(tree);

    }, [projectId]);

    /* INITIAL LOAD */
    useEffect(() => {
        fetchFiles();
        setMounted(true);

        // Load Editor Settings
        const stored = localStorage.getItem("codenship-editor-settings");
        if (stored) {
            try {
                setEditorSettings(prev => ({ ...prev, ...JSON.parse(stored) }));
            } catch (e) {
                console.error("Failed to parse editor settings", e);
            }
        }
        
        // Initialize Socket.io
        socketRef.current = io("http://localhost:8000");

        socketRef.current.on("connect", () => {
            if (projectId) {
                socketRef.current?.emit("join-room", projectId);
            }
        });

        socketRef.current.on("code-change", ({ fileId, content }: { fileId: string, content: string }) => {
            setSelectedFile(prev => {
                if (prev && prev.id === fileId) {
                    setCode(content);
                }
                return prev;
            });
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [fetchFiles, projectId]);

    if (!mounted) return null;

    const editorTheme = resolvedTheme === "dark" ? "vs-dark" : "light";

    const handleRun = async () => {
        if (!selectedFile) return;

        setIsRunning(true);
        setOutput("Running...\n");

        try {
            const res = await fetch(
                "http://localhost:8000/api/run",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code,
                        language,
                        input
                    }),
                }
            );

            const data = await res.json();

            if (data.error) {
                setOutput(data.error);
            } else {
                setOutput(data.output || "No output");
            }
        } catch (err) {
            setOutput("Execution failed.");
        }

        setIsRunning(false);
    };

    const handleEditorChange = (val: string | undefined) => {
        const newCode = val || "";
        setCode(newCode);

        if (selectedFile) {
            socketRef.current?.emit("code-change", {
                projectId,
                fileId: selectedFile.id,
                content: newCode
            });
        }
    };

    const handleFileSelect = async (
        file: FileNode
    ) => {
        if (file.type === "folder") return;

        const res = await fetch(
            `http://localhost:8000/api/files/${file.id}`
        );

        const data = await res.json();

        setSelectedFile(file);
        setCode(data.content || "");

        // 👇 LANGUAGE DETECTION
        setLanguage(
            getLanguageFromFileName(file.name)
        );
    };

    const handleSave = async () => {
        if (!selectedFile) return;

        try {
            const res = await fetch(`http://localhost:8000/api/files/${selectedFile.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: code }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Save failed");
            }

            // Update local state content
            const updateLocalContent = (nodes: FileNode[]): FileNode[] => {
                return nodes.map(node => {
                    if (node.id === selectedFile.id) {
                        return { ...node, content: code };
                    }
                    if (node.children) {
                        return { ...node, children: updateLocalContent(node.children) };
                    }
                    return node;
                });
            };
            setFiles(prev => updateLocalContent(prev));

        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save file");
        }
    };

    const handleFormat = async () => {
        if (!selectedFile || !code) return;

        try {
            const res = await fetch("http://localhost:8000/api/format", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language }),
            });

            const data = await res.json();
            if (data.formattedCode) {
                setCode(data.formattedCode);
            } else if (data.error) {
                alert("Formatting failed: " + data.error);
            }
        } catch (err) {
            console.error("Format error:", err);
            alert("Formatting failed.");
        }
    };

    const handleDeploy = async () => {
        if (!selectedFile || !code) return;
        setIsDeploying(true);

        try {
            const res = await fetch("http://localhost:8000/api/deployments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    projectId, 
                    fileId: selectedFile.id, 
                    content: code 
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Deploy failed");
            }

            const deployUrl = data.url;
            
            // For now just alert the URL, we could also open it in a new tab or show a toast
            alert(`Deployed successfully! View at: ${deployUrl}`);
            window.open(deployUrl, "_blank");
        } catch (err) {
            console.error("Deploy error:", err);
            alert("Deployment failed.");
        } finally {
            setIsDeploying(false);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
            alert("Failed to copy link.");
        }
    };

    const handleAskAI = async () => {
        if (!input.trim()) {
            setOutput("Please enter a prompt in the Program Input box below to ask the AI.");
            return;
        }

        setIsAskingAI(true);
        setOutput("Asking AI (phi3)...\n");

        try {
            const res = await fetch("http://localhost:8000/api/ai/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    language,
                    prompt: input,
                }),
            });

            const data = await res.json();
            
            if (data.error) {
                setOutput(`Error: ${data.error}`);
            } else {
                setOutput(`🤖 AI Response:\n\n${data.result}`);
            }
        } catch (err) {
            console.error("AI error:", err);
            setOutput("Failed to communicate with AI.");
        } finally {
            setIsAskingAI(false);
        }
    };

    return (
        <div className="h-[calc(100vh-40px)] w-full">

            <ResizablePanelGroup
                orientation="horizontal"
                className="h-full"
            >

                {/* EXPLORER */}
                <ResizablePanel
                    defaultSize="18%"
                    minSize="12%"
                    maxSize="25%"
                >
                    <div className="h-full bg-background border-r p-2 overflow-auto border-border">
                        <FileExplorer
                            files={files}
                            onSelect={handleFileSelect}
                            onCreated={fetchFiles}></FileExplorer>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* RIGHT SIDE */}
                <ResizablePanel defaultSize="82%">

                    <ResizablePanelGroup
                        orientation="vertical"
                        className="h-full"
                    >

                        {/* EDITOR */}
                        <ResizablePanel
                            defaultSize="75%"
                            minSize="40%"
                        >
                            <div className="h-full flex flex-col">

                                {/* Top bar */}
                                <div className="h-12 border-b px-6 flex items-center justify-between bg-background/50 backdrop-blur-md text-sm sticky top-0 z-10 border-border">
                                    {/* LEFT — File Name */}
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-500/10 rounded-md text-blue-500">
                                            <FileCode size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider leading-none">Selected File</span>
                                            <span className="font-semibold text-foreground">
                                                {selectedFile ? selectedFile.name : "No file selected"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* RIGHT — Actions */}
                                    {selectedFile && (
                                        <div className="flex items-center gap-3">
                                            {/* SAVE */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleSave}
                                                className="border-border bg-background hover:bg-accent text-foreground h-8 font-medium transition-all active:scale-95 shadow-sm"
                                            >
                                                <Save size={14} className="mr-1.5" />
                                                Save
                                            </Button>

                                            {/* ASK AI */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAskAI}
                                                disabled={isAskingAI}
                                                className="border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 h-8 font-medium transition-all active:scale-95"
                                                title="Ask AI with Ollama"
                                            >
                                                {isAskingAI ? (
                                                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                                                ) : (
                                                    <Sparkles size={14} className="mr-1.5" />
                                                )}
                                                Ask AI
                                            </Button>

                                            {/* FORMAT */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleFormat}
                                                className="border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 h-8 font-medium transition-all active:scale-95"
                                                title="Beautify Code"
                                            >
                                                <Wand2 size={14} className="mr-1.5" />
                                                Format
                                            </Button>

                                            {/* DEPLOY (HTML ONLY) */}
                                            {language === "html" && (
                                                <Button
                                                    size="sm"
                                                    onClick={handleDeploy}
                                                    disabled={isDeploying}
                                                    className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20 h-8 font-semibold transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {isDeploying ? (
                                                        <Loader2 size={14} className="mr-1.5 animate-spin" />
                                                    ) : (
                                                        <Rocket size={14} className="mr-1.5 fill-current" />
                                                    )}
                                                    Deploy
                                                </Button>
                                            )}

                                            {/* RUN */}
                                            {language !== "html" && (
                                                <Button
                                                    size="sm"
                                                    onClick={handleRun}
                                                    disabled={isRunning}
                                                    className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20 h-8 font-semibold transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {isRunning ? (
                                                        <Loader2 size={14} className="mr-1.5 animate-spin" />
                                                    ) : (
                                                        <Play size={14} className="mr-1.5 fill-current" />
                                                    )}
                                                    {isRunning ? "Running..." : "Run"}
                                                </Button>
                                            )}

                                            {/* SHARE */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleShare}
                                                className="border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 h-8 font-medium transition-all active:scale-95"
                                                title="Share Collaborative Link"
                                            >
                                                <Share2 size={14} className="mr-1.5" />
                                                {isCopied ? "Copied!" : "Share"}
                                            </Button>
                                        </div>
                                    )}
                                </div>


                                <div className="flex-1 min-h-0">
                                    {selectedFile ? (
                                        language === "html" ? (
                                            <ResizablePanelGroup orientation="horizontal">
                                                <ResizablePanel defaultSize={50} minSize={20}>
                                                    <Editor
                                                        height="100%"
                                                        theme={editorTheme}
                                                        language={language}
                                                        value={code}
                                                        options={{
                                                            automaticLayout: true,
                                                            minimap: { enabled: editorSettings.minimap },
                                                            fontSize: editorSettings.fontSize,
                                                            wordWrap: editorSettings.wordWrap ? "on" : "off",
                                                            tabSize: editorSettings.tabSize,
                                                            fontFamily: "var(--font-geist-mono)",
                                                            padding: { top: 15 },
                                                            scrollbar: {
                                                                vertical: "visible",
                                                                horizontal: "visible",
                                                            },
                                                        }}
                                                        onChange={handleEditorChange}
                                                    />
                                                </ResizablePanel>
                                                <ResizableHandle withHandle />
                                                <ResizablePanel defaultSize={50} minSize={20}>
                                                    <div className="h-full flex flex-col border-l border-border bg-white dark:bg-zinc-950">
                                                        <div className="h-10 px-4 flex items-center justify-between border-b border-border text-xs bg-muted/30 backdrop-blur-sm">
                                                            <div className="flex items-center gap-2 text-primary">
                                                                <Globe size={14} />
                                                                <span className="font-semibold uppercase tracking-widest text-[10px]">Browser Preview</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 bg-white overflow-hidden pointer-events-auto">
                                                            <iframe 
                                                                srcDoc={code} 
                                                                className="w-full h-full border-0 outline-none bg-white" 
                                                                title="HTML Preview"
                                                                sandbox="allow-scripts allow-modals"
                                                            />
                                                        </div>
                                                    </div>
                                                </ResizablePanel>
                                            </ResizablePanelGroup>
                                        ) : (
                                            <Editor
                                                height="100%"
                                                theme={editorTheme}
                                                language={language}
                                                value={code}
                                                options={{
                                                    automaticLayout: true,
                                                    minimap: { enabled: editorSettings.minimap },
                                                    fontSize: editorSettings.fontSize,
                                                    wordWrap: editorSettings.wordWrap ? "on" : "off",
                                                    tabSize: editorSettings.tabSize,
                                                    fontFamily: "var(--font-geist-mono)",
                                                    padding: { top: 15 },
                                                    scrollbar: {
                                                        vertical: "visible",
                                                        horizontal: "visible",
                                                    },
                                                }}
                                                onChange={handleEditorChange}
                                            />
                                        )
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">
                                            Select a file to start coding
                                        </div>
                                    )}
                                </div>

                            </div>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* TERMINAL */}
                        <ResizablePanel
                            defaultSize="25%"
                            minSize="15%"
                            maxSize="50%"

                        >

                            <div className="h-full bg-background border-t border-border flex flex-col shadow-inner">
                                {/* HEADER */}
                                <div className="h-10 px-4 flex items-center justify-between border-b border-border text-xs bg-muted/30 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-primary">
                                        <TerminalIcon size={14} />
                                        <span className="font-semibold uppercase tracking-widest text-[10px]">Output Terminal</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isRunning && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-500 text-[10px] font-bold border border-green-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500 animate-pulse" />
                                                RUNNING
                                            </div>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={() => setOutput("")}
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            title="Clear Output"
                                        >
                                            <Trash2 size={13} />
                                        </Button>
                                    </div>
                                </div>

                                {/* INPUT BOX */}
                                <div className="group relative flex flex-col border-b border-border bg-muted/10">
                                    <div className="absolute left-3 top-2.5 flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors uppercase tracking-wider">
                                        <Cpu size={12} />
                                        Program Input / AI Prompt
                                    </div>
                                    <textarea
                                        placeholder="Enter program input, or ask AI a question here..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="bg-transparent text-foreground text-sm p-4 pt-8 outline-none resize-none h-28 focus:bg-accent/50 transition-all font-mono placeholder:text-muted-foreground/60 dark:placeholder:text-muted-foreground/30 selection:bg-primary/30"
                                    />
                                </div>

                                {/* OUTPUT */}
                                <div className="flex-1 min-h-0 p-5 overflow-auto text-sm font-mono text-foreground whitespace-pre-wrap selection:bg-primary/30">
                                    {output ? (
                                        <div className={cn(
                                            "animate-in fade-in slide-in-from-left-2 duration-300",
                                            output.includes("Execution failed") || output.includes("Error:") ? "text-destructive" : "text-green-600 dark:text-green-400"
                                        )}>
                                            {output}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground/70 dark:text-muted-foreground/50 italic font-light">No output to display. Run code to see results.</span>
                                    )}
                                </div>
                            </div>
                        </ResizablePanel>


                    </ResizablePanelGroup>

                </ResizablePanel>

            </ResizablePanelGroup>

        </div>
    );
}