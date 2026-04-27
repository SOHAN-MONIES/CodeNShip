import { Router } from "express";
import { db } from "../db/connection";
import { deployments } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import fs from "fs";
import path from "path";

const router = Router();

// Create a new deployment
router.post("/", async (req, res) => {
    try {
        const { projectId, fileId, content } = req.body;

        if (!projectId || !fileId || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // 1. Create temporary index.html
        const tempFilePath = path.join(__dirname, "../../index.html");
        fs.writeFileSync(tempFilePath, content);

        // 2. Deploy to Vercel
        const html = fs.readFileSync(tempFilePath, "utf-8");

        const vercelResponse = await fetch("https://api.vercel.com/v13/deployments", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "my-html-site",
                files: [
                    {
                        file: "index.html",
                        data: html,
                    },
                ],
                projectSettings: {
                    framework: null, // important for plain HTML
                },
            }),
        });

        const data = await vercelResponse.json();
        
        // 3. Delete temporary index.html
        fs.unlinkSync(tempFilePath);

        if (!vercelResponse.ok) {
            throw new Error(data.error?.message || "Vercel deployment failed");
        }

        const liveUrl = `https://${data.url}`;
        console.log("Live URL:", liveUrl);

        // 4. Save to database
        const newDeployment = await db.insert(deployments).values({
            projectId,
            fileId,
            slug: data.id, // Using Vercel deployment ID as slug
            url: liveUrl,
            content
        }).returning();

        res.json(newDeployment[0]);
    } catch (error) {
        console.error("Error creating deployment:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create deployment" });
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
