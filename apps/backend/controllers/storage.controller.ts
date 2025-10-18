import type { Request, Response } from "express";
import { storageService } from "../services/storage.service";

export class StorageController {
  async getPresignedUrls(req: Request, res: Response): Promise<void> {
    try {
      const { numberOfImages } = req.query;
      const numImages = parseInt(numberOfImages as string) || 1;

      const preSignURLs = Array.from({ length: numImages }, () => {
        const key = storageService.generateStorageKey("models");
        const url = storageService.generatePresignedUrl(key);
        return { key, url };
      });

      res.json({ preSignURLs });
    } catch (error) {
      console.error("Error generating presigned URLs:", error);
      res.status(500).json({ message: "Failed to generate presigned URLs" });
    }
  }
}

export const storageController = new StorageController();
