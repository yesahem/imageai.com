import { FalAiModel } from "../models/FalAiModel";

export class AIService {
  private falAiModel: FalAiModel;

  constructor() {
    this.falAiModel = new FalAiModel();
  }

  async trainModel(zipUrls: string, triggerWord: string) {
    return await this.falAiModel.trainModel(zipUrls, triggerWord);
  }

  async generateImage(tensorPath: string, prompt: string, scale: number = 1) {
    return await this.falAiModel.generateImage(prompt, tensorPath, scale);
  }
}

export const aiService = new AIService();
