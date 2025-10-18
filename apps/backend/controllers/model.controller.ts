import type { Request, Response } from "express";
import { modelService } from "../services/model.service";
import { aiService } from "../services/ai.service";
import type { ModelTraningInput } from "common/infered";

export class ModelController {
  async getUserModels(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const models = await modelService.getUserModels(userId);
      res.json(models);
    } catch (error) {
      console.error("Error fetching models:", error);
      res.status(500).json({ message: "Failed to fetch models" });
    }
  }

  async getModelById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const model = await modelService.getModelById(id);

      if (!model) {
        res.status(404).json({ message: "Model not found" });
        return;
      }

      res.json(model);
    } catch (error) {
      console.error("Error fetching model:", error);
      res.status(500).json({ message: "Failed to fetch model" });
    }
  }

  async updateModel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, prompt } = req.body;

      const updatedModel = await modelService.updateModel(id, { name, prompt });
      res.json(updatedModel);
    } catch (error) {
      console.error("Error updating model:", error);
      res.status(500).json({ message: "Failed to update model" });
    }
  }

  async deleteModel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await modelService.deleteModel(id);
      res.json({ message: "Model deleted successfully" });
    } catch (error) {
      console.error("Error deleting model:", error);
      res.status(500).json({ message: "Failed to delete model" });
    }
  }

  async trainModel(req: Request, res: Response): Promise<void> {
    try {
      const data: ModelTraningInput = req.body;
      const userId = req.userId!;

      const response = await aiService.trainModel(data.zipUrls, data.name);

      const model = await modelService.createModel(
        data,
        userId,
        response.request_id
      );

      res.json({ message: "Model training started", model });
    } catch (error) {
      console.error("Error training model:", error);
      res.status(500).json({ message: "Failed to start model training" });
    }
  }

  async getModelImages(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const images = await modelService.getModelImages(id, limit, offset);
      res.json(images);
    } catch (error) {
      console.error("Error fetching model images:", error);
      res.status(500).json({ message: "Failed to fetch model images" });
    }
  }
}

export const modelController = new ModelController();
