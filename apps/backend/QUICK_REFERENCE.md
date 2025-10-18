# Quick Reference Guide

## 🚀 Where to Find Things

### Need to add a new endpoint?
1. **Create/update service** in `services/[domain].service.ts`
2. **Create/update controller** in `controllers/[domain].controller.ts`
3. **Add route** in `routes/[domain].routes.ts`
4. **Register route** in `index.ts`

### Need to modify an existing endpoint?
1. **Find the route** in `routes/` directory
2. **Check the controller** it references
3. **Modify the service** logic if needed

### Need to add environment variables?
1. **Add to** `config/index.ts`
2. **Update** `.env.example`

## 📂 File Locations

| What you need | Where to look |
|---------------|---------------|
| Database operations | `services/*.service.ts` |
| HTTP handling | `controllers/*.controller.ts` |
| Route definitions | `routes/*.routes.ts` |
| Authentication | `middleware.ts` |
| Configuration | `config/index.ts` |
| FAL AI integration | `services/ai.service.ts`, `models/FalAiModel.ts` |
| R2/Storage | `services/storage.service.ts` |

## 🔍 Common Tasks

### Add a new model endpoint
```typescript
// 1. services/model.service.ts
async getModelStats(modelId: string) {
  return await prisma.model.findUnique({
    where: { id: modelId },
    include: { _count: { select: { outputImages: true } } }
  });
}

// 2. controllers/model.controller.ts
async getModelStats(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const stats = await modelService.getModelStats(id);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
}

// 3. routes/model.routes.ts
router.get("/:id/stats", modelController.getModelStats.bind(modelController));
```

### Add authentication to a route
```typescript
// In routes file
import { authMiddleWare } from "../middleware";

router.get("/protected", authMiddleWare, controller.method);
```

### Access user ID in controller
```typescript
async someMethod(req: Request, res: Response) {
  const userId = req.userId!; // Available after authMiddleWare
}
```

## 🗺️ Architecture Map

```
📁 Backend Structure
│
├── 📄 index.ts                 → App entry point
├── 📄 middleware.ts            → JWT authentication
│
├── 📁 config/
│   └── 📄 index.ts            → Environment config
│
├── 📁 routes/                  → API endpoints
│   ├── 📄 storage.routes.ts   → /preSignURLs
│   ├── 📄 model.routes.ts     → /models/*
│   ├── 📄 image.routes.ts     → /images/*
│   ├── 📄 pack.routes.ts      → /pack/*
│   ├── 📄 ai.routes.ts        → /ai/*
│   ├── 📄 user.routes.ts      → /user/*
│   └── 📄 webhook.routes.ts   → /webhook/*
│
├── 📁 controllers/             → Request handlers
│   ├── 📄 storage.controller.ts
│   ├── 📄 model.controller.ts
│   ├── 📄 image.controller.ts
│   ├── 📄 pack.controller.ts
│   ├── 📄 user.controller.ts
│   └── 📄 webhook.controller.ts
│
├── 📁 services/                → Business logic
│   ├── 📄 storage.service.ts
│   ├── 📄 model.service.ts
│   ├── 📄 image.service.ts
│   ├── 📄 pack.service.ts
│   ├── 📄 user.service.ts
│   └── 📄 ai.service.ts
│
└── 📁 models/                  → External integrations
    ├── 📄 BaseMode.ts
    └── 📄 FalAiModel.ts
```

## 🎯 Endpoint Quick Reference

| Endpoint | File Location | Controller Method |
|----------|---------------|-------------------|
| `GET /preSignURLs` | storage.routes.ts | StorageController.getPresignedUrls |
| `POST /ai/trainModel` | ai.routes.ts | ModelController.trainModel |
| `POST /ai/generate` | ai.routes.ts | ImageController.generateImage |
| `GET /models/user` | model.routes.ts | ModelController.getUserModels |
| `GET /models/:id` | model.routes.ts | ModelController.getModelById |
| `PATCH /models/:id` | model.routes.ts | ModelController.updateModel |
| `DELETE /models/:id` | model.routes.ts | ModelController.deleteModel |
| `GET /models/:id/images` | model.routes.ts | ModelController.getModelImages |
| `GET /images/user` | image.routes.ts | ImageController.getUserImages |
| `GET /images/:id` | image.routes.ts | ImageController.getImageById |
| `DELETE /images/:id` | image.routes.ts | ImageController.deleteImage |
| `POST /image/bulk` | image.routes.ts | ImageController.getBulkImages |
| `GET /pack/bulk` | pack.routes.ts | PackController.getAllPacks |
| `GET /pack/:id` | pack.routes.ts | PackController.getPackById |
| `POST /pack/generate` | pack.routes.ts | PackController.generateFromPack |
| `GET /user/profile` | user.routes.ts | UserController.getUserProfile |
| `POST /webhook/image` | webhook.routes.ts | WebhookController.handleImageWebhook |
| `POST /webhook/train` | webhook.routes.ts | WebhookController.handleTrainingWebhook |

## 💡 Tips

### Import Path Patterns
```typescript
// Controllers
import { modelController } from "../controllers/model.controller";

// Services
import { modelService } from "../services/model.service";

// Config
import { config } from "../config";

// Middleware
import { authMiddleWare } from "../middleware";
```

### Type Imports
```typescript
// Always use type-only imports for Express types
import type { Request, Response } from "express";
```

### Service Pattern
```typescript
// Export singleton instance
export const serviceName = new ServiceClass();

// Use in controller
import { serviceName } from "../services/service.service";
```

## 🔧 Development Commands

```bash
# Start server
bun run index.ts

# With watch mode (if configured)
bun --watch index.ts

# Type check
bunx tsc --noEmit
```

## 📖 Documentation Files

- `ARCHITECTURE.md` - Full architecture guide
- `ARCHITECTURE_DIAGRAMS.md` - Visual flow diagrams
- `REFACTORING_SUMMARY.md` - Detailed refactoring info
- `QUICK_REFERENCE.md` - This file
- `README.md` - Project overview

## 🎓 Learning Path

1. Start with `index.ts` to understand app structure
2. Read `routes/*.routes.ts` to see endpoint definitions
3. Check `controllers/*.controller.ts` for request handling
4. Dive into `services/*.service.ts` for business logic
5. Review `config/index.ts` for environment setup

## ⚡ Common Patterns

### Error Handling
```typescript
try {
  const result = await service.method();
  res.json(result);
} catch (error) {
  console.error("Context:", error);
  res.status(500).json({ message: "User-friendly message" });
}
```

### Authentication Required
```typescript
router.use(authMiddleWare); // Apply to all routes in file
// OR
router.get("/path", authMiddleWare, controller.method); // Single route
```

### Pagination
```typescript
const limit = parseInt(req.query.limit as string) || 10;
const offset = parseInt(req.query.offset as string) || 0;
```

---

**Need more help?** Check the other documentation files or the code itself - it's now much easier to navigate! 🎉
