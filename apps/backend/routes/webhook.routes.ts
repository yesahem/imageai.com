import { Router } from "express";
import { webhookController } from "../controllers/webhook.controller";

const router = Router();

router.post("/image", (req, res) => webhookController.handleImageWebhook(req, res));
router.post("/train", (req, res) => webhookController.handleTrainingWebhook(req, res));

export default router;
