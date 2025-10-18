import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authMiddleWare } from "../middleware";

const router = Router();

// All user routes require authentication
router.use(authMiddleWare);

router.get("/profile", (req, res) => userController.getUserProfile(req, res));

export default router;
