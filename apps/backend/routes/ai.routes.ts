import { Router } from "express";
import { modelController } from "../controllers/model.controller";
import { imageController } from "../controllers/image.controller";
import { authMiddleWare } from "../middleware";

const router = Router();

// All AI routes require authentication
router.use(authMiddleWare);

router.post("/trainModel", (req, res) => modelController.trainModel(req, res));
router.post("/generate", (req, res) => imageController.generateImage(req, res));

export default router;
