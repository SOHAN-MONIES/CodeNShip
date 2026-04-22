import { Router } from "express";
import { db } from "../db/connection";
import { deployments } from "../db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

// Create a new deployment
router.post("/", async (req, res) => {
    try {
        const { projectId, fileId, content } = req.body;

        if (!projectId || !fileId || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Generate a random 6-character slug
        const slug = Math.random().toString(36).substring(2, 8);

        const newDeployment = await db.insert(deployments).values({
            projectId,
            fileId,
            slug,
            content
        }).returning();

        res.json(newDeployment[0]);
    } catch (error) {
        console.error("Error creating deployment:", error);
        res.status(500).json({ error: "Failed to create deployment" });
    }
});

// Get deployments for a project or all
router.get("/", async (req, res) => {
    try {
        const { projectId } = req.query;
        let result;
        
        if (projectId) {
            result = await db.select().from(deployments).where(eq(deployments.projectId, String(projectId))).orderBy(desc(deployments.createdAt));
        } else {
            result = await db.select().from(deployments).orderBy(desc(deployments.createdAt));
        }
        res.json(result);
    } catch (error) {
        console.error("Error fetching deployments:", error);
        res.status(500).json({ error: "Failed to fetch deployments" });
    }
});

export default router;
