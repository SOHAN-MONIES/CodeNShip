import { Router } from "express";
import {
    getFiles,
    createFile,
    getFileById,
    updateFile,
    deleteFile,
} from "../controllers/file-controller";

const router = Router();

router.get("/", getFiles);
router.post("/", createFile);
router.get("/:id", getFileById);
router.put("/:id", updateFile);
router.delete("/:id", deleteFile);

export default router;