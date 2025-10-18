import { Router } from "express";
import { imageController } from "../controllers/image.controller";
import { authMiddleWare } from "../middleware";

const router = Router();

// All image routes require authentication
router.use(authMiddleWare);

router.get("/user", (req, res) => imageController.getUserImages(req, res));
router.get("/:id", (req, res) => imageController.getImageById(req, res));
router.delete("/:id", (req, res) => imageController.deleteImage(req, res));
router.post("/bulk", (req, res) => imageController.getBulkImages(req, res));

export default router;
