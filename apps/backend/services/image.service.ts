import { prisma } from "db";

export class ImageService {
  async getUserImages(userId: string, limit: number, offset: number) {
    return await prisma.outputImage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });
  }

  async getImageById(imageId: string) {
    return await prisma.outputImage.findUnique({
      where: { id: imageId },
      include: { model: true },
    });
  }

  async createImage(data: {
    prompt: string;
    imageUrl: string;
    modelId: string;
    userId: string;
    falAiRequestId: string;
  }) {
    return await prisma.outputImage.create({
      data: {
        prompt: data.prompt,
        imageUrl: data.imageUrl,
        modelId: data.modelId,
        userId: data.userId,
        falAiRequestId: data.falAiRequestId,
      },
    });
  }

  async createManyImages(
    images: Array<{
      prompt: string;
      userId: string;
      modelId: string;
      imageUrl: string;
      falAiRequestId: string;
    }>
  ) {
    return await prisma.outputImage.createManyAndReturn({
      data: images,
    });
  }

  async deleteImage(imageId: string) {
    return await prisma.outputImage.delete({
      where: { id: imageId },
    });
  }

  async updateImageStatus(falAiRequestId: string, imageUrl: string) {
    return await prisma.outputImage.updateMany({
      where: { falAiRequestId },
      data: {
        status: "Generated",
        imageUrl: imageUrl,
      },
    });
  }

  async getBulkImages(imageIds: string[], userId: string, limit: number, offset: number) {
    return await prisma.outputImage.findMany({
      where: {
        id: { in: imageIds },
        userId: userId,
      },
      skip: offset,
      take: limit,
    });
  }
}

export const imageService = new ImageService();
