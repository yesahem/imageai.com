import type { Request, Response } from "express";
import { imageService } from "../services/image.service";
import { modelService } from "../services/model.service";
import { aiService } from "../services/ai.service";

export class ImageController {
  async getUserImages(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const images = await imageService.getUserImages(userId, limit, offset);
      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  }

  async getImageById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const image = await imageService.getImageById(id);

      if (!image) {
        res.status(404).json({ message: "Image not found" });
        return;
      }

      res.json(image);
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ message: "Failed to fetch image" });
    }
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await imageService.deleteImage(id);
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  }

  async generateImage(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, modelId } = req.body;
      const userId = req.userId!;

      const model = await modelService.getModelById(modelId);
      if (!model) {
        res.status(404).json({ message: "Model not found" });
        return;
      }

      if (!model.tensorPath) {
        res.status(400).json({ message: "Model training not completed" });
        return;
      }

      const response = await aiService.generateImage(model.tensorPath, prompt);

      const image = await imageService.createImage({
        prompt,
        imageUrl: "",
        modelId,
        userId,
        falAiRequestId: response.request_id,
      });

      res.json({ message: "Image generation started", image });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  }

  async getBulkImages(req: Request, res: Response): Promise<void> {
    try {
      const { imageIds } = req.body;
      const userId = req.userId!;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      if (!imageIds || !Array.isArray(imageIds)) {
        res.status(400).json({ message: "imageIds array required" });
        return;
      }

      const images = await imageService.getBulkImages(imageIds, userId, limit, offset);
      res.json(images);
    } catch (error) {
      console.error("Error fetching bulk images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  }
}

export const imageController = new ImageController();
