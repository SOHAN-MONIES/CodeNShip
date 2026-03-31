export type FileNode = {
    id: string;
    name: string;
    type: "file" | "folder";
    content?: string | null;
    language?: string | null;
    parentId?: string | null;
    children?: FileNode[];
};