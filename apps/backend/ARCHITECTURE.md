# Backend Architecture Documentation

## Overview
The backend has been refactored from a monolithic 697-line `index.ts` file into a professional, modular architecture following industry best practices.

## Project Structure

```
apps/backend/
├── index.ts                    # Application entry point
├── middleware.ts               # Authentication middleware
├── types.d.ts                  # Type definitions
├── config/
│   └── index.ts               # Centralized configuration
├── controllers/
│   ├── storage.controller.ts  # Handles presigned URL generation
│   ├── model.controller.ts    # Model CRUD operations
│   ├── image.controller.ts    # Image CRUD and generation
│   ├── pack.controller.ts     # Pack management and generation
│   ├── user.controller.ts     # User profile operations
│   └── webhook.controller.ts  # Webhook handlers
├── services/
│   ├── storage.service.ts     # S3/R2 storage logic
│   ├── model.service.ts       # Model business logic
│   ├── image.service.ts       # Image business logic
│   ├── pack.service.ts        # Pack business logic
│   ├── user.service.ts        # User business logic
│   └── ai.service.ts          # FAL AI integration
├── routes/
│   ├── storage.routes.ts      # Storage endpoints
│   ├── model.routes.ts        # Model endpoints
│   ├── image.routes.ts        # Image endpoints
│   ├── pack.routes.ts         # Pack endpoints
│   ├── ai.routes.ts           # AI training/generation endpoints
│   ├── user.routes.ts         # User endpoints
│   └── webhook.routes.ts      # Webhook endpoints
└── models/
    ├── BaseMode.ts            # Abstract base model
    └── FalAiModel.ts          # FAL AI integration wrapper

```

## Architecture Layers

### 1. **Routes Layer** (`routes/`)
- **Responsibility**: Define API endpoints and apply middleware
- **Pattern**: Each domain (models, images, packs, etc.) has its own route file
- **Example**: `model.routes.ts` defines all `/models/*` endpoints
- **Best Practice**: Routes are thin - they only wire endpoints to controllers

### 2. **Controllers Layer** (`controllers/`)
- **Responsibility**: Handle HTTP requests/responses and validation
- **Pattern**: One controller per domain (ModelController, ImageController, etc.)
- **Example**: `ModelController.getUserModels()` handles GET /models/user
- **Best Practice**: Controllers delegate business logic to services

### 3. **Services Layer** (`services/`)
- **Responsibility**: Business logic and data access
- **Pattern**: Services encapsulate domain-specific operations
- **Example**: `ModelService.createModel()` handles model creation logic
- **Best Practice**: Services are reusable across controllers

### 4. **Configuration** (`config/`)
- **Responsibility**: Centralized environment variables and settings
- **Pattern**: Export typed configuration object
- **Example**: `config.r2.bucket` for R2 bucket name
- **Best Practice**: Single source of truth for configuration

## API Endpoints

### Storage
- `GET /preSignURLs` - Generate presigned URLs for file uploads

### Models
- `GET /models/user` - Get all models for authenticated user
- `GET /models/:id` - Get single model by ID
- `PATCH /models/:id` - Update model name/prompt
- `DELETE /models/:id` - Delete model and associated images
- `GET /models/:id/images` - Get all images for a model

### Images
- `GET /images/user` - Get all images for authenticated user
- `GET /images/:id` - Get single image by ID
- `DELETE /images/:id` - Delete image
- `POST /images/bulk` - Get multiple images by IDs

### Packs
- `GET /pack/bulk` - Get all available packs
- `GET /pack/:id` - Get pack details with prompts
- `POST /pack/generate` - Generate images from pack prompts

### AI
- `POST /ai/trainModel` - Start model training
- `POST /ai/generate` - Generate image from trained model

### User
- `GET /user/profile` - Get user profile and statistics

### Webhooks
- `POST /webhook/image` - Handle image generation webhook
- `POST /webhook/train` - Handle training completion webhook

## Authentication

All routes except webhooks and health check require JWT authentication via Clerk:

```typescript
// Applied via middleware
router.use(authMiddleWare);
```

The middleware extracts `userId` from JWT and attaches it to `req.userId`.

## Database Access

Database operations use Prisma ORM through the `db` package:

```typescript
import { prisma } from "db";

// Example
const models = await prisma.model.findMany({ where: { userId } });
```

## External Integrations

### FAL AI
- Training models: `aiService.trainModel()`
- Generating images: `aiService.generateImage()`
- Webhook callbacks for completion

### Cloudflare R2
- Presigned URL generation for uploads
- S3-compatible storage
- Managed via `StorageService`

## Error Handling

All controllers follow consistent error handling:

```typescript
try {
  // Business logic
  res.json(result);
} catch (error) {
  console.error("Context-specific error message:", error);
  res.status(500).json({ message: "User-friendly error" });
}
```

## Environment Variables

Required environment variables (see `.env.example`):

```env
PORT=4000
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_KEY=your_r2_secret_key
BUCKET_NAME=your_bucket_name
R2_ENDPOINT=your_r2_endpoint
WEBHOOK_URL=your_webhook_url
FAL_KEY=your_fal_api_key
DATABASE_URL=your_database_url
```

## Development Workflow

### Adding a New Feature

1. **Create Service** (if needed)
   ```typescript
   // services/feature.service.ts
   export class FeatureService {
     async doSomething() { /* logic */ }
   }
   ```

2. **Create Controller**
   ```typescript
   // controllers/feature.controller.ts
   export class FeatureController {
     async handleRequest(req: Request, res: Response) {
       const result = await featureService.doSomething();
       res.json(result);
     }
   }
   ```

3. **Create Routes**
   ```typescript
   // routes/feature.routes.ts
   const router = Router();
   router.get("/", featureController.handleRequest);
   export default router;
   ```

4. **Register in index.ts**
   ```typescript
   import featureRoutes from "./routes/feature.routes";
   app.use("/feature", featureRoutes);
   ```

### Running the Server

```bash
bun run index.ts
```

## Benefits of This Architecture

✅ **Separation of Concerns**: Each layer has a single responsibility
✅ **Maintainability**: Easy to locate and modify specific functionality
✅ **Testability**: Services and controllers can be unit tested independently
✅ **Scalability**: New features can be added without touching existing code
✅ **Readability**: Clear structure makes onboarding new developers easier
✅ **Reusability**: Services can be used by multiple controllers
✅ **Type Safety**: Full TypeScript support with proper imports

## Migration Notes

The old monolithic `index.ts` has been backed up as `index.old.ts`. All functionality has been preserved and organized into the new structure.

### Breaking Changes
None - all endpoints maintain the same paths and behavior.

### What Changed
- Code organization only
- No API changes
- No behavior changes
- Better maintainability and extensibility

## Next Steps

Consider these enhancements:
- [ ] Add request validation middleware (Zod schemas)
- [ ] Implement error handling middleware
- [ ] Add API rate limiting
- [ ] Create comprehensive unit tests
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement logging service (Winston/Pino)
- [ ] Add database transaction management
- [ ] Create DTOs (Data Transfer Objects)
