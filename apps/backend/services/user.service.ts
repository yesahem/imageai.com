import { prisma } from "db";

export class UserService {
  async getUserProfile(clerkId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return null;
    }

    const [modelCount, imageCount, completedModels] = await Promise.all([
      prisma.model.count({ where: { userId: clerkId } }),
      prisma.outputImage.count({ where: { userId: clerkId } }),
      prisma.model.count({
        where: {
          userId: clerkId,
          trainingStatus: "Completed",
        },
      }),
    ]);

    return {
      user,
      stats: {
        totalModels: modelCount,
        completedModels,
        totalImages: imageCount,
      },
    };
  }
}

export const userService = new UserService();
