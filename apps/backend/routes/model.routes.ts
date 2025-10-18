import { Router } from "express";
import { modelController } from "../controllers/model.controller";
import { authMiddleWare } from "../middleware";

const router = Router();

// All model routes require authentication
router.use(authMiddleWare);

router.get("/user", (req, res) => modelController.getUserModels(req, res));
router.get("/:id", (req, res) => modelController.getModelById(req, res));
router.patch("/:id", (req, res) => modelController.updateModel(req, res));
router.delete("/:id", (req, res) => modelController.deleteModel(req, res));
router.get("/:id/images", (req, res) => modelController.getModelImages(req, res));

export default router;
