import type { Request, Response } from "express";
import { modelService } from "../services/model.service";
import { imageService } from "../services/image.service";

export class WebhookController {
  async handleImageWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { request_id, status, output } = req.body;

      if (status === "COMPLETED" && output?.images?.[0]?.url) {
        const imageUrl = output.images[0].url;
        await imageService.updateImageStatus(request_id, imageUrl);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Image webhook error:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  }

  async handleTrainingWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { request_id, status, output } = req.body;

      if (status === "COMPLETED" && output?.diffusers_lora_file?.url) {
        const tensorPath = output.diffusers_lora_file.url;
        await modelService.updateTrainingStatus(request_id, tensorPath);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Training webhook error:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  }
}

export const webhookController = new WebhookController();
