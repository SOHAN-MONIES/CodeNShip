import { Request, Response } from "express";
import { db } from "../db/connection";
import { files } from "../db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/files?projectId=xxx
export const getFiles = async (
    req: Request,
    res: Response
) => {
    try {
        const { projectId } = req.query;

        if (!projectId || typeof projectId !== "string") {
            return res.status(400).json({
                error: "projectId is required",
            });
        }

        const projectFiles = await db
            .select()
            .from(files)
            .where(eq(files.projectId, projectId));

        return res.json(projectFiles);
    } catch (error) {
        console.error("Get files error:", error);
        return res.status(500).json({
            error: "Failed to fetch files",
        });
    }
};

// POST /api/files
export const createFile = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            projectId,
            parentId,
            name,
            type,
            language,
        } = req.body;

        if (!projectId || !name || !type) {
            return res.status(400).json({
                error: "Missing required fields",
            });
        }

        const [newFile] = await db
            .insert(files)
            .values({
                projectId,
                parentId: parentId || null,
                name,
                type,
                language: language || null,
                content: type === "file" ? "" : null,
            })
            .returning();

        return res.status(201).json(newFile);
    } catch (error) {
        console.error("Create file error:", error);
        return res.status(500).json({
            error: "Failed to create file",
        });
    }
};

// GET /api/files/:id
export const getFileById = async (
    req: Request,
    res: Response
) => {
    try {
        const id = req.params.id as string;

        const [file] = await db
            .select()
            .from(files)
            .where(eq(files.id, id));

        if (!file) {
            return res.status(404).json({
                error: "File not found",
            });
        }

        return res.json(file);
    } catch (error) {
        console.error("Get file error:", error);
        return res.status(500).json({
            error: "Failed to fetch file",
        });
    }
};
// PUT /api/files/:id
export const updateFile = async (
    req: Request,
    res: Response
) => {
    try {
        const  id  = req.params.id as string;
        const { content } = req.body;

        if (content === undefined) {
            return res.status(400).json({
                error: "Content is required",
            });
        }

        const [updated] = await db
            .update(files)
            .set({ content })
            .where(eq(files.id, id))
            .returning();

        return res.json(updated);
    } catch (error) {
        console.error("Update file error:", error);
        return res.status(500).json({
            error: "Failed to update file",
        });
    }
};
// DELETE /api/files/:id
export const deleteFile = async (
    req: Request,
    res: Response
) => {
    try {
        const  id  = req.params.id as string;

        await db
            .delete(files)
            .where(eq(files.id, id));

        return res.json({
            message: "Deleted successfully",
        });
    } catch (error) {
        console.error("Delete file error:", error);
        return res.status(500).json({
            error: "Failed to delete file",
        });
    }
};