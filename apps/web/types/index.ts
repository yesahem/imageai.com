// Shared TypeScript interfaces for the application

export interface Model {
  id: string;
  name: string;
  type: string;
  age: number;
  ethnicity: string;
  eyeColor: string;
  bald: boolean;
  trainingStatus: "Pending" | "Training" | "Completed" | "Failed";
  tensorPath: string | null;
  zipUrls: string;
  prompt?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  falAiRequestId: string;
}

export interface OutputImage {
  id: string;
  imageUrl: string;
  prompt: string;
  status: "Pending" | "Processing" | "Generated" | "Failed";
  createdAt: string;
  updatedAt: string;
  modelId: string;
  userId: string;
  falAiRequestId: string;
  model?: Model;
}

export interface Pack {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  prompt?: PackPrompt[];
}

export interface PackPrompt {
  id: string;
  prompt: string;
  packId: string;
  createdAt: string;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  user: User;
  stats: {
    totalModels: number;
    completedModels: number;
    totalImages: number;
  };
}

export interface PresignedUrl {
  key: string;
  url: string;
}

export interface TrainModelRequest {
  name: string;
  type: string;
  age: number;
  ethnicity: string;
  eyeColor: string;
  bald: boolean;
  zipUrls: string;
}

export interface GenerateImageRequest {
  prompt: string;
  modelId: string;
}

export interface GenerateFromPackRequest {
  modelId: string;
  packId: string;
}

export interface UpdateModelRequest {
  name?: string;
  prompt?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
