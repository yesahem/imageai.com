import { prisma } from "db";
import type { ModelTraningInput } from "common/infered";

export class ModelService {
  async getUserModels(userId: string) {
    return await prisma.model.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getModelById(modelId: string) {
    return await prisma.model.findUnique({
      where: { id: modelId },
      include: {
        outputImages: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async createModel(data: ModelTraningInput, userId: string, falAiRequestId: string) {
    return await prisma.model.create({
      data: {
        name: data.name,
        type: data.type,
        age: data.age,
        ethnicity: data.ethnicity,
        eyeColor: data.eyeColor,
        bald: data.bald,
        userId: userId,
        zipUrls: data.zipUrls,
        falAiRequestId: falAiRequestId,
      },
    });
  }

  async updateModel(modelId: string, data: { name?: string; prompt?: string }) {
    return await prisma.model.update({
      where: { id: modelId },
      data: {
        name: data.name,
        prompt: data.prompt,
      },
    });
  }

  async deleteModel(modelId: string) {
    // Delete associated images first
    await prisma.outputImage.deleteMany({
      where: { modelId },
    });

    // Delete the model
    return await prisma.model.delete({
      where: { id: modelId },
    });
  }

  async updateTrainingStatus(falAiRequestId: string, tensorPath: string) {
    return await prisma.model.updateMany({
      where: { falAiRequestId },
      data: {
        trainingStatus: "Completed",
        tensorPath: tensorPath,
      },
    });
  }

  async getModelImages(modelId: string, limit: number, offset: number) {
    return await prisma.outputImage.findMany({
      where: { modelId },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });
  }
}

export const modelService = new ModelService();
