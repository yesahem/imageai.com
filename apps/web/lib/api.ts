import { apiClient } from "@/lib/api-client";
import type {
  Model,
  OutputImage,
  Pack,
  UserProfile,
  PresignedUrl,
  TrainModelRequest,
  GenerateImageRequest,
  GenerateFromPackRequest,
  UpdateModelRequest,
} from "@/types";

/**
 * Storage API
 */
export const storageApi = {
  /**
   * Get presigned URLs for file uploads
   */
  getPresignedUrls: async (numberOfImages: number = 1): Promise<{ preSignURLs: PresignedUrl[] }> => {
    return apiClient.get(`/preSignURLs?numberOfImages=${numberOfImages}`);
  },
};

/**
 * Models API
 */
export const modelsApi = {
  /**
   * Get all models for the authenticated user
   */
  getUserModels: async (): Promise<Model[]> => {
    return apiClient.get("/models/user");
  },

  /**
   * Get a single model by ID
   */
  getModelById: async (modelId: string): Promise<Model> => {
    return apiClient.get(`/models/${modelId}`);
  },

  /**
   * Update a model
   */
  updateModel: async (modelId: string, data: UpdateModelRequest): Promise<Model> => {
    return apiClient.patch(`/models/${modelId}`, data);
  },

  /**
   * Delete a model
   */
  deleteModel: async (modelId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/models/${modelId}`);
  },

  /**
   * Get all images for a specific model
   */
  getModelImages: async (
    modelId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<OutputImage[]> => {
    return apiClient.get(`/models/${modelId}/images?limit=${limit}&offset=${offset}`);
  },
};

/**
 * Images API
 */
export const imagesApi = {
  /**
   * Get all images for the authenticated user
   */
  getUserImages: async (limit: number = 10, offset: number = 0): Promise<OutputImage[]> => {
    return apiClient.get(`/images/user?limit=${limit}&offset=${offset}`);
  },

  /**
   * Get a single image by ID
   */
  getImageById: async (imageId: string): Promise<OutputImage> => {
    return apiClient.get(`/images/${imageId}`);
  },

  /**
   * Delete an image
   */
  deleteImage: async (imageId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/images/${imageId}`);
  },

  /**
   * Get multiple images by IDs
   */
  getBulkImages: async (
    imageIds: string[],
    limit: number = 50,
    offset: number = 0
  ): Promise<OutputImage[]> => {
    return apiClient.post(`/image/bulk?limit=${limit}&offset=${offset}`, { imageIds });
  },
};

/**
 * Packs API
 */
export const packsApi = {
  /**
   * Get all available packs
   */
  getAllPacks: async (): Promise<Pack[]> => {
    return apiClient.get("/pack/bulk");
  },

  /**
   * Get a single pack by ID with prompts
   */
  getPackById: async (packId: string): Promise<Pack> => {
    return apiClient.get(`/pack/${packId}`);
  },

  /**
   * Generate images from a pack
   */
  generateFromPack: async (
    data: GenerateFromPackRequest
  ): Promise<{ message: string; images: OutputImage[] }> => {
    return apiClient.post("/pack/generate", data);
  },
};

/**
 * AI API
 */
export const aiApi = {
  /**
   * Train a new model
   */
  trainModel: async (data: TrainModelRequest): Promise<{ message: string; model: Model }> => {
    return apiClient.post("/ai/trainModel", data);
  },

  /**
   * Generate an image from a trained model
   */
  generateImage: async (
    data: GenerateImageRequest
  ): Promise<{ message: string; image: OutputImage }> => {
    return apiClient.post("/ai/generate", data);
  },
};

/**
 * User API
 */
export const userApi = {
  /**
   * Get user profile and statistics
   */
  getUserProfile: async (): Promise<UserProfile> => {
    return apiClient.get("/user/profile");
  },
};

/**
 * Combined API object for easy imports
 */
export const api = {
  storage: storageApi,
  models: modelsApi,
  images: imagesApi,
  packs: packsApi,
  ai: aiApi,
  user: userApi,
};
