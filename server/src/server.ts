import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config"
import projectRoutes from "./routes/project-routes";
import fileRoutes from "./routes/file-routes";
import runRoutes from "./routes/run-routes";
import formatRoutes from "./routes/format-routes";
import deployRoutes from "./routes/deploy-routes";
import aiRoutes from "./routes/ai-routes";
import { db } from "./db/connection";
import { deployments } from "./db/schema";
import { eq } from "drizzle-orm";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/run", runRoutes);
app.use("/api/format", formatRoutes);
app.use("/api/deployments", deployRoutes);
app.use("/api/ai", aiRoutes);

// Public route to serve the deployed HTML
app.get("/d/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await db.select().from(deployments).where(eq(deployments.slug, slug));
        
        if (result.length === 0) {
            return res.status(404).send("Deployment not found");
        }
        res.setHeader('Content-Type', 'text/html');
        res.send(result[0].content);
    } catch (e) {
        res.status(500).send("Server Error");
    }
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // allow all origins for now
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    socket.on("join-room", (projectId: string) => {
        socket.join(projectId);
        console.log(`[Socket] ${socket.id} joined room: ${projectId}`);
    });

    socket.on("code-change", ({ projectId, fileId, content }: { projectId: string, fileId: string, content: string }) => {
        // Broadcast the change to everyone else in the room
        socket.to(projectId).emit("code-change", { fileId, content });
    });

    socket.on("disconnect", () => {
        console.log(`[Socket] User disconnected: ${socket.id}`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
});