import type { Request, Response } from "express";
import { packService } from "../services/pack.service";
import { modelService } from "../services/model.service";
import { imageService } from "../services/image.service";
import { aiService } from "../services/ai.service";

export class PackController {
  async getAllPacks(req: Request, res: Response): Promise<void> {
    try {
      const packs = await packService.getAllPacks();
      res.json(packs);
    } catch (error) {
      console.error("Error fetching packs:", error);
      res.status(500).json({ message: "Failed to fetch packs" });
    }
  }

  async getPackById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const pack = await packService.getPackById(id);

      if (!pack) {
        res.status(404).json({ message: "Pack not found" });
        return;
      }

      res.json(pack);
    } catch (error) {
      console.error("Error fetching pack:", error);
      res.status(500).json({ message: "Failed to fetch pack" });
    }
  }

  async generateFromPack(req: Request, res: Response): Promise<void> {
    try {
      const { modelId, packId } = req.body;
      const userId = req.userId!;

      const [model, prompts] = await Promise.all([
        modelService.getModelById(modelId),
        packService.getPackPrompts(packId),
      ]);

      if (!model) {
        res.status(404).json({ message: "Model not found" });
        return;
      }

      if (!model.tensorPath) {
        res.status(400).json({ message: "Model training not completed" });
        return;
      }

      if (!prompts || prompts.length === 0) {
        res.status(404).json({ message: "No prompts found in pack" });
        return;
      }

      const imagePromises = prompts.map(async (promptObj) => {
        const response = await aiService.generateImage(
          model.tensorPath!,
          promptObj.prompt
        );

        return {
          prompt: promptObj.prompt,
          userId,
          modelId,
          imageUrl: "",
          falAiRequestId: response.request_id,
        };
      });

      const imageDataArray = await Promise.all(imagePromises);
      const images = await imageService.createManyImages(imageDataArray);

      res.json({
        message: `Started generating ${images.length} images from pack`,
        images,
      });
    } catch (error) {
      console.error("Error generating from pack:", error);
      res.status(500).json({ message: "Failed to generate images from pack" });
    }
  }
}

export const packController = new PackController();
