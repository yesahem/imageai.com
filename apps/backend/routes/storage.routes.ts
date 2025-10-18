import { Router } from "express";
import { storageController } from "../controllers/storage.controller";

const router = Router();

router.get("/preSignURLs", (req, res) => storageController.getPresignedUrls(req, res));

export default router;
