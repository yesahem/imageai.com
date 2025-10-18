import { Router } from "express";
import { packController } from "../controllers/pack.controller";
import { authMiddleWare } from "../middleware";

const router = Router();

router.get("/bulk", (req, res) => packController.getAllPacks(req, res));
router.get("/:id", (req, res) => packController.getPackById(req, res));
router.post("/generate", authMiddleWare, (req, res) => packController.generateFromPack(req, res));

export default router;
