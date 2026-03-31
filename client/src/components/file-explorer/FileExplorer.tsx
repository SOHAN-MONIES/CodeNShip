"use client";

import { useState } from "react";
import { FileNode } from "@/types/file";
import { ChevronRight, ChevronDown, FolderPlus, FilePlus, Search, FolderOpen, MoreVertical } from "lucide-react";
import { useParams } from "next/navigation";
import { getFileIcon } from "@/lib/getFileIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
    files: FileNode[];
    onSelect: (file: FileNode) => void;
    onCreated: () => void; // refresh tree
};

export default function FileExplorer({
    files,
    onSelect,
    onCreated,
}: Props) {
    const { id: projectId } = useParams();

    const [createType, setCreateType] =
        useState<"file" | "folder" | null>(null);

    const [name, setName] = useState("");
    const [parentId, setParentId] =
        useState<string | null>(null);

    /* CREATE FILE/FOLDER */
    const handleCreate = async () => {
        if (!name) return;

        await fetch("http://localhost:8000/api/files", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                projectId,
                parentId,
                name,
                type: createType,
            }),
        });

        setCreateType(null);
        setName("");
        onCreated();
    };

    return (
        <div className="h-full flex flex-col text-sm select-none">
            {/* TOOLBAR */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 mb-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 focus:text-primary transition-colors">
                    <FolderOpen size={14} className="text-primary" />
                    Explorer
                </span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                            setCreateType("file");
                            setParentId(null);
                        }}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-all active:scale-90"
                        title="New File"
                    >
                        <FilePlus size={18} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                            setCreateType("folder");
                            setParentId(null);
                        }}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-all active:scale-90"
                        title="New Folder"
                    >
                        <FolderPlus size={18} />
                    </Button>
                </div>
            </div>

            {/* TREE */}
            {files.map((node) => (
                <FileItem
                    key={node.id}
                    node={node}
                    onSelect={onSelect}
                    onCreate={(type, parentId) => {
                        setCreateType(type);
                        setParentId(parentId);
                    }}
                />
            ))}

            {/* CREATE DIALOG */}
            {createType && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-[100] animate-in fade-in duration-200">
                    <div className="bg-background border border-border p-5 rounded-xl shadow-2xl space-y-4 w-72 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                                {createType === "file" ? <FilePlus size={18} className="text-blue-500" /> : <FolderPlus size={18} className="text-yellow-500" />}
                                New {createType}
                            </h2>
                            <p className="text-[11px] text-muted-foreground">Enter a name for your new {createType}.</p>
                        </div>

                        <input
                            autoFocus
                            className="w-full p-2.5 rounded-lg bg-muted/40 border border-border text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/60 dark:placeholder:text-muted-foreground/30"
                            placeholder={`${createType} name...`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCreateType(null)}
                                className="text-xs h-8 text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </Button>

                            <Button
                                size="sm"
                                onClick={handleCreate}
                                className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* -------------------------------- */
/* FILE ITEM (Recursive)            */
/* -------------------------------- */

function FileItem({
    node,
    onSelect,
    onCreate,
}: {
    node: FileNode;
    onSelect: (file: FileNode) => void;
    onCreate: (
        type: "file" | "folder",
        parentId: string
    ) => void;
}) {
    const [open, setOpen] = useState(false);
    const isFolder = node.type === "folder";

    return (
        <div>
            <div
                className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 hover:bg-accent/60 rounded-md cursor-pointer group transition-all duration-200 outline-none focus:bg-accent",
                    "border border-transparent select-none active:scale-[0.98]"
                )}
                onClick={() => {
                    if (isFolder) {
                        setOpen(!open);
                    } else {
                        onSelect(node);
                    }
                }}
            >
                <div className="flex items-center justify-center w-4">
                    {isFolder ? (
                        open ? (
                            <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                        ) : (
                            <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                        )
                    ) : null}
                </div>

                {/* Integration of getFileIcon */}
                <div className="flex items-center justify-center w-5 h-5 transition-transform duration-200 group-hover:scale-110">
                    {getFileIcon(node.name, node.type, open)}
                </div>

                <span className={cn(
                    "flex-1 truncate transition-colors",
                    "text-muted-foreground group-hover:text-foreground",
                    !isFolder && "font-medium"
                )}>
                    {node.name}
                </span>

                {/* CREATE INSIDE FOLDER */}
                {isFolder && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCreate("file", node.id);
                            }}
                            className="p-1 hover:bg-accent rounded-md text-muted-foreground hover:text-blue-500 transition-colors"
                            title="New File"
                        >
                            <FilePlus size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCreate("folder", node.id);
                            }}
                            className="p-1 hover:bg-accent rounded-md text-muted-foreground hover:text-yellow-500 transition-colors"
                            title="New Folder"
                        >
                            <FolderPlus size={16} />
                        </button>
                    </div>
                )}
            </div>

            {isFolder &&
                open &&
                node.children && (
                    <div className="ml-4 border-l border-border pl-2">
                        {node.children.map((child) => (
                            <FileItem
                                key={child.id}
                                node={child}
                                onSelect={onSelect}
                                onCreate={onCreate}
                            />
                        ))}
                    </div>
                )}
        </div>
    );
}
