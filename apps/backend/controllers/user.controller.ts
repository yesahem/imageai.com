import type { Request, Response } from "express";
import { userService } from "../services/user.service";

export class UserController {
  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const profile = await userService.getUserProfile(userId);

      if (!profile) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  }
}

export const userController = new UserController();
