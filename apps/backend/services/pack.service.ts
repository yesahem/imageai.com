import { prisma } from "db";

export class PackService {
  async getAllPacks() {
    return await prisma.packs.findMany({});
  }

  async getPackById(packId: string) {
    return await prisma.packs.findUnique({
      where: { id: packId },
      include: { prompt: true },
    });
  }

  async getPackPrompts(packId: string) {
    return await prisma.packPrompts.findMany({
      where: { packId },
    });
  }
}

export const packService = new PackService();
