import express from "express";
import cors from "cors";
import "dotenv/config"
import projectRoutes from "./routes/project-routes";
import fileRoutes from "./routes/file-routes";
import runRoutes from "./routes/run-routes";
import formatRoutes from "./routes/format-routes";


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/run", runRoutes);
app.use("/api/format", formatRoutes);
app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
});