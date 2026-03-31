import { Request, Response } from "express";
import { db } from "../db/connection";
import { projects } from "../db/schema/project";
import { eq } from "drizzle-orm";

/**

 * CREATE PROJECT
 * POST /api/projects
 */
export const createProject = async (
    req: Request,
    res: Response
) => {
    try {
        const { name, type, userId } = req.body;

        if (!name || !type || !userId) {
            return res.status(400).json({
                error: "name, type and userId are required",
            });
        }

        const [newProject] = await db
            .insert(projects)
            .values({
                name,
                type,
                userId,
            })
            .returning();

        return res.status(201).json(newProject);
    } catch (error) {
        console.error("Create project error:", error);
        return res.status(500).json({
            error: "Failed to create project",
        });
    }
};

/**

 * GET PROJECTS (by user)
 * GET /api/projects?userId=xyz
 */
export const getProjects = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.query.userId as string;

        if (!userId) {
            return res.status(400).json({
                error: "userId query param is required",
            });
        }

        const userProjects = await db
            .select()
            .from(projects)
            .where(eq(projects.userId, userId));

        return res.json(userProjects);
    } catch (error) {
        console.error("Get projects error:", error);
        return res.status(500).json({
            error: "Failed to fetch projects",
        });
    }
};

/**

 * DELETE PROJECT
 * DELETE /api/projects/:id
 */
export const deleteProject = async (
    req: Request,
    res: Response
) => {
    try {
        const id  = req.params.id as string;

        if (!id) {
            return res.status(400).json({
                error: "Project ID is required",
            });
        }

        await db
            .delete(projects)
            .where(eq(projects.id, id));

        return res.json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete project error:", error);
        return res.status(500).json({
            error: "Failed to delete project",
        });
    }
};


export const getProjectById = async (
    req: Request,
    res: Response
) => {
    const id = req.params.id as string;

    const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id));

    res.json(project);
};
