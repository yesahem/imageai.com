# Frontend Architecture Documentation

## Overview
The frontend follows a modern, scalable architecture with proper separation of concerns, reusable hooks, and centralized API management.

## Project Structure

```
apps/web/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # User dashboard
│   ├── models/[id]/             # Model detail page
│   ├── images/[id]/             # Image detail page
│   ├── packs/                   # Packs browsing
│   ├── profile/                 # User profile
│   ├── settings/                # Settings
│   ├── trainModel/              # Model training
│   └── components/              # Shared UI components
├── hooks/                        # Custom React hooks
│   ├── use-api.ts               # Data fetching hooks
│   └── use-mutations.ts         # Data mutation hooks
├── lib/                          # Utility libraries
│   ├── api-client.ts            # Axios client wrapper
│   ├── api.ts                   # API endpoints
│   └── utils.ts                 # Helper functions
├── types/                        # TypeScript type definitions
│   └── index.ts                 # Shared types
└── public/                       # Static assets
```

## Architecture Layers

### 1. **Types Layer** (`types/`)
- **Purpose**: Centralized TypeScript interfaces and types
- **Files**: `index.ts`
- **Exports**: Model, OutputImage, Pack, UserProfile, API request/response types

```typescript
import type { Model, OutputImage } from "@/types";
```

### 2. **API Client Layer** (`lib/api-client.ts`)
- **Purpose**: Low-level HTTP client with auth token management
- **Pattern**: Singleton ApiClient class
- **Features**:
  - Automatic auth token injection
  - Generic HTTP methods (GET, POST, PATCH, DELETE, PUT)
  - Error handling
  - Base URL configuration

```typescript
import { apiClient } from "@/lib/api-client";

// Set auth token
apiClient.setAuthToken(token);

// Make requests
const data = await apiClient.get<Model>("/models/123");
```

### 3. **API Layer** (`lib/api.ts`)
- **Purpose**: High-level API methods organized by domain
- **Pattern**: Domain-specific API objects
- **Domains**:
  - `storageApi` - Presigned URLs
  - `modelsApi` - Model CRUD
  - `imagesApi` - Image CRUD
  - `packsApi` - Pack management
  - `aiApi` - AI operations
  - `userApi` - User profile

```typescript
import { api } from "@/lib/api";

// Fetch user models
const models = await api.models.getUserModels();

// Generate image
const result = await api.ai.generateImage({ prompt, modelId });
```

### 4. **Hooks Layer** (`hooks/`)

#### **Data Fetching Hooks** (`use-api.ts`)
- **Purpose**: Reusable data fetching with loading/error states
- **Pattern**: Custom hooks with auto-refetch
- **Hooks**:
  - `useModels()` - Fetch user's models
  - `useModel(id)` - Fetch single model
  - `useImages()` - Fetch user's images
  - `useImage(id)` - Fetch single image
  - `usePacks()` - Fetch all packs
  - `usePack(id)` - Fetch single pack
  - `useUserProfile()` - Fetch user profile
  - `useModelImages(id)` - Fetch model's images

```typescript
import { useModels } from "@/hooks/use-api";

function MyComponent() {
  const { models, loading, error, refetch } = useModels();
  
  if (loading) return <Skeleton />;
  if (error) return <Error message={error} />;
  
  return <ModelList models={models} />;
}
```

#### **Mutation Hooks** (`use-mutations.ts`)
- **Purpose**: Data mutations (create, update, delete)
- **Pattern**: Async functions with loading/error states
- **Hooks**:
  - `useTrainModel()` - Train new model
  - `useGenerateImage()` - Generate image
  - `useGenerateFromPack()` - Generate from pack
  - `useUpdateModel()` - Update model
  - `useDeleteModel()` - Delete model
  - `useDeleteImage()` - Delete image
  - `useFileUpload()` - Upload files

```typescript
import { useGenerateImage } from "@/hooks/use-mutations";

function GenerateForm() {
  const { generateImage, loading } = useGenerateImage();
  
  const handleSubmit = async () => {
    try {
      await generateImage({ prompt, modelId });
      // Success handling
    } catch (error) {
      // Error already shown via toast
    }
  };
  
  return <Button onClick={handleSubmit} loading={loading}>Generate</Button>;
}
```

### 5. **Pages Layer** (`app/`)
- **Purpose**: Route components using hooks for data
- **Pattern**: Simplified components focused on UI
- **Benefits**: No direct API calls, cleaner code

## API Endpoints Mapping

### Storage
```typescript
api.storage.getPresignedUrls(count)
// GET /preSignURLs?numberOfImages={count}
```

### Models
```typescript
api.models.getUserModels()
// GET /models/user

api.models.getModelById(id)
// GET /models/{id}

api.models.updateModel(id, data)
// PATCH /models/{id}

api.models.deleteModel(id)
// DELETE /models/{id}

api.models.getModelImages(id, limit, offset)
// GET /models/{id}/images?limit={limit}&offset={offset}
```

### Images
```typescript
api.images.getUserImages(limit, offset)
// GET /images/user?limit={limit}&offset={offset}

api.images.getImageById(id)
// GET /images/{id}

api.images.deleteImage(id)
// DELETE /images/{id}

api.images.getBulkImages(ids, limit, offset)
// POST /image/bulk?limit={limit}&offset={offset}
```

### Packs
```typescript
api.packs.getAllPacks()
// GET /pack/bulk

api.packs.getPackById(id)
// GET /pack/{id}

api.packs.generateFromPack(data)
// POST /pack/generate
```

### AI
```typescript
api.ai.trainModel(data)
// POST /ai/trainModel

api.ai.generateImage(data)
// POST /ai/generate
```

### User
```typescript
api.user.getUserProfile()
// GET /user/profile
```

## Authentication Flow

```
1. User authenticates via Clerk
2. Component calls `useAuth().getToken()`
3. `useApiAuth()` hook automatically sets token in apiClient
4. All API requests include Authorization header
5. Backend validates JWT and extracts userId
```

## Error Handling Strategy

### API Client Level
```typescript
// Automatic error propagation
try {
  const data = await api.models.getUserModels();
} catch (error) {
  // Error object with response data
  console.error(error.response?.data?.message);
}
```

### Hook Level
```typescript
// Hooks handle errors and show toasts
const { models, error } = useModels();

// Error state available for custom handling
if (error) {
  return <CustomErrorDisplay error={error} />;
}
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────┐
│                  React Component                      │
│  • Renders UI                                         │
│  • Handles user interactions                          │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│               Custom Hooks Layer                      │
│  • useModels(), useImages(), etc.                    │
│  • useGenerateImage(), useDeleteModel(), etc.        │
│  • Manage loading/error states                       │
│  • Auto-refetch on mount                             │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│                  API Layer (lib/api.ts)               │
│  • Domain-organized methods                          │
│  • Type-safe function signatures                     │
│  • Clean interface for backend calls                 │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│            API Client (lib/api-client.ts)             │
│  • Axios wrapper                                      │
│  • Auth token injection                              │
│  • Base URL configuration                            │
│  • HTTP method abstractions                          │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│                  Backend API                          │
│  • Express routes                                     │
│  • Controllers                                        │
│  • Services                                          │
└──────────────────────────────────────────────────────┘
```

## Before & After Comparison

### Before: Direct API Calls in Components
```typescript
// dashboard/page.tsx (507 lines, messy)
export default function DashboardPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(`${BACKEND_URL}/models/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setModels(response.data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to fetch models");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  // Repeated for images, packs, etc.
  // More repeated code for mutations...
}
```

### After: Clean Components with Hooks
```typescript
// dashboard/page.tsx (much cleaner)
import { useModels, useImages, usePacks } from "@/hooks/use-api";
import { useGenerateImage } from "@/hooks/use-mutations";

export default function DashboardPage() {
  const { models, loading: modelsLoading } = useModels();
  const { images, loading: imagesLoading } = useImages();
  const { packs } = usePacks();
  const { generateImage, loading: generating } = useGenerateImage();
  
  const handleGenerate = async (prompt: string, modelId: string) => {
    try {
      await generateImage({ prompt, modelId });
      // Success!
    } catch (error) {
      // Error already handled by hook
    }
  };
  
  return (
    // Clean UI rendering
  );
}
```

## Benefits of This Architecture

### ✅ **Separation of Concerns**
- Components focus on UI
- Hooks manage data
- API layer handles HTTP
- Types ensure type safety

### ✅ **Reusability**
- Hooks used across multiple pages
- API methods shared everywhere
- Single source of truth for endpoints

### ✅ **Maintainability**
- Easy to update API endpoints
- Centralized error handling
- Consistent patterns

### ✅ **Testability**
- Hooks can be tested independently
- API layer can be mocked
- Components simplified

### ✅ **Type Safety**
- Full TypeScript coverage
- IntelliSense support
- Compile-time error checking

### ✅ **Developer Experience**
- Auto-complete for API methods
- Clear documentation
- Consistent patterns
- Less boilerplate

## Usage Examples

### Fetching Data
```typescript
// Simple data fetching
const { models, loading, error, refetch } = useModels();

// With parameters
const { images } = useImages(20, 0); // limit, offset

// Single item
const { model } = useModel(modelId);
```

### Mutations
```typescript
// Training a model
const { trainModel, loading } = useTrainModel();
await trainModel({
  name: "My Model",
  type: "person",
  age: 25,
  ethnicity: "caucasian",
  eyeColor: "blue",
  bald: false,
  zipUrls: "https://...",
});

// Generating an image
const { generateImage } = useGenerateImage();
await generateImage({ prompt: "portrait", modelId: "123" });

// Deleting with redirect
const { deleteModel } = useDeleteModel();
await deleteModel(modelId, "/dashboard");
```

### Direct API Calls (when needed)
```typescript
import { api } from "@/lib/api";

// Still available for non-hook scenarios
const models = await api.models.getUserModels();
const image = await api.ai.generateImage({ prompt, modelId });
```

## Migration Guide

### Step 1: Replace Direct Axios Calls
```diff
- const response = await axios.get(`${BACKEND_URL}/models/user`, {
-   headers: { Authorization: `Bearer ${token}` },
- });
- setModels(response.data);

+ const { models } = useModels();
```

### Step 2: Remove Manual Loading States
```diff
- const [loading, setLoading] = useState(false);
- const [error, setError] = useState(null);

+ const { data, loading, error } = useModels();
```

### Step 3: Simplify Error Handling
```diff
- try {
-   const response = await axios.post(...);
-   toast.success("Success!");
- } catch (error) {
-   console.error(error);
-   toast.error("Failed");
- }

+ try {
+   await generateImage({ prompt, modelId });
+   // Toast automatically shown
+ } catch (error) {
+   // Error already logged and toasted
+ }
```

## Best Practices

1. **Use Hooks in Components**: Always prefer hooks over direct API calls
2. **Handle Loading States**: Show skeletons/spinners during loading
3. **Handle Errors Gracefully**: Display user-friendly error messages
4. **Refetch When Needed**: Use `refetch()` after mutations
5. **Type Everything**: Use TypeScript types from `@/types`
6. **Centralize Constants**: API URLs, limits in config files

## Next Steps (Future Enhancements)

- [ ] Add React Query for advanced caching
- [ ] Implement optimistic updates
- [ ] Add pagination hooks
- [ ] Create infinite scroll hooks
- [ ] Add request cancellation
- [ ] Implement retry logic
- [ ] Add offline support
- [ ] Create loading/error components
- [ ] Add E2E tests with Playwright
- [ ] Add Storybook for components
