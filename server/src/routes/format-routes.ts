import { Router } from "express";
import { formatCode } from "../controllers/format-controller";

const router = Router();

router.post("/", formatCode);

export default router;
