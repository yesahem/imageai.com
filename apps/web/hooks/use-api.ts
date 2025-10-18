import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api-client";
import { api } from "@/lib/api";
import type { Model, OutputImage, Pack, UserProfile } from "@/types";
import { toast } from "sonner";

/**
 * Hook to automatically set auth token for API requests
 */
export const useApiAuth = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const setToken = async () => {
      const token = await getToken();
      apiClient.setAuthToken(token);
    };
    setToken();
  }, [getToken]);
};

/**
 * Hook to fetch user's models
 */
export const useModels = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useApiAuth();

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.models.getUserModels();
      setModels(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch models";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return { models, loading, error, refetch: fetchModels };
};

/**
 * Hook to fetch a single model by ID
 */
export const useModel = (modelId: string | null) => {
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useApiAuth();

  const fetchModel = useCallback(async () => {
    if (!modelId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.models.getModelById(modelId);
      setModel(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch model";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [modelId]);

  useEffect(() => {
    fetchModel();
  }, [fetchModel]);

  return { model, loading, error, refetch: fetchModel };
};

/**
 * Hook to fetch user's images
 */
export const useImages = (limit: number = 10, offset: number = 0) => {
  const [images, setImages] = useState<OutputImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useApiAuth();

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.images.getUserImages(limit, offset);
      setImages(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch images";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, loading, error, refetch: fetchImages };
};

/**
 * Hook to fetch a single image by ID
 */
export const useImage = (imageId: string | null) => {
  const [image, setImage] = useState<OutputImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useApiAuth();

  const fetchImage = useCallback(async () => {
    if (!imageId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.images.getImageById(imageId);
      setImage(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch image";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [imageId]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  return { image, loading, error, refetch: fetchImage };
};

/**
 * Hook to fetch all packs
 */
export const usePacks = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPacks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.packs.getAllPacks();
      setPacks(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch packs";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPacks();
  }, [fetchPacks]);

  return { packs, loading, error, refetch: fetchPacks };
};

/**
 * Hook to fetch a single pack by ID
 */
export const usePack = (packId: string | null) => {
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPack = useCallback(async () => {
    if (!packId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.packs.getPackById(packId);
      setPack(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch pack";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [packId]);

  useEffect(() => {
    fetchPack();
  }, [fetchPack]);

  return { pack, loading, error, refetch: fetchPack };
};

/**
 * Hook to fetch user profile
 */
export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useApiAuth();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.user.getUserProfile();
      setProfile(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};

/**
 * Hook to fetch images for a specific model
 */
export const useModelImages = (modelId: string | null, limit: number = 10, offset: number = 0) => {
  const [images, setImages] = useState<OutputImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useApiAuth();

  const fetchImages = useCallback(async () => {
    if (!modelId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.models.getModelImages(modelId, limit, offset);
      setImages(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch model images";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [modelId, limit, offset]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, loading, error, refetch: fetchImages };
};
