# Backend Architecture Flow

## Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Request                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    index.ts (Entry Point)                    │
│  • Express app setup                                         │
│  • Middleware (cors, json, urlencoded)                       │
│  • Route registration                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Routes Layer                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  storage.routes.ts    model.routes.ts                  │ │
│  │  image.routes.ts      pack.routes.ts                   │ │
│  │  ai.routes.ts         user.routes.ts                   │ │
│  │  webhook.routes.ts                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  • Define endpoints                                          │
│  • Apply authentication middleware                           │
│  • Route to appropriate controller                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Middleware (Optional)                      │
│  • authMiddleWare - JWT validation from Clerk                │
│  • Extracts userId from token                                │
│  • Attaches to req.userId                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Controllers Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  StorageController    ModelController                  │ │
│  │  ImageController      PackController                   │ │
│  │  UserController       WebhookController                │ │
│  └────────────────────────────────────────────────────────┘ │
│  • Handle HTTP request/response                              │
│  • Validate request data                                     │
│  • Call appropriate service methods                          │
│  • Format and send response                                  │
│  • Handle errors                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     Services Layer                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  StorageService      ModelService                      │ │
│  │  ImageService        PackService                       │ │
│  │  UserService         AIService                         │ │
│  └────────────────────────────────────────────────────────┘ │
│  • Business logic                                            │
│  • Data validation                                           │
│  • Database operations                                       │
│  • External API calls                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data/External Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Prisma/DB      │  │  FAL AI API     │  │  R2 Storage │ │
│  │  • Models       │  │  • Train        │  │  • Upload   │ │
│  │  • Images       │  │  • Generate     │  │  • Presign  │ │
│  │  • Packs        │  │  • Webhooks     │  │             │ │
│  │  • Users        │  │                 │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Example: Creating a New Model

```
1. POST /ai/trainModel
   ↓
2. routes/ai.routes.ts
   ↓ (applies authMiddleWare)
3. middleware.ts
   ↓ (validates JWT, extracts userId)
4. controllers/model.controller.ts → trainModel()
   ↓
5. services/ai.service.ts → trainModel()
   ↓ (calls FAL AI)
6. FAL AI API
   ↓ (returns request_id)
7. services/model.service.ts → createModel()
   ↓
8. Prisma → database
   ↓
9. Response sent to client
```

## Dependency Flow

```
index.ts
  ├── routes/*.routes.ts
  │     ├── middleware.ts (auth)
  │     └── controllers/*.controller.ts
  │           └── services/*.service.ts
  │                 ├── models/FalAiModel.ts
  │                 ├── Prisma (db package)
  │                 └── config/index.ts
  └── config/index.ts
```

## File Responsibilities Matrix

| Layer        | File                     | Responsibilities                                  | Dependencies        |
|--------------|--------------------------|--------------------------------------------------|---------------------|
| Entry        | index.ts                 | App setup, route registration                    | routes/*, config    |
| Config       | config/index.ts          | Environment variables, settings                  | None                |
| Routes       | routes/*.routes.ts       | Endpoint definitions, middleware application     | controllers, middleware |
| Middleware   | middleware.ts            | JWT validation, user extraction                  | None                |
| Controllers  | controllers/*.ts         | Request handling, response formatting            | services            |
| Services     | services/*.ts            | Business logic, data operations                  | Prisma, FAL AI, config |
| Models       | models/FalAiModel.ts     | FAL AI wrapper                                   | config              |

## Key Design Principles

### 1. **Single Responsibility**
Each file/class has one clear purpose.

### 2. **Dependency Injection**
Services are instantiated once and imported where needed.

### 3. **Layered Architecture**
Clear separation: Routes → Controllers → Services → Data

### 4. **DRY (Don't Repeat Yourself)**
Common logic extracted to services for reuse.

### 5. **Error Handling**
Consistent try-catch blocks in controllers.

### 6. **Type Safety**
TypeScript types throughout, Express types imported correctly.

## Code Organization Benefits

```
Before (Monolithic):
┌────────────────────┐
│    index.ts        │
│   (697 lines)      │
│  • All routes      │
│  • All logic       │
│  • All DB calls    │
│  • All validations │
└────────────────────┘

After (Modular):
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Routes    │→ │ Controllers │→ │  Services   │
│  (~10 lines │  │ (~30 lines  │  │ (~50 lines  │
│  per file)  │  │  per file)  │  │  per file)  │
└─────────────┘  └─────────────┘  └─────────────┘
     ↓                  ↓                  ↓
  Easy to          Easy to          Easy to
  navigate         test            reuse
```

## Testing Strategy (Future Enhancement)

```
┌─────────────────────────────────────────┐
│          Unit Tests                      │
│  • Service methods (business logic)      │
│  • Controller methods (request handling) │
│  • Utility functions                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│       Integration Tests                  │
│  • API endpoints (full request cycle)    │
│  • Database operations                   │
│  • External API mocking                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         E2E Tests                        │
│  • Complete user flows                   │
│  • Frontend + Backend integration        │
└─────────────────────────────────────────┘
```
