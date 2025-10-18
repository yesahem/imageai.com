import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { api } from "@/lib/api";
import type {
  TrainModelRequest,
  GenerateImageRequest,
  GenerateFromPackRequest,
  UpdateModelRequest,
} from "@/types";
import { toast } from "sonner";
import { useApiAuth } from "./use-api";

/**
 * Hook for training a new model
 */
export const useTrainModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useApiAuth();

  const trainModel = async (data: TrainModelRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.ai.trainModel(data);
      toast.success(response.message || "Model training started successfully!");
      return response.model;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to start model training";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { trainModel, loading, error };
};

/**
 * Hook for generating an image
 */
export const useGenerateImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useApiAuth();

  const generateImage = async (data: GenerateImageRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.ai.generateImage(data);
      toast.success(response.message || "Image generation started!");
      return response.image;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to generate image";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateImage, loading, error };
};

/**
 * Hook for generating images from a pack
 */
export const useGenerateFromPack = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useApiAuth();

  const generateFromPack = async (data: GenerateFromPackRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.packs.generateFromPack(data);
      toast.success(response.message || "Pack generation started!");
      return response.images;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to generate from pack";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateFromPack, loading, error };
};

/**
 * Hook for updating a model
 */
export const useUpdateModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useApiAuth();

  const updateModel = async (modelId: string, data: UpdateModelRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedModel = await api.models.updateModel(modelId, data);
      toast.success("Model updated successfully!");
      return updatedModel;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update model";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateModel, loading, error };
};

/**
 * Hook for deleting a model
 */
export const useDeleteModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useApiAuth();

  const deleteModel = async (modelId: string, redirectPath?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.models.deleteModel(modelId);
      toast.success(response.message || "Model deleted successfully!");
      
      if (redirectPath) {
        router.push(redirectPath);
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete model";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteModel, loading, error };
};

/**
 * Hook for deleting an image
 */
export const useDeleteImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useApiAuth();

  const deleteImage = async (imageId: string, redirectPath?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.images.deleteImage(imageId);
      toast.success(response.message || "Image deleted successfully!");
      
      if (redirectPath) {
        router.push(redirectPath);
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete image";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteImage, loading, error };
};

/**
 * Hook for uploading files to presigned URLs
 */
export const useFileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File, presignedUrl: string) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      await apiClient.put(presignedUrl, formData, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setProgress(percentCompleted);
        },
      });

      setProgress(100);
      toast.success("File uploaded successfully!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to upload file";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, loading, error, progress };
};
