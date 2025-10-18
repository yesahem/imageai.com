# Frontend Quick Reference

## 📚 Import Cheat Sheet

```typescript
// Types
import type { Model, OutputImage, Pack, UserProfile } from "@/types";

// Data Fetching Hooks
import {
  useModels,
  useModel,
  useImages,
  useImage,
  usePacks,
  usePack,
  useUserProfile,
  useModelImages,
} from "@/hooks/use-api";

// Mutation Hooks
import {
  useTrainModel,
  useGenerateImage,
  useGenerateFromPack,
  useUpdateModel,
  useDeleteModel,
  useDeleteImage,
  useFileUpload,
} from "@/hooks/use-mutations";

// Direct API (for non-hook usage)
import { api } from "@/lib/api";

// API Client (rarely needed)
import { apiClient } from "@/lib/api-client";
```

## 🎯 Common Patterns

### Fetch and Display Data
```typescript
function ModelsList() {
  const { models, loading, error, refetch } = useModels();
  
  if (loading) return <Skeleton />;
  if (error) return <Error message={error} />;
  
  return (
    <div>
      {models.map(model => (
        <ModelCard key={model.id} model={model} />
      ))}
      <Button onClick={refetch}>Refresh</Button>
    </div>
  );
}
```

### Create/Mutate Data
```typescript
function GenerateImageForm() {
  const [prompt, setPrompt] = useState("");
  const { generateImage, loading } = useGenerateImage();
  const { refetch } = useImages(); // Refetch after generation
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await generateImage({ prompt, modelId: "123" });
      setPrompt(""); // Clear form
      refetch(); // Update list
    } catch (error) {
      // Error already shown via toast
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input value={prompt} onChange={e => setPrompt(e.target.value)} />
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "Generate"}
      </Button>
    </form>
  );
}
```

### Delete with Confirmation
```typescript
function DeleteButton({ modelId }: { modelId: string }) {
  const { deleteModel, loading } = useDeleteModel();
  const { refetch } = useModels();
  
  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    
    try {
      await deleteModel(modelId);
      refetch(); // Update list
    } catch (error) {
      // Error handled by hook
    }
  };
  
  return (
    <Button onClick={handleDelete} disabled={loading} variant="destructive">
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}
```

### Detail Page with Dynamic Route
```typescript
"use client";

function ModelDetailPage({ params }: { params: { id: string } }) {
  const { model, loading, error } = useModel(params.id);
  const { images } = useModelImages(params.id);
  
  if (loading) return <Skeleton />;
  if (error || !model) return <NotFound />;
  
  return (
    <div>
      <h1>{model.name}</h1>
      <p>Status: {model.trainingStatus}</p>
      <ImageGallery images={images} />
    </div>
  );
}
```

### File Upload
```typescript
function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const { uploadFile, loading, progress } = useFileUpload();
  
  const handleUpload = async () => {
    if (!file) return;
    
    // Get presigned URL first
    const { preSignURLs } = await api.storage.getPresignedUrls(1);
    const { url, key } = preSignURLs[0];
    
    // Upload file
    try {
      await uploadFile(file, url);
      // Use `key` for further processing
    } catch (error) {
      // Error handled
    }
  };
  
  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <Button onClick={handleUpload} disabled={loading}>
        Upload
      </Button>
      {loading && <Progress value={progress} />}
    </div>
  );
}
```

## 🔧 API Methods Quick Reference

### Storage
```typescript
api.storage.getPresignedUrls(count)
```

### Models
```typescript
api.models.getUserModels()
api.models.getModelById(id)
api.models.updateModel(id, { name, prompt })
api.models.deleteModel(id)
api.models.getModelImages(id, limit, offset)
```

### Images
```typescript
api.images.getUserImages(limit, offset)
api.images.getImageById(id)
api.images.deleteImage(id)
api.images.getBulkImages(ids, limit, offset)
```

### Packs
```typescript
api.packs.getAllPacks()
api.packs.getPackById(id)
api.packs.generateFromPack({ modelId, packId })
```

### AI
```typescript
api.ai.trainModel({ name, type, age, ethnicity, eyeColor, bald, zipUrls })
api.ai.generateImage({ prompt, modelId })
```

### User
```typescript
api.user.getUserProfile()
```

## 🎨 Hook Usage Patterns

### Read-Only Data Hooks
All data hooks return: `{ data, loading, error, refetch }`

```typescript
const { models, loading, error, refetch } = useModels();
const { model, loading, error, refetch } = useModel(id);
const { images, loading, error, refetch } = useImages(limit, offset);
const { image, loading, error, refetch } = useImage(id);
const { packs, loading, error, refetch } = usePacks();
const { pack, loading, error, refetch } = usePack(id);
const { profile, loading, error, refetch } = useUserProfile();
const { images, loading, error, refetch } = useModelImages(id, limit, offset);
```

### Mutation Hooks
All mutation hooks return: `{ mutationFn, loading, error }`

```typescript
const { trainModel, loading, error } = useTrainModel();
const { generateImage, loading, error } = useGenerateImage();
const { generateFromPack, loading, error } = useGenerateFromPack();
const { updateModel, loading, error } = useUpdateModel();
const { deleteModel, loading, error } = useDeleteModel();
const { deleteImage, loading, error } = useDeleteImage();
const { uploadFile, loading, error, progress } = useFileUpload();
```

## 📦 Type Definitions

### Model
```typescript
interface Model {
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
```

### OutputImage
```typescript
interface OutputImage {
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
```

### Pack
```typescript
interface Pack {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  prompt?: PackPrompt[];
}
```

### UserProfile
```typescript
interface UserProfile {
  user: User;
  stats: {
    totalModels: number;
    completedModels: number;
    totalImages: number;
  };
}
```

## 🚀 Complete Example

```typescript
"use client";

import { useState } from "react";
import { useModels, useImages } from "@/hooks/use-api";
import { useGenerateImage, useDeleteModel } from "@/hooks/use-mutations";
import type { Model } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  
  // Data fetching
  const { models, loading: modelsLoading, refetch: refetchModels } = useModels();
  const { images, loading: imagesLoading, refetch: refetchImages } = useImages();
  
  // Mutations
  const { generateImage, loading: generating } = useGenerateImage();
  const { deleteModel, loading: deleting } = useDeleteModel();
  
  // Generate image handler
  const handleGenerate = async () => {
    if (!selectedModel || !prompt) {
      toast.error("Please select a model and enter a prompt");
      return;
    }
    
    try {
      await generateImage({ prompt, modelId: selectedModel.id });
      setPrompt("");
      refetchImages();
    } catch (error) {
      // Error already handled by hook
    }
  };
  
  // Delete model handler
  const handleDelete = async (modelId: string) => {
    if (!confirm("Delete this model?")) return;
    
    try {
      await deleteModel(modelId);
      refetchModels();
    } catch (error) {
      // Error already handled
    }
  };
  
  if (modelsLoading || imagesLoading) {
    return <Skeleton className="h-screen" />;
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Models Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">My Models</h2>
        <div className="grid grid-cols-3 gap-4">
          {models.map(model => (
            <Card key={model.id} className="p-4">
              <h3>{model.name}</h3>
              <p className="text-sm text-gray-600">{model.trainingStatus}</p>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => setSelectedModel(model)}
                  variant={selectedModel?.id === model.id ? "default" : "outline"}
                >
                  Select
                </Button>
                <Button
                  onClick={() => handleDelete(model.id)}
                  variant="destructive"
                  disabled={deleting}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Generate Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Generate Image</h2>
        <div className="flex gap-4">
          <Input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="flex-1"
          />
          <Button
            onClick={handleGenerate}
            disabled={generating || !selectedModel}
          >
            {generating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </section>
      
      {/* Images Gallery */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Images</h2>
        <div className="grid grid-cols-4 gap-4">
          {images.map(image => (
            <Card key={image.id} className="p-2">
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-48 object-cover rounded"
              />
              <p className="text-sm mt-2 truncate">{image.prompt}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
```

## 🎯 Best Practices

1. **Always use hooks** instead of direct API calls in components
2. **Handle loading states** with skeletons or spinners
3. **Show error messages** user-friendly (handled automatically by hooks)
4. **Refetch after mutations** to update lists
5. **Use TypeScript types** from `@/types`
6. **Validate input** before calling mutation hooks
7. **Disable buttons** during loading states
8. **Clear forms** after successful submission

## 🔍 Debugging Tips

```typescript
// Check what's being fetched
const { models, loading, error } = useModels();
console.log({ models, loading, error });

// Check API client token
import { apiClient } from "@/lib/api-client";
const token = apiClient.getRawClient().defaults.headers.common["Authorization"];
console.log("Current token:", token);

// Test API directly
import { api } from "@/lib/api";
const result = await api.models.getUserModels();
console.log(result);
```

---

**Pro Tip**: Always import types with `type` keyword:
```typescript
import type { Model } from "@/types"; // ✅ Correct
import { Model } from "@/types";      // ❌ Avoid
```
