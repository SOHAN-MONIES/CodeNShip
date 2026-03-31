import { Router } from "express";
import {
    createProject,
    getProjects,
    deleteProject, getProjectById,
} from "../controllers/project-controller";

const router = Router();

router.post("/", createProject);
router.get("/", getProjects);
router.delete("/:id", deleteProject);
router.get("/:id", getProjectById);
export default router;
